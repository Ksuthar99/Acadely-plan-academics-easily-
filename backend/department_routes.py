from flask import Blueprint, request, jsonify
from extensions import db
from models import Department

department_bp = Blueprint("department", __name__)


# CREATE Department
@department_bp.route("/api/departments", methods=["POST"])
def create_department():
    data = request.get_json()

    if not data or "department_name" not in data:
        return jsonify({
            "status": "error",
            "message": "Department name is required"
        }), 400

    try:
        department = Department(
            department_name=data["department_name"],
            department_description=data.get("department_description"),
            hod_id=data.get("hod_id")
        )

        db.session.add(department)
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Department created successfully",
            "department_id": department.department_id
        }), 201

    except Exception as e:
        db.session.rollback()

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400


# GET All Departments
@department_bp.route("/api/departments", methods=["GET"])
def get_departments():
    departments = Department.query.all()

    result = []

    for department in departments:
        result.append({
            "department_id": department.department_id,
            "department_name": department.department_name,
            "department_description": department.department_description,
            "hod_id": department.hod_id
        })

    return jsonify(result), 200


# GET Department by ID
@department_bp.route("/api/departments/<int:department_id>", methods=["GET"])
def get_department(department_id):
    department = Department.query.get(department_id)

    if not department:
        return jsonify({
            "status": "error",
            "message": "Department not found"
        }), 404

    return jsonify({
        "department_id": department.department_id,
        "department_name": department.department_name,
        "department_description": department.department_description,
        "hod_id": department.hod_id
    }), 200


# UPDATE Department
@department_bp.route("/api/departments/<int:department_id>", methods=["PUT"])
def update_department(department_id):
    department = Department.query.get(department_id)

    if not department:
        return jsonify({
            "status": "error",
            "message": "Department not found"
        }), 404

    data = request.get_json()

    try:
        if "department_name" in data:
            department.department_name = data["department_name"]

        if "department_description" in data:
            department.department_description = data["department_description"]

        if "hod_id" in data:
            department.hod_id = data["hod_id"]

        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Department updated successfully"
        }), 200

    except Exception as e:
        db.session.rollback()

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400


# DELETE Department
@department_bp.route("/api/departments/<int:department_id>", methods=["DELETE"])
def delete_department(department_id):
    department = Department.query.get(department_id)

    if not department:
        return jsonify({
            "status": "error",
            "message": "Department not found"
        }), 404

    try:
        db.session.delete(department)
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Department deleted successfully"
        }), 200

    except Exception as e:
        db.session.rollback()

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400