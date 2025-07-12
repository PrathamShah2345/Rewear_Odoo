from app import db
from datetime import datetime

class Swap(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    item_id = db.Column(db.Integer, db.ForeignKey('item.id'), nullable=False)
    requested_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    requested_to = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    status = db.Column(db.String(20), default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    item = db.relationship('Item', backref='swaps')
    sender = db.relationship('User', foreign_keys=[requested_by], backref='sent_swaps')
    receiver = db.relationship('User', foreign_keys=[requested_to], backref='received_swaps')