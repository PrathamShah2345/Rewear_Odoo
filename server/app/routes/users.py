from flask import Blueprint, jsonify
from app.models.user import User
from app.models.item import Item

users_bp = Blueprint("users", __name__)

@users_bp.route("/<string:username>/items", methods=['GET'])
def get_user_items(username):
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({"msg": "User not found"}), 404
    
    items = Item.query.filter_by(user_id=user.id).order_by(Item.created_at.desc()).all()
    item_list = []

    for item in items:
        item_list.append({
            "id" : item.id,
            "title": item.title,
            "description": item.description,
            "image_url": item.image_url,
            "size": item.size,
            "condition": item.condition, 
            "type": item.type,
            "category": item.category,
            "tags": item.tags,
            "created_at": item.created_at
        })

    return jsonify({
        "username": user.username,
        "total_items": len(item_list),
        "items": item_list
    }), 200
