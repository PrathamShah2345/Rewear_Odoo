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

    item = Item(
        title = data.get('title'),
        description = data.get('description'),
        image_url = data.get('image_url'),
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
    items = Item.query.order_by(Item.created_at.desc()).all()

    result = []
    for item in items:
        result.append({
            "id": item.id,
            "title": item.title,
            "description": item.description,
            "image_url": item.image_url,
            "size": item.size,
            "condition": item.condition,
            "type": item.type,
            "category": item.category,
            "tags": item.tags,
            "created_at": item.created_at,
            "username": item.user.username
        })

    return jsonify(result), 200