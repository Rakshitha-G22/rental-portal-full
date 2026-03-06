from flask import Blueprint, request, jsonify, send_file
from app.models import Booking, Flat, User, db
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
import io
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch

bookings_bp = Blueprint("bookings_bp", __name__)


# =====================================================
# ✅ CREATE BOOKING
# POST /api/bookings
# =====================================================
@bookings_bp.route("", methods=["POST"])
@jwt_required()
def create_booking():

    try:
        print("Received Request Headers →", request.headers)
        print("Received Request JSON →", request.get_json(silent=True))

        user_id = get_jwt_identity()
        data = request.get_json(silent=True)

        if not data:
            return jsonify({"msg": "No data provided"}), 422

        flat_id = data.get("flat_id")

        if not flat_id:
            return jsonify({"msg": "Flat ID required"}), 422

        flat = Flat.query.get(flat_id)

        if not flat:
            return jsonify({"msg": "Flat not found"}), 404

        existing_booking = Booking.query.filter(
            Booking.flat_id == flat_id,
            Booking.status.in_(["pending", "approved"])
        ).first()

        if existing_booking:
            return jsonify({"msg": "Flat already booked"}), 400

        booking = Booking(
            user_id=user_id,
            flat_id=flat_id,
            status="pending",
            booked_at=datetime.utcnow()
        )

        db.session.add(booking)
        db.session.commit()

        return jsonify({"message": "Booking created"}), 201

    except Exception as e:
        print("Booking Error:", str(e))
        return jsonify({"msg": "Booking failed"}), 500


# =====================================================
# ✅ GET MY BOOKINGS
# GET /api/bookings/my
# =====================================================
@bookings_bp.route("/my", methods=["GET"])
@jwt_required()
def my_bookings():

    try:
        user_id = get_jwt_identity()

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

            amenities_list = (
                [a.strip() for a in flat.amenities.split(",")]
                if flat.amenities else []
            )

            result.append({
                "id": booking.id,
                "status": booking.status,
                "booked_on": booking.booked_at.isoformat() if booking.booked_at else None,

                "flat_id": flat.id,
                "flat_number": flat.flat_number,
                "flat_type": flat.flat_type,
                "location": flat.location,
                "price": flat.price,
                "image": flat.image,
                "amenities": amenities_list,

                "user_email": user.email
            })

        return jsonify({"bookings": result}), 200

    except Exception as e:
        print("My Booking Error:", str(e))
        return jsonify({"msg": "Failed to fetch bookings"}), 500


# =====================================================
# ✅ CANCEL BOOKING
# DELETE /api/bookings/<booking_id>
# =====================================================
@bookings_bp.route("/<int:booking_id>", methods=["DELETE"])
@jwt_required()
def cancel_booking(booking_id):

    try:
        # =============================
        # DEBUG JWT USER
        # =============================
        user_id = get_jwt_identity()
        # print("JWT USER ID ➜", user_id)

        # =============================
        # FETCH BOOKING
        # =============================
        booking = Booking.query.get(booking_id)

        # print("REQUESTED BOOKING ID ➜", booking_id)

        # =============================
        # CHECK BOOKING EXISTS
        # =============================
        if not booking:
            # print("BOOKING STATUS ➜ NOT FOUND")
            return jsonify({"error": "Booking not found"}), 404

        # print("BOOKING OWNER USER ID ➜", booking.user_id)

        # =============================
        # AUTH CHECK
        # =============================
        if int(booking.user_id) != int(user_id):
            # print("AUTH RESULT ➜ FORBIDDEN (User mismatch)")
            return jsonify({
                "error": "Unauthorized access",
                "jwt_user": user_id,
                "booking_owner": booking.user_id
            }), 403

        # =============================
        # DELETE BOOKING
        # =============================
        db.session.delete(booking)
        db.session.commit()

        # print("BOOKING STATUS ➜ DELETED SUCCESSFULLY")

        return jsonify({
            "message": "Booking cancelled successfully",
            "booking_id": booking_id
        }), 200

    except Exception as e:
        # print("CANCEL BOOKING ERROR ➜", str(e))
        return jsonify({
            "error": "Server error",
            "details": str(e)
        }), 500


# =====================================================
# ✅ DOWNLOAD RECEIPT
# GET /api/bookings/receipt/<id>
# =====================================================
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

        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4)
        styles = getSampleStyleSheet()
        elements = []

        elements.append(Paragraph("Booking Receipt", styles["Title"]))
        elements.append(Spacer(1, 0.5 * inch))

        elements.append(Paragraph(f"Flat Number: {flat.flat_number}", styles["Normal"]))
        elements.append(Paragraph(f"Flat Type: {flat.flat_type}", styles["Normal"]))
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
        return jsonify({"msg": "Receipt generation failed"}), 500