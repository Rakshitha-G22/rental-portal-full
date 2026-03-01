# backend/app/routes/admin.py

from flask import Blueprint, request, jsonify
from app.models import Flat, Booking, SupportQuery, User, db
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')


# --------------------------------
# Admin-only decorator
# --------------------------------
def admin_only(fn):
    @jwt_required()
    def wrapper(*args, **kwargs):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user or user.role != "admin":
            return jsonify({"msg": "Admins only"}), 403

        return fn(*args, **kwargs)

    wrapper.__name__ = fn.__name__
    return wrapper


# --------------------------------
# Add Flat
# --------------------------------
@admin_bp.route('/flat', methods=['POST'])
@admin_only
def add_flat():
    data = request.get_json() or {}

    try:
        tower_name = data.get('tower_name', '').strip()
        title = data.get('title', '').strip()
        location = data.get('location', '').strip()
        floor = int(data.get('floor', 0))
        price = int(data.get('price', 0))
        image = data.get('image', '').strip()
        amenities_list = data.get('amenities', [])

        if not isinstance(amenities_list, list):
            amenities_list = []

        amenities = ','.join(amenities_list)

        if not tower_name or not title:
            return jsonify({"msg": "Tower and title are required"}), 400

        flat = Flat(
            tower_name=tower_name,
            title=title,
            location=location,
            floor=floor,
            price=price,
            image=image,
            amenities=amenities,
            is_booked=False
        )

        db.session.add(flat)
        db.session.commit()

        return jsonify({
            "message": "Flat added successfully",
            "id": flat.id
        }), 201

    except Exception as e:
        db.session.rollback()
        print("Error adding flat:", e)
        return jsonify({
            "msg": "Failed to add flat",
            "error": str(e)
        }), 500


# --------------------------------
# Get All Flats (Admin View)
# --------------------------------
@admin_bp.route('/flats', methods=['GET'])
@admin_only
def get_all_flats():
    flats = Flat.query.order_by(Flat.id.desc()).all()
    result = []
    for f in flats:
        result.append({
            "id": f.id,
            "tower_name": f.tower_name,
            "title": f.title,
            "location": f.location,
            "floor": f.floor,
            "price": f.price,
            "image": f.image,
            "is_booked": f.is_booked,
            "amenities": f.amenities.split(',') if f.amenities else []
        })
    return jsonify(result), 200


# --------------------------------
# Update Flat
# --------------------------------
@admin_bp.route('/flat/<int:id>', methods=['PUT'])
@admin_only
def update_flat(id):
    flat = Flat.query.get_or_404(id)
    data = request.get_json() or {}

    flat.tower_name = data.get('tower_name', flat.tower_name)
    flat.title = data.get('title', flat.title)
    flat.location = data.get('location', flat.location)
    flat.floor = data.get('floor', flat.floor)
    flat.price = data.get('price', flat.price)
    flat.image = data.get('image', flat.image)

    amenities_list = data.get('amenities', [])
    if isinstance(amenities_list, list):
        flat.amenities = ','.join(amenities_list)

    db.session.commit()
    return jsonify({"message": "Flat updated successfully"}), 200


# --------------------------------
# Delete Flat
# --------------------------------
@admin_bp.route('/flat/<int:flat_id>', methods=['DELETE'])
@admin_only
def delete_flat(flat_id):
    flat = Flat.query.get(flat_id)
    if not flat:
        return jsonify({"msg": "Flat not found"}), 404

    db.session.delete(flat)
    db.session.commit()
    return jsonify({"message": "Flat deleted successfully"}), 200


# --------------------------------
# Get All Bookings
# --------------------------------
@admin_bp.route('/bookings', methods=['GET'])
@admin_only
def get_all_bookings():
    bookings = db.session.query(
        Booking.id,
        Booking.booked_at,
        Booking.status,
        User.email.label("user_email"),
        Flat.title.label("flat_title"),
        Flat.tower_name.label("tower_name")
    ).join(User, Booking.user_id == User.id)\
     .join(Flat, Booking.flat_id == Flat.id)\
     .all()

    result = []
    for b in bookings:
        result.append({
            "id": b.id,
            "booked_on": b.booked_at,
            "status": b.status,
            "user_email": b.user_email,
            "flat_title": f"{b.tower_name} {b.flat_title}"
        })
    return jsonify(result), 200


# --------------------------------
# Update Booking Status
# --------------------------------
@admin_bp.route('/booking/<int:id>', methods=['PUT'])
@admin_only
def update_booking_status(id):
    booking = Booking.query.get_or_404(id)
    data = request.get_json() or {}

    booking.status = data.get("status", booking.status)
    db.session.commit()
    return jsonify({"message": "Status updated"}), 200


# --------------------------------
# View All Support Queries
# --------------------------------
@admin_bp.route('/queries', methods=['GET'])
@admin_only
def get_all_queries():
    queries = SupportQuery.query.all()
    result = []
    for q in queries:
        result.append({
            "id": q.id,
            "user_id": q.user_id,
            "message": q.message,
            "status": q.status,
            "created_at": q.created_at
        })
    return jsonify(result), 200


# --------------------------------
# Get All Towers
# --------------------------------
@admin_bp.route("/towers", methods=["GET"])
def get_towers():

    towers = (
        db.session.query(
            Flat.tower_name.label("name"),
            Flat.location,
            func.count(Flat.id).label("flats_count")
        )
        .group_by(Flat.tower_name, Flat.location)
        .all()
    )

    result = []

    for t in towers:
        result.append({
            "id": None,
            "name": t.name,
            "location": t.location,
            "flats_count": t.flats_count
        })

    return jsonify(result), 200



@admin_bp.route("/bookings/<int:id>/decline", methods=["PUT"])
@jwt_required()
@admin_only
def decline_booking(id):
    booking = Booking.query.get_or_404(id)

    booking.status = "declined"

    # Block the flat
    flat = Flat.query.get(booking.flat_id)
    flat.status = "blocked"

    db.session.commit()

    return jsonify({"msg": "Booking declined and flat blocked"})

@admin_bp.route("/bookings/<int:id>/approve", methods=["PUT"])
@jwt_required()
@admin_only
def approve_booking(id):
    booking = Booking.query.get_or_404(id)

    booking.status = "approved"

    flat = Flat.query.get(booking.flat_id)
    flat.status = "booked"

    db.session.commit()

    return jsonify({"msg": "Booking approved and flat marked booked"})

from sqlalchemy import func

@admin_bp.route("/reports", methods=["GET"])
@jwt_required()
def get_reports():

    approved = Booking.query.filter(
        func.lower(Booking.status) == "approved"
    ).count()

    declined = Booking.query.filter(
        func.lower(Booking.status) == "declined"
    ).count()

    cancelled = Booking.query.filter(
        func.lower(Booking.status) == "cancelled"
    ).count()

    return jsonify({
        "approved": approved,
        "declined": declined,
        "cancelled": cancelled
    }), 200