from flask import Blueprint, request, jsonify
from extensions import db
from models import TimeSlot
from datetime import datetime

time_slot_bp = Blueprint("time_slot", __name__)


# CREATE TIME SLOT
@time_slot_bp.route("/api/time-slots", methods=["POST"])
def create_time_slot():
    data = request.get_json()

    if not data:
        return jsonify({
            "status": "error",
            "message": "Request data is required"
        }), 400

    required_fields = ["slot_name", "start_time", "end_time", "slot_type"]

    for field in required_fields:
        if field not in data:
            return jsonify({
                "status": "error",
                "message": f"{field} is required"
            }), 400

    try:
        start_time = datetime.strptime(
            data["start_time"], "%H:%M"
        ).time()

        end_time = datetime.strptime(
            data["end_time"], "%H:%M"
        ).time()

        time_slot = TimeSlot(
            slot_name=data["slot_name"],
            start_time=start_time,
            end_time=end_time,
            slot_type=data["slot_type"]
        )

        db.session.add(time_slot)
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Time slot created successfully",
            "time_slot_id": time_slot.time_slot_id
        }), 201

    except Exception as e:
        db.session.rollback()

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400


# GET ALL TIME SLOTS
@time_slot_bp.route("/api/time-slots", methods=["GET"])
def get_time_slots():
    time_slots = TimeSlot.query.order_by(
        TimeSlot.start_time
    ).all()

    result = []

    for time_slot in time_slots:
        result.append({
            "time_slot_id": time_slot.time_slot_id,
            "slot_name": time_slot.slot_name,
            "start_time": time_slot.start_time.strftime("%H:%M"),
            "end_time": time_slot.end_time.strftime("%H:%M"),
            "slot_type": time_slot.slot_type
        })

    return jsonify(result), 200


# GET TIME SLOT BY ID
@time_slot_bp.route("/api/time-slots/<int:time_slot_id>", methods=["GET"])
def get_time_slot(time_slot_id):
    time_slot = TimeSlot.query.get(time_slot_id)

    if not time_slot:
        return jsonify({
            "status": "error",
            "message": "Time slot not found"
        }), 404

    return jsonify({
        "time_slot_id": time_slot.time_slot_id,
        "slot_name": time_slot.slot_name,
        "start_time": time_slot.start_time.strftime("%H:%M"),
        "end_time": time_slot.end_time.strftime("%H:%M"),
        "slot_type": time_slot.slot_type
    }), 200


# UPDATE TIME SLOT
@time_slot_bp.route("/api/time-slots/<int:time_slot_id>", methods=["PUT"])
def update_time_slot(time_slot_id):
    time_slot = TimeSlot.query.get(time_slot_id)

    if not time_slot:
        return jsonify({
            "status": "error",
            "message": "Time slot not found"
        }), 404

    data = request.get_json()

    try:
        if "slot_name" in data:
            time_slot.slot_name = data["slot_name"]

        if "start_time" in data:
            time_slot.start_time = datetime.strptime(
                data["start_time"], "%H:%M"
            ).time()

        if "end_time" in data:
            time_slot.end_time = datetime.strptime(
                data["end_time"], "%H:%M"
            ).time()

        if "slot_type" in data:
            time_slot.slot_type = data["slot_type"]

        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Time slot updated successfully"
        }), 200

    except Exception as e:
        db.session.rollback()

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400


# DELETE TIME SLOT
@time_slot_bp.route("/api/time-slots/<int:time_slot_id>", methods=["DELETE"])
def delete_time_slot(time_slot_id):
    time_slot = TimeSlot.query.get(time_slot_id)

    if not time_slot:
        return jsonify({
            "status": "error",
            "message": "Time slot not found"
        }), 404

    try:
        db.session.delete(time_slot)
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Time slot deleted successfully"
        }), 200

    except Exception as e:
        db.session.rollback()

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400