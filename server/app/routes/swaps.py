from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Swap, User, Item
from app import db

swaps_bp  = Blueprint('swaps', __name__)

@swaps_bp.route('/', methods=['POST'])
@jwt_required()
def req_swaps():
    data = request.get_json()
    item_id = data.get('item_id')
    user_id = int(get_jwt_identity())

    item = Item.query.filter_by(id=item_id).first()
    if not item:
        return jsonify({"error": "Item not found"}), 404
    
    if item.user_id == user_id:
        return jsonify({"error": "You cannot swap your own item"}), 400
    
    existing_swap = Swap.query.filter_by(
        item_id=item_id,
        requested_by=user_id,
        status = 'pending'
    ).first()

    if existing_swap:
        return jsonify({"error": "You have already requested a swap for this item"}), 400
    
    swap = Swap(
        item_id = item.id, 
        requested_by = user_id,
        requested_to = item.user_id,
        status = 'pending'
    )

    db.session.add(swap)
    db.session.commit()

    return jsonify({"msg" : "Swap requested", "swap_id": swap.id}), 201


@swaps_bp.route('/<int:swap_id>', methods=['PUT'])
@jwt_required()
def respond_swap(swap_id):
    data = request.get_json()
    user_id = int(get_jwt_identity())
    new_status = data.get('status')

    if new_status not in ['accepted', 'rejected']:
        return jsonify({"error": "Invalid status"}), 400
    
    swap = Swap.query.filter_by(id=swap_id).first()
    if not swap:
        return jsonify({"error": "Swap not found"}), 404
    
    if swap.requested_to != user_id:
        return jsonify({"error": "You are not authorized to respond to this swap"}), 403

    if swap.status != 'pending':
        return jsonify({"error": f"Swap is already {swap.status}"}), 400
    
    if new_status == 'accepted':
        # Update item ownership
        item = Item.query.filter_by(id=swap.item_id).first()
        if not item:
            return jsonify({"error": "Item not found"}), 404
        
        item.user_id = swap.requested_by
        swap.status = 'accepted'
        db.session.add(item)
        db.session.commit()

        return jsonify({"msg": "Swap accepted, item ownership updated"}), 200

    swap.status = new_status
    db.session.commit()

    return jsonify({"msg": f"Swap {new_status}"}), 200


@swaps_bp.route('/mine', methods=['GET'])
@jwt_required()
def my_swaps():
    user_id = int(get_jwt_identity())

    sent = Swap.query.filter_by(requested_by=user_id).all()
    received = Swap.query.filter_by(requested_to=user_id).all()

    def formate_swap(swap):
        return {
            "id": swap.id,
            "item": {
                "id": swap.item.id,
                "title": swap.item.title,
            },
            "status": swap.status,
            "requested_by": {
                "id": swap.requested_by,
                "username": swap.sender.username
            },
            "requested_to": {
                "id": swap.requested_to,
                "username": swap.receiver.username
            },
            "created_at": swap.created_at.isoformat()
        }
    
    return jsonify({
        "sent": [formate_swap(swap) for swap in sent],
        "received": [formate_swap(swap) for swap in received]
    }), 200

