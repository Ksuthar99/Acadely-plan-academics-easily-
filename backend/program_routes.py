from flask import Blueprint, request, jsonify
from extensions import db
from models import Program

program_bp = Blueprint("program", __name__)


# CREATE PROGRAM
@program_bp.route("/api/programs", methods=["POST"])
def create_program():
    data = request.get_json()

    if not data:
        return jsonify({
            "status": "error",
            "message": "Request data is required"
        }), 400

    required_fields = [
        "program_name",
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
        program = Program(
            program_name=data["program_name"],
            section_id=data["section_id"],
            department_id=data["department_id"],
            program_duration=data.get("program_duration"),
            program_level=data.get("program_level"),
            sanction_intake=data.get("sanction_intake"),
            sanction_division=data.get("sanction_division")
        )

        db.session.add(program)
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Program created successfully",
            "program_id": program.program_id
        }), 201

    except Exception as e:
        db.session.rollback()

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400


# GET ALL PROGRAMS
@program_bp.route("/api/programs", methods=["GET"])
def get_programs():
    programs = Program.query.all()

    result = []

    for program in programs:
        result.append({
            "program_id": program.program_id,
            "program_name": program.program_name,
            "section_id": program.section_id,
            "department_id": program.department_id,
            "program_duration": program.program_duration,
            "program_level": program.program_level,
            "sanction_intake": program.sanction_intake,
            "sanction_division": program.sanction_division
        })

    return jsonify(result), 200


# GET PROGRAM BY ID
@program_bp.route("/api/programs/<int:program_id>", methods=["GET"])
def get_program(program_id):
    program = Program.query.get(program_id)

    if not program:
        return jsonify({
            "status": "error",
            "message": "Program not found"
        }), 404

    return jsonify({
        "program_id": program.program_id,
        "program_name": program.program_name,
        "section_id": program.section_id,
        "department_id": program.department_id,
        "program_duration": program.program_duration,
        "program_level": program.program_level,
        "sanction_intake": program.sanction_intake,
        "sanction_division": program.sanction_division
    }), 200


# UPDATE PROGRAM
@program_bp.route("/api/programs/<int:program_id>", methods=["PUT"])
def update_program(program_id):
    program = Program.query.get(program_id)

    if not program:
        return jsonify({
            "status": "error",
            "message": "Program not found"
        }), 404

    data = request.get_json()

    try:
        if "program_name" in data:
            program.program_name = data["program_name"]

        if "section_id" in data:
            program.section_id = data["section_id"]

        if "department_id" in data:
            program.department_id = data["department_id"]

        if "program_duration" in data:
            program.program_duration = data["program_duration"]

        if "program_level" in data:
            program.program_level = data["program_level"]

        if "sanction_intake" in data:
            program.sanction_intake = data["sanction_intake"]

        if "sanction_division" in data:
            program.sanction_division = data["sanction_division"]

        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Program updated successfully"
        }), 200

    except Exception as e:
        db.session.rollback()

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400


# DELETE PROGRAM
@program_bp.route("/api/programs/<int:program_id>", methods=["DELETE"])
def delete_program(program_id):
    program = Program.query.get(program_id)

    if not program:
        return jsonify({
            "status": "error",
            "message": "Program not found"
        }), 404

    try:
        db.session.delete(program)
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Program deleted successfully"
        }), 200

    except Exception as e:
        db.session.rollback()

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400