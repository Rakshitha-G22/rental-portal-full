# backend/app/models.py

from . import db
from datetime import datetime

# ============================
# USER MODEL
# ============================
class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default="user")  # user or admin

    bookings = db.relationship("Booking", backref="user", lazy=True)


# ============================
# FLAT MODEL
# ============================
class Flat(db.Model):
    __tablename__ = "flats"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    location = db.Column(db.String(100))
    price = db.Column(db.Integer)
    image = db.Column(db.Text)
    tower_name = db.Column(db.String(10))
    floor = db.Column(db.Integer)
    amenities = db.Column(db.Text)  # comma-separated or JSON string
    is_booked = db.Column(db.Boolean, default=False)

    bookings = db.relationship("Booking", backref="flat", lazy=True)


# ============================
# BOOKING MODEL
# ============================
class Booking(db.Model):
    __tablename__ = "bookings"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    flat_id = db.Column(db.Integer, db.ForeignKey("flats.id"), nullable=False)
    booked_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default="confirmed")


# ============================
# SUPPORT QUERY MODEL
# ============================
class SupportQuery(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    message = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(50), default="pending")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


# ============================
# PAYMENT MODEL
# ============================
class Payment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    booking_id = db.Column(db.Integer)
    user_id = db.Column(db.Integer)
    amount = db.Column(db.Float)
    payment_mode = db.Column(db.String(50))
    status = db.Column(db.String(50), default="pending")
