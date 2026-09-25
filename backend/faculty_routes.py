from flask import Blueprint, request, jsonify
from extensions import db
from models import Faculty

faculty_bp = Blueprint("faculty", __name__)


# CREATE Faculty
@faculty_bp.route("/api/faculty", methods=["POST"])
def create_faculty():
    data = request.get_json()

    if not data:
        return jsonify({
            "status": "error",
            "message": "Request data is required"
        }), 400

    required_fields = [
        "faculty_name",
        "faculty_email",
        "department_id"
    ]

    for field in required_fields:
        if field not in data:
            return jsonify({
                "status": "error",
                "message": f"{field} is required"
            }), 400

    try:
        faculty = Faculty(
            faculty_name=data["faculty_name"],
            faculty_email=data["faculty_email"],
            faculty_designation=data.get("faculty_designation"),
            faculty_qualification=data.get("faculty_qualification"),
            mobile_number=data.get("mobile_number"),
            faculty_photo=data.get("faculty_photo"),
            faculty_type=data.get("faculty_type"),
            department_id=data["department_id"]
        )

        db.session.add(faculty)
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Faculty created successfully",
            "faculty_id": faculty.faculty_id
        }), 201

    except Exception as e:
        db.session.rollback()

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400


# GET All Faculty
@faculty_bp.route("/api/faculty", methods=["GET"])
def get_faculty():
    faculty_members = Faculty.query.all()

    result = []

    for faculty in faculty_members:
        result.append({
            "faculty_id": faculty.faculty_id,
            "faculty_name": faculty.faculty_name,
            "faculty_email": faculty.faculty_email,
            "faculty_designation": faculty.faculty_designation,
            "faculty_qualification": faculty.faculty_qualification,
            "mobile_number": faculty.mobile_number,
            "faculty_photo": faculty.faculty_photo,
            "faculty_type": faculty.faculty_type,
            "department_id": faculty.department_id
        })

    return jsonify(result), 200


# GET Faculty by ID
@faculty_bp.route("/api/faculty/<int:faculty_id>", methods=["GET"])
def get_faculty_by_id(faculty_id):
    faculty = Faculty.query.get(faculty_id)

    if not faculty:
        return jsonify({
            "status": "error",
            "message": "Faculty not found"
        }), 404

    return jsonify({
        "faculty_id": faculty.faculty_id,
        "faculty_name": faculty.faculty_name,
        "faculty_email": faculty.faculty_email,
        "faculty_designation": faculty.faculty_designation,
        "faculty_qualification": faculty.faculty_qualification,
        "mobile_number": faculty.mobile_number,
        "faculty_photo": faculty.faculty_photo,
        "faculty_type": faculty.faculty_type,
        "department_id": faculty.department_id
    }), 200


# UPDATE Faculty
@faculty_bp.route("/api/faculty/<int:faculty_id>", methods=["PUT"])
def update_faculty(faculty_id):
    faculty = Faculty.query.get(faculty_id)

    if not faculty:
        return jsonify({
            "status": "error",
            "message": "Faculty not found"
        }), 404

    data = request.get_json()

    try:
        if "faculty_name" in data:
            faculty.faculty_name = data["faculty_name"]

        if "faculty_email" in data:
            faculty.faculty_email = data["faculty_email"]

        if "faculty_designation" in data:
            faculty.faculty_designation = data["faculty_designation"]

        if "faculty_qualification" in data:
            faculty.faculty_qualification = data["faculty_qualification"]

        if "mobile_number" in data:
            faculty.mobile_number = data["mobile_number"]

        if "faculty_photo" in data:
            faculty.faculty_photo = data["faculty_photo"]

        if "faculty_type" in data:
            faculty.faculty_type = data["faculty_type"]

        if "department_id" in data:
            faculty.department_id = data["department_id"]

        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Faculty updated successfully"
        }), 200

    except Exception as e:
        db.session.rollback()

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400


# DELETE Faculty
@faculty_bp.route("/api/faculty/<int:faculty_id>", methods=["DELETE"])
def delete_faculty(faculty_id):
    faculty = Faculty.query.get(faculty_id)

    if not faculty:
        return jsonify({
            "status": "error",
            "message": "Faculty not found"
        }), 404

    try:
        db.session.delete(faculty)
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Faculty deleted successfully"
        }), 200

    except Exception as e:
        db.session.rollback()

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400