from flask import Blueprint, jsonify
from ..models import Flat, Booking
from sqlalchemy import func


flats_bp = Blueprint("flats_bp", __name__)  



@flats_bp.route("/", methods=["GET"])
def get_all_flats():
    flats = Flat.query.all()
    flat_list = []

    for flat in flats:

        booking = Booking.query.filter(
            Booking.flat_id == flat.id
        ).first()

        booking_status = None

        if booking:
            booking_status = booking.status.lower()

        amenities_list = (
            [a.strip() for a in flat.amenities.split(",")]
            if flat.amenities else []
        )

        flat_list.append({
            "id": flat.id,
            "title": flat.title,
            "location": flat.location,
            "price": flat.price,
            "image": flat.image,
            "tower_name": flat.tower_name,
            "floor": flat.floor,
            "amenities": amenities_list,
            "booking_status": booking_status
        })

    return jsonify(flat_list), 200



# ✅ GET SINGLE FLAT
@flats_bp.route("/<int:flat_id>", methods=["GET"])
def get_flat(flat_id):
    flat = Flat.query.get(flat_id)

    if not flat:
        return jsonify({"msg": "Flat not found"}), 404

    amenities_list = flat.amenities.split(",") if flat.amenities else []

    active_booking = Booking.query.filter(
    Booking.flat_id == flat.id,
    func.lower(Booking.status).in_(["approved", "pending"])
     ).first()

    is_booked = active_booking is not None

    return jsonify({
        "id": flat.id,
        "title": flat.title,
        "location": flat.location,
        "price": flat.price,
        "image": flat.image,
        "tower_name": flat.tower_name,
        "floor": flat.floor,
        "amenities": amenities_list,
        "is_booked": is_booked
    }), 200

# @flats_bp.route("/", methods=["GET"])
# def get_flats():
#     flats = Flat.query.filter_by(status="available").all()



