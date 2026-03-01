# app/routes/user.py
from flask import Blueprint, request, jsonify
from app.models import User, Flat, Booking, db
from werkzeug.security import generate_password_hash, check_password_hash

user_bp = Blueprint('user', __name__, url_prefix='/api/user')

# Register
@user_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "Email already registered"}), 400
    user = User(
        email=data['email'], 
        password=generate_password_hash(data['password'])
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User registered successfully"})

# Login
@user_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    if user and check_password_hash(user.password, data['password']):
        return jsonify({"message": "Login successful", "email": user.email, "is_admin": user.is_admin})
    return jsonify({"error": "Invalid credentials"}), 401

# Get all flats
@user_bp.route('/flats', methods=['GET'])
def get_flats():
    flats = Flat.query.all()
    return jsonify([
        {
            "id": f.id,
            "title": f"{f.tower} {f.number}",
            "tower": f.tower,
            "number": f.number,
            "size": f.size,
            "amenities": f.amenities.split(', ') if f.amenities else []
        } for f in flats
    ])

# Book a flat
@user_bp.route('/book', methods=['POST'])
def book_flat():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    if not user:
        return jsonify({"error": "User not found"}), 404
    flat = Flat.query.get(data['flat_id'])
    if not flat:
        return jsonify({"error": "Flat not found"}), 404

    booking = Booking(user_id=user.id, flat_id=flat.id)
    db.session.add(booking)
    db.session.commit()
    return jsonify({"message": "Booking requested successfully", "booking_id": booking.id})

# View bookings
@user_bp.route('/bookings/<email>', methods=['GET'])
def get_bookings(email):
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify([
        {
            "id": b.id,
            "flat_title": f"{b.flat.tower} {b.flat.number}",
            "status": b.status,
            "booked_on": b.booked_on
        } for b in user.bookings
    ])