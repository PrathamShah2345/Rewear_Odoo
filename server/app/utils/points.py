from app.models import User
from app import db

def update_points(user_id, points):
    user = User.query.get(user_id)
    if user:
        user.points = (user.points or 0) + points
        db.session.commit()
        return True
    return False

def deduct_points(user_id, points):
    user = User.query.get(user_id)
    if user and (user.points or 0) >= points:
        user.points -= points
        db.session.commit()
        return True
    return False
