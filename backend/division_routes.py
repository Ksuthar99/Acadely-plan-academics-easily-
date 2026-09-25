from flask import Blueprint, request, jsonify
from extensions import db
from models import Division

division_bp = Blueprint("division", __name__)


# CREATE DIVISION
@division_bp.route("/api/divisions", methods=["POST"])
def create_division():
    data = request.get_json()

    if not data:
        return jsonify({
            "status": "error",
            "message": "Request data is required"
        }), 400

    required_fields = [
        "division_name",
        "class_id",
        "program_id",
        "section_id",
        "department_id"
    ]

    for field in required_fields:
        if field not in data:
            return jsonify({
                "status": "error",
                "message": f"{field} is required"
            }), 400

    try:
        division = Division(
            division_name=data["division_name"],
            class_id=data["class_id"],
            program_id=data["program_id"],
            section_id=data["section_id"],
            department_id=data["department_id"]
        )

        db.session.add(division)
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Division created successfully",
            "division_id": division.division_id
        }), 201

    except Exception as e:
        db.session.rollback()

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400


# GET ALL DIVISIONS
@division_bp.route("/api/divisions", methods=["GET"])
def get_divisions():
    divisions = Division.query.all()

    result = []

    for division in divisions:
        result.append({
            "division_id": division.division_id,
            "division_name": division.division_name,
            "class_id": division.class_id,
            "program_id": division.program_id,
            "section_id": division.section_id,
            "department_id": division.department_id
        })

    return jsonify(result), 200


# GET DIVISION BY ID
@division_bp.route("/api/divisions/<int:division_id>", methods=["GET"])
def get_division(division_id):
    division = Division.query.get(division_id)

    if not division:
        return jsonify({
            "status": "error",
            "message": "Division not found"
        }), 404

    return jsonify({
        "division_id": division.division_id,
        "division_name": division.division_name,
        "class_id": division.class_id,
        "program_id": division.program_id,
        "section_id": division.section_id,
        "department_id": division.department_id
    }), 200


# UPDATE DIVISION
@division_bp.route("/api/divisions/<int:division_id>", methods=["PUT"])
def update_division(division_id):
    division = Division.query.get(division_id)

    if not division:
        return jsonify({
            "status": "error",
            "message": "Division not found"
        }), 404

    data = request.get_json()

    try:
        if "division_name" in data:
            division.division_name = data["division_name"]

        if "class_id" in data:
            division.class_id = data["class_id"]

        if "program_id" in data:
            division.program_id = data["program_id"]

        if "section_id" in data:
            division.section_id = data["section_id"]

        if "department_id" in data:
            division.department_id = data["department_id"]

        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Division updated successfully"
        }), 200

    except Exception as e:
        db.session.rollback()

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400


# DELETE DIVISION
@division_bp.route("/api/divisions/<int:division_id>", methods=["DELETE"])
def delete_division(division_id):
    division = Division.query.get(division_id)

    if not division:
        return jsonify({
            "status": "error",
            "message": "Division not found"
        }), 404

    try:
        db.session.delete(division)
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Division deleted successfully"
        }), 200

    except Exception as e:
        db.session.rollback()

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400