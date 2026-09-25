from flask import Blueprint, request, jsonify
from extensions import db
from models import FacultyAvailability
from datetime import datetime

faculty_availability_bp = Blueprint(
    "faculty_availability",
    __name__
)


# CREATE FACULTY AVAILABILITY
@faculty_availability_bp.route(
    "/api/faculty-availability",
    methods=["POST"]
)
def create_faculty_availability():

    data = request.get_json()

    if not data:
        return jsonify({
            "status": "error",
            "message": "Request data is required"
        }), 400

    required_fields = [
        "faculty_id",
        "day",
        "start_time",
        "end_time"
    ]

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

        availability = FacultyAvailability(
            faculty_id=data["faculty_id"],
            day=data["day"],
            start_time=start_time,
            end_time=end_time,
            is_available=data.get("is_available", True)
        )

        db.session.add(availability)
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Faculty availability created successfully",
            "availability_id": availability.availability_id
        }), 201

    except Exception as e:
        db.session.rollback()

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400


# GET ALL FACULTY AVAILABILITY
@faculty_availability_bp.route(
    "/api/faculty-availability",
    methods=["GET"]
)
def get_faculty_availability():

    availability_list = FacultyAvailability.query.all()

    result = []

    for availability in availability_list:

        result.append({
            "availability_id": availability.availability_id,
            "faculty_id": availability.faculty_id,
            "day": availability.day,
            "start_time": availability.start_time.strftime("%H:%M"),
            "end_time": availability.end_time.strftime("%H:%M"),
            "is_available": availability.is_available
        })

    return jsonify(result), 200


# GET FACULTY AVAILABILITY BY ID
@faculty_availability_bp.route(
    "/api/faculty-availability/<int:availability_id>",
    methods=["GET"]
)
def get_single_faculty_availability(availability_id):

    availability = FacultyAvailability.query.get(
        availability_id
    )

    if not availability:
        return jsonify({
            "status": "error",
            "message": "Faculty availability not found"
        }), 404

    return jsonify({
        "availability_id": availability.availability_id,
        "faculty_id": availability.faculty_id,
        "day": availability.day,
        "start_time": availability.start_time.strftime("%H:%M"),
        "end_time": availability.end_time.strftime("%H:%M"),
        "is_available": availability.is_available
    }), 200


# UPDATE FACULTY AVAILABILITY
@faculty_availability_bp.route(
    "/api/faculty-availability/<int:availability_id>",
    methods=["PUT"]
)
def update_faculty_availability(availability_id):

    availability = FacultyAvailability.query.get(
        availability_id
    )

    if not availability:
        return jsonify({
            "status": "error",
            "message": "Faculty availability not found"
        }), 404

    data = request.get_json()

    try:

        if "faculty_id" in data:
            availability.faculty_id = data["faculty_id"]

        if "day" in data:
            availability.day = data["day"]

        if "start_time" in data:
            availability.start_time = datetime.strptime(
                data["start_time"], "%H:%M"
            ).time()

        if "end_time" in data:
            availability.end_time = datetime.strptime(
                data["end_time"], "%H:%M"
            ).time()

        if "is_available" in data:
            availability.is_available = data["is_available"]

        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Faculty availability updated successfully"
        }), 200

    except Exception as e:
        db.session.rollback()

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400


# DELETE FACULTY AVAILABILITY
@faculty_availability_bp.route(
    "/api/faculty-availability/<int:availability_id>",
    methods=["DELETE"]
)
def delete_faculty_availability(availability_id):

    availability = FacultyAvailability.query.get(
        availability_id
    )

    if not availability:
        return jsonify({
            "status": "error",
            "message": "Faculty availability not found"
        }), 404

    try:

        db.session.delete(availability)
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Faculty availability deleted successfully"
        }), 200

    except Exception as e:
        db.session.rollback()

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400