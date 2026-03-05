from flask import Blueprint, request, jsonify
from app.models import Flat, Booking, User, db,Tower
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func
from functools import wraps

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')


# =============================
# ADMIN ONLY MIDDLEWARE
# =============================

def admin_only(fn):

    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):

        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user:
            return jsonify({"msg": "User not found"}), 404

        if user.role != "admin":
            return jsonify({"msg": "Admins only"}), 403

        return fn(*args, **kwargs)

    return wrapper


# =============================
# ADD FLAT
# =============================

@admin_bp.route('/flat', methods=['POST'])
@admin_only
def add_flat():

    data = request.get_json() or {}

    try:

        amenities_list = data.get("amenities", [])
        if not isinstance(amenities_list, list):
            amenities_list = []

        flat = Flat(
            flat_number=data.get("flat_number", "").strip(),
            flat_type=data.get("flat_type", "").strip(),
            tower_name=data.get("tower_name", "").strip(),
            location=data.get("location", "").strip(),
            floor=data.get("floor"),
            price=data.get("price"),
            image=data.get("image", ""),
            amenities=amenities_list,
            is_booked=False
        )

        if not flat.flat_number or not flat.flat_type:
            return jsonify({"msg": "Flat number and type required"}), 400

        db.session.add(flat)
        db.session.commit()

        return jsonify({"message": "Flat added"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# =============================
# GET ALL FLATS
# =============================

@admin_bp.route('/flats', methods=['GET'])
@admin_only
def get_all_flats():

    flats = Flat.query.order_by(Flat.id.desc()).all()

    result = []

    for f in flats:
        result.append({
            "id": f.id,
            "flat_number": f.flat_number,
            "flat_type": f.flat_type,
            "tower_name": f.tower_name,
            "location": f.location,
            "floor": f.floor,
            "price": f.price,
            "image": f.image,
            "is_booked": f.is_booked,
            "amenities": f.amenities if isinstance(f.amenities, list) else []
        })

    return jsonify(result), 200


# =============================
# UPDATE FLAT
# =============================

@admin_bp.route('/flat/<int:id>', methods=['PUT'])
@admin_only
def update_flat(id):

    flat = Flat.query.get_or_404(id)
    data = request.get_json() or {}

    flat.flat_number = data.get("flat_number", flat.flat_number)
    flat.flat_type = data.get("flat_type", flat.flat_type)
    flat.tower_name = data.get("tower_name", flat.tower_name)
    flat.location = data.get("location", flat.location)
    flat.floor = data.get("floor", flat.floor)
    flat.price = data.get("price", flat.price)
    flat.image = data.get("image", flat.image)

    amenities = data.get("amenities", [])
    if isinstance(amenities, list):
        flat.amenities = amenities

    db.session.commit()

    return jsonify({"message": "Flat updated"}), 200


# =============================
# DELETE FLAT
# =============================

@admin_bp.route('/flat/<int:flat_id>', methods=['DELETE'])
@admin_only
def delete_flat(flat_id):

    flat = Flat.query.get_or_404(flat_id)

    db.session.delete(flat)
    db.session.commit()

    return jsonify({"message": "Flat deleted"}), 200


# =============================
# GET ALL BOOKINGS (ADMIN PANEL)
# =============================

@admin_bp.route('/bookings', methods=['GET'])
@admin_only
def get_all_bookings():

    bookings = db.session.query(
        Booking.id,
        Booking.booked_at,
        Booking.status,
        User.name.label("user_name"),
        User.email.label("user_email"),
        Flat.flat_number,
        Flat.flat_type,
        Flat.tower_name,
        Flat.location,
        Flat.floor
    ).join(User, Booking.user_id == User.id)\
     .join(Flat, Booking.flat_id == Flat.id)\
     .all()

    result = []

    for b in bookings:
        result.append({
            "id": b.id,
            "booked_at": b.booked_at,
            "status": b.status,

            "user_name": b.user_name,
            "user_email": b.user_email,

            "flat_number": b.flat_number,
            "flat_type": b.flat_type,
            "tower_name": b.tower_name,
            "location": b.location,
            "floor": b.floor
        })

    return jsonify(result), 200


# =============================
# UPDATE BOOKING STATUS
# =============================

@admin_bp.route('/booking/<int:id>', methods=['PUT'])
@admin_only
def update_booking_status(id):

    booking = Booking.query.get_or_404(id)

    data = request.get_json() or {}
    status = data.get("status")

    if status:

        booking.status = status.lower()

        if status.lower() == "approved":
            flat = Flat.query.get(booking.flat_id)
            flat.is_booked = True

    db.session.commit()

    return jsonify({"message": "Status updated"}), 200


    # =============================
# REPORTS (BOOKING STATS)
# =============================

@admin_bp.route("/reports", methods=["GET"])
@admin_only
def get_reports():

    approved_bookings = db.session.query(
        Booking.id,
        User.name.label("user_name"),
        Flat.flat_number,
        Flat.flat_type,
        Flat.location
    ).join(User, Booking.user_id == User.id)\
     .join(Flat, Booking.flat_id == Flat.id)\
     .filter(func.lower(Booking.status) == "approved")\
     .all()

    declined = Booking.query.filter(
        func.lower(Booking.status) == "declined"
    ).count()

    cancelled = Booking.query.filter(
        func.lower(Booking.status) == "cancelled"
    ).count()

    approved_list = []

    for b in approved_bookings:
        approved_list.append({
            "user_name": b.user_name,
            "flat_number": b.flat_number,
            "flat_type": b.flat_type,
            "location": b.location
        })

    return jsonify({
        "approved": len(approved_list),
        "declined": declined,
        "cancelled": cancelled,
        "approved_bookings": approved_list
    }), 200

    
@admin_bp.route('/towers', methods=['GET'])
@jwt_required()
def get_towers():

    towers = db.session.query(
        Flat.tower_name.label("name"),
        Flat.location,
        func.count(Flat.id).label("flats_count")
    ).group_by(
        Flat.tower_name,
        Flat.location
    ).all()

    result = []

    for i, tower in enumerate(towers, start=1):
        result.append({
            "id": i,
            "name": tower.name,
            "location": tower.location,
            "flats_count": tower.flats_count
        })

    return jsonify(result)