from app import db
from datetime import datetime

class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(500), nullable=True)
    image_url = db.Column(db.String(200), nullable=True)
    additional_images = db.Column(db.Text, nullable=True) # Stores JSON string of list ["url1", "url2"]
    size = db.Column(db.String(50))
    condition = db.Column(db.String(50))
    type = db.Column(db.String(50))
    category = db.Column(db.String(50))
    tags = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', backref='items')