from flask import Blueprint, request, jsonify
from datetime import datetime

from extensions import db
from models import FacultyLeave, Faculty


faculty_leave_bp = Blueprint("faculty_leave", __name__)


# GET all faculty leaves
@faculty_leave_bp.route("/api/faculty-leaves", methods=["GET"])
def get_faculty_leaves():
    leaves = FacultyLeave.query.all()

    return jsonify([
        {
            "leave_id": leave.leave_id,
            "faculty_id": leave.faculty_id,
            "leave_date": leave.leave_date.isoformat(),
            "start_time": leave.start_time.strftime("%H:%M:%S"),
            "end_time": leave.end_time.strftime("%H:%M:%S"),
            "reason": leave.reason
        }
        for leave in leaves
    ])


# GET one faculty leave
@faculty_leave_bp.route("/api/faculty-leaves/<int:leave_id>", methods=["GET"])
def get_faculty_leave(leave_id):
    leave = FacultyLeave.query.get(leave_id)

    if not leave:
        return jsonify({
            "status": "error",
            "message": "Faculty leave not found"
        }), 404

    return jsonify({
        "leave_id": leave.leave_id,
        "faculty_id": leave.faculty_id,
        "leave_date": leave.leave_date.isoformat(),
        "start_time": leave.start_time.strftime("%H:%M:%S"),
        "end_time": leave.end_time.strftime("%H:%M:%S"),
        "reason": leave.reason
    })


# CREATE faculty leave
@faculty_leave_bp.route("/api/faculty-leaves", methods=["POST"])
def create_faculty_leave():
    data = request.get_json()

    if not data:
        return jsonify({
            "status": "error",
            "message": "Request body is required"
        }), 400

    required_fields = [
        "faculty_id",
        "leave_date",
        "start_time",
        "end_time"
    ]

    for field in required_fields:
        if field not in data:
            return jsonify({
                "status": "error",
                "message": f"{field} is required"
            }), 400

    # Check faculty
    faculty = Faculty.query.get(data["faculty_id"])

    if not faculty:
        return jsonify({
            "status": "error",
            "message": "Faculty not found"
        }), 404

    # Validate date
    try:
        leave_date = datetime.strptime(
            data["leave_date"],
            "%Y-%m-%d"
        ).date()
    except ValueError:
        return jsonify({
            "status": "error",
            "message": "Invalid leave_date. Use YYYY-MM-DD"
        }), 400

    # Validate time
    try:
        start_time = datetime.strptime(
            data["start_time"],
            "%H:%M"
        ).time()

        end_time = datetime.strptime(
            data["end_time"],
            "%H:%M"
        ).time()

    except ValueError:
        return jsonify({
            "status": "error",
            "message": "Invalid time. Use HH:MM"
        }), 400

    # Start time must be before end time
    if start_time >= end_time:
        return jsonify({
            "status": "error",
            "message": "Start time must be before end time"
        }), 400

    # Check overlapping leave
    existing_leaves = FacultyLeave.query.filter(
        FacultyLeave.faculty_id == data["faculty_id"],
        FacultyLeave.leave_date == leave_date
    ).all()

    for existing in existing_leaves:
        if (
            start_time < existing.end_time
            and end_time > existing.start_time
        ):
            return jsonify({
                "status": "error",
                "message": "Faculty already has leave during this time"
            }), 409

    leave = FacultyLeave(
        faculty_id=data["faculty_id"],
        leave_date=leave_date,
        start_time=start_time,
        end_time=end_time,
        reason=data.get("reason")
    )

    db.session.add(leave)
    db.session.commit()

    return jsonify({
        "status": "success",
        "message": "Faculty leave created successfully",
        "leave_id": leave.leave_id
    }), 201


# UPDATE faculty leave
@faculty_leave_bp.route("/api/faculty-leaves/<int:leave_id>", methods=["PUT"])
def update_faculty_leave(leave_id):
    leave = FacultyLeave.query.get(leave_id)

    if not leave:
        return jsonify({
            "status": "error",
            "message": "Faculty leave not found"
        }), 404

    data = request.get_json()

    if not data:
        return jsonify({
            "status": "error",
            "message": "Request body is required"
        }), 400

    faculty_id = data.get("faculty_id", leave.faculty_id)
    leave_date_value = data.get(
        "leave_date",
        leave.leave_date.isoformat()
    )
    start_time_value = data.get(
        "start_time",
        leave.start_time.strftime("%H:%M")
    )
    end_time_value = data.get(
        "end_time",
        leave.end_time.strftime("%H:%M")
    )

    # Check faculty
    faculty = Faculty.query.get(faculty_id)

    if not faculty:
        return jsonify({
            "status": "error",
            "message": "Faculty not found"
        }), 404

    # Validate date
    try:
        leave_date = datetime.strptime(
            leave_date_value,
            "%Y-%m-%d"
        ).date()
    except ValueError:
        return jsonify({
            "status": "error",
            "message": "Invalid leave_date. Use YYYY-MM-DD"
        }), 400

    # Validate time
    try:
        start_time = datetime.strptime(
            start_time_value,
            "%H:%M"
        ).time()

        end_time = datetime.strptime(
            end_time_value,
            "%H:%M"
        ).time()

    except ValueError:
        return jsonify({
            "status": "error",
            "message": "Invalid time. Use HH:MM"
        }), 400

    if start_time >= end_time:
        return jsonify({
            "status": "error",
            "message": "Start time must be before end time"
        }), 400

    # Check overlapping leave
    existing_leaves = FacultyLeave.query.filter(
        FacultyLeave.faculty_id == faculty_id,
        FacultyLeave.leave_date == leave_date,
        FacultyLeave.leave_id != leave_id
    ).all()

    for existing in existing_leaves:
        if (
            start_time < existing.end_time
            and end_time > existing.start_time
        ):
            return jsonify({
                "status": "error",
                "message": "Faculty already has leave during this time"
            }), 409

    leave.faculty_id = faculty_id
    leave.leave_date = leave_date
    leave.start_time = start_time
    leave.end_time = end_time

    if "reason" in data:
        leave.reason = data["reason"]

    db.session.commit()

    return jsonify({
        "status": "success",
        "message": "Faculty leave updated successfully"
    })


# DELETE faculty leave
@faculty_leave_bp.route("/api/faculty-leaves/<int:leave_id>", methods=["DELETE"])
def delete_faculty_leave(leave_id):
    leave = FacultyLeave.query.get(leave_id)

    if not leave:
        return jsonify({
            "status": "error",
            "message": "Faculty leave not found"
        }), 404

    db.session.delete(leave)
    db.session.commit()

    return jsonify({
        "status": "success",
        "message": "Faculty leave deleted successfully"
    })