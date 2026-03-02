from flask import Blueprint, request, jsonify
from app.models import Booking, Flat, db, User
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from flask import send_file, jsonify
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch
import os
import io

# Blueprint
bookings_bp = Blueprint("bookings_bp", __name__)

# --------------------------------------------------
# Create Booking
# POST /api/bookings/
# --------------------------------------------------
@bookings_bp.route("", methods=["POST"])
@jwt_required()
def create_booking():
    user_id = get_jwt_identity()
    data = request.get_json()

    flat_id = data.get("flat_id")

    if not flat_id:
        return jsonify({"msg": "Flat ID required"}), 400

    # ✅ Check if flat exists
    flat = Flat.query.get(flat_id)
    if not flat:
        return jsonify({"msg": "Flat not found"}), 404

    # ✅ Prevent double booking (pending or approved)
    existing_booking = Booking.query.filter(
        Booking.flat_id == flat_id,
        Booking.status.in_(["pending", "approved"])
    ).first()

    if existing_booking:
        return jsonify({"msg": "Flat already booked or pending approval"}), 400

    # ✅ Create booking
    new_booking = Booking(
        user_id=user_id,
        flat_id=flat_id,
        status="pending"
    )

    db.session.add(new_booking)
    db.session.commit()

    return jsonify({"msg": "Booking created successfully"}), 201





# --------------------------------------------------
# Get My Bookings
# GET /api/bookings/my
# --------------------------------------------------
@bookings_bp.route("/my", methods=["GET"])
@jwt_required()
def my_bookings():
    try:
        user_id = int(get_jwt_identity())

        bookings = (
            db.session.query(Booking, Flat, User)
            .join(Flat, Booking.flat_id == Flat.id)
            .join(User, Booking.user_id == User.id)
            .filter(Booking.user_id == user_id)
            .order_by(Booking.booked_at.desc())
            .all()
        )

        result = []

        for booking, flat, user in bookings:
            result.append({
                "id": booking.id,
                "user_email": user.email,   
                "status": booking.status,
                "booked_on": booking.booked_at.isoformat() if booking.booked_at else None,
                "flat_id": flat.id,
                "flat_title": flat.title,
                "flat_image": flat.image,
                "flat_location": flat.location,
                "flat_price": flat.price,
                "amenities": [a.strip() for a in flat.amenities.split(",")] if flat.amenities else []
            })

        return jsonify({"bookings": result}), 200

    except Exception as e:
        print("Error in my_bookings:", str(e))
        return jsonify({"msg": "Failed to fetch bookings"}), 500



# --------------------------------------------------
# Cancel Booking
# PUT /api/bookings/cancel/<booking_id>
# --------------------------------------------------
@bookings_bp.route("/<int:booking_id>", methods=["DELETE"])
@jwt_required()
def cancel_booking(booking_id):

    user_id = int(get_jwt_identity())

    booking = Booking.query.get(booking_id)

    if not booking:
        return jsonify({"msg": "Booking not found"}), 404

    # Ensure user cancels only their booking
    if booking.user_id != user_id:
        return jsonify({"msg": "Unauthorized"}), 403

    booking.status = "rejected"
    db.session.commit()

    return jsonify({"msg": "Booking cancelled successfully"}), 200


@bookings_bp.route("/receipt/<int:booking_id>", methods=["GET"])
@jwt_required()
def download_receipt(booking_id):
    try:
        user_id = int(get_jwt_identity())

        booking = Booking.query.get(booking_id)
        if not booking:
            return jsonify({"msg": "Booking not found"}), 404

        if booking.user_id != user_id:
            return jsonify({"msg": "Unauthorized"}), 403

        flat = Flat.query.get(booking.flat_id)
        if not flat:
            return jsonify({"msg": "Flat not found"}), 404

        # Create PDF in memory
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4)

        elements = []
        styles = getSampleStyleSheet()

        elements.append(Paragraph("Booking Receipt", styles["Title"]))
        elements.append(Spacer(1, 0.5 * inch))

        elements.append(Paragraph(f"Flat: {flat.title}", styles["Normal"]))
        elements.append(Paragraph(f"Location: {flat.location}", styles["Normal"]))
        elements.append(Paragraph(f"Price: ₹{flat.price}", styles["Normal"]))
        elements.append(Paragraph(f"Status: {booking.status}", styles["Normal"]))

        booked_date = booking.booked_at.strftime("%d-%m-%Y %H:%M") if booking.booked_at else "N/A"
        elements.append(Paragraph(f"Booked On: {booked_date}", styles["Normal"]))

        doc.build(elements)

        buffer.seek(0)

        return send_file(
            buffer,
            as_attachment=True,
            download_name=f"Booking_Receipt_{booking_id}.pdf",
            mimetype="application/pdf"
        )

    except Exception as e:
        print("Receipt Error:", str(e))
        return jsonify({"msg": "Failed to generate receipt"}), 500