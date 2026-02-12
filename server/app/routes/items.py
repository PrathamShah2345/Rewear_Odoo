from flask import Blueprint, request, jsonify
from app import db
from app.models.item import Item
from app.models.user import User
from flask_jwt_extended import jwt_required, get_jwt_identity

items_bp = Blueprint('items', __name__)

@items_bp.route('/', methods=['POST'])
@jwt_required()
def upload_item():
    data = request.get_json()
    user_id = int(get_jwt_identity())

    existing_item = Item.query.filter_by(title=data.get('title'), user_id=user_id).first()
    if existing_item:
        return jsonify({"msg": "Item with this title already exists"}), 409

    item = Item(
        title = data.get('title'),
        description = data.get('description'),
        image_url = data.get('image_url'),
        additional_images = data.get('additional_images'), # JSON string
        price = data.get('price'),
        size = data.get('size'),
        condition = data.get('condition'),
        type = data.get('type'),
        category = data.get('category'),
        tags = data.get('tags'),
        user_id=user_id
    )

    db.session.add(item)
    db.session.commit()

    return jsonify({"msg": "Item uploaded successfully"}), 201


@items_bp.route('/', methods=['GET'])
def get_all_items():
    tags = request.args.get('tags', '').strip()

    query = Item.query.order_by(Item.created_at.desc())

    if tags:
        tag_list = [t.strip().lower() for t in tags.split(',') if t.strip()]
        for tag in tag_list:
            query = query.filter(Item.tags.ilike(f'%{tag}%'))

    items = query.all()

    result = []
    for item in items:
        result.append({
            "id": item.id,
            "title": item.title,
            "description": item.description,
            "image_url": item.image_url,
            "additional_images": item.additional_images,
            "price": item.price,
            "size": item.size,
            "condition": item.condition,
            "type": item.type,
            "category": item.category,
            "tags": item.tags,
            "created_at": item.created_at,
            "username": item.user.username
        })

    return jsonify(result), 200


@items_bp.route('/<int:item_id>', methods=['GET'])
def get_item_by_id(item_id):
    item = Item.query.get(item_id)
    if not item:
        return jsonify({"msg": "Item not found"}), 404

    return jsonify({
        "id": item.id,
        "title": item.title,
        "description": item.description,
        "image_url": item.image_url,
        "additional_images": item.additional_images,
        "price": item.price,
        "size": item.size,
        "condition": item.condition,
        "type": item.type,
        "category": item.category,
        "tags": item.tags,
        "created_at": item.created_at,
        "username": item.user.username,
        "user_id": item.user_id,
        "user_role": item.user.role
    }), 200
