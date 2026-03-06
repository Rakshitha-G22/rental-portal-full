from flask import Blueprint, jsonify
from ..models import Flat, Booking
from sqlalchemy import func

flats_bp = Blueprint("flats_bp", __name__, url_prefix="/api/flats")

# ================= GET ALL FLATS =================
@flats_bp.route("/", methods=["GET"])
def get_all_flats():
    try:
        flats = Flat.query.all()
        flat_list = []

        for flat in flats:

            booking = Booking.query.filter(
                Booking.flat_id == flat.id
            ).first()

            booking_status = None

            if booking and booking.status:
                booking_status = booking.status.lower()

            amenities_list = (
                [a.strip() for a in flat.amenities.split(",")]
                if flat.amenities
                else []
            )

            flat_list.append({
                "id": flat.id,
                "flat_number": flat.flat_number,
                "flat_type": flat.flat_type,
                "location": flat.location,
                "price": flat.price,
                "image": flat.image,
                "tower_name": flat.tower_name,
                "floor": flat.floor,
                "amenities": amenities_list,
                "is_booked": booking is not None,
                "booking_status": booking_status
            })

        return jsonify(flat_list), 200

    except Exception as e:
        print("Flats API Error:", str(e))
        return jsonify({"error": "Internal Server Error"}), 500


# ================= GET SINGLE FLAT =================
@flats_bp.route("/<int:flat_id>", methods=["GET"])
def get_flat(flat_id):
    try:
        flat = Flat.query.get(flat_id)

        if not flat:
            return jsonify({"msg": "Flat not found"}), 404

        amenities_list = (
            [a.strip() for a in flat.amenities.split(",")]
            if flat.amenities
            else []
        )

        active_booking = Booking.query.filter(
            Booking.flat_id == flat.id,
            func.lower(Booking.status).in_(["approved", "pending"])
        ).first()

        return jsonify({
            "id": flat.id,
            "flat_number": flat.flat_number,
            "flat_type": flat.flat_type,
            "location": flat.location,
            "price": flat.price,
            "image": flat.image,
            "tower_name": flat.tower_name,
            "floor": flat.floor,
            "amenities": amenities_list,
            "is_booked": active_booking is not None
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500