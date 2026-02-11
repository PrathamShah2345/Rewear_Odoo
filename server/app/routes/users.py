from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User
from app.models.item import Item
from app import db

users_bp = Blueprint("users", __name__)


@users_bp.route("/leaderboard", methods=['GET'])
def get_leaderboard():
    users = User.query.order_by(User.points.desc()).limit(20).all()
    result = []
    for user in users:
        result.append({
            "id": user.id,
            "username": user.username,
            "points": user.points,
        })
    return jsonify(result), 200


@users_bp.route("/all", methods=['GET'])
@jwt_required()
def get_all_users():
    current_user_id = int(get_jwt_identity())
    current_user = User.query.get(current_user_id)

    if not current_user or current_user.role != 'admin':
        return jsonify({"msg": "Admin access required"}), 403

    users = User.query.order_by(User.created_at.desc()).all()
    result = []
    for user in users:
        item_count = Item.query.filter_by(user_id=user.id).count()
        result.append({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "points": user.points,
            "role": user.role,
            "items_count": item_count,
            "created_at": user.created_at.isoformat()
        })
    return jsonify(result), 200


@users_bp.route("/<int:user_id>", methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    current_user_id = int(get_jwt_identity())
    current_user = User.query.get(current_user_id)

    if not current_user or current_user.role != 'admin':
        return jsonify({"msg": "Admin access required"}), 403

    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    if user.id == current_user_id:
        return jsonify({"msg": "You cannot delete yourself"}), 400

    db.session.delete(user)
    db.session.commit()
    return jsonify({"msg": "User deleted successfully"}), 200


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

    return jsonify(item_list), 200


@users_bp.route("/profile/update", methods=['PUT'])
@jwt_required()
def update_profile():
    current_user_id = int(get_jwt_identity())
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404
    
    data = request.get_json()
    if 'profile_image' in data:
        user.profile_image = data['profile_image']
    
    # Can add other fields here if needed
    
    db.session.commit()
    return jsonify({"msg": "Profile updated successfully", "profile_image": user.profile_image}), 200
