from flask import Blueprint, request, jsonify
from extensions import db
from models import Section

section_bp = Blueprint("section", __name__)


# CREATE SECTION
@section_bp.route("/api/sections", methods=["POST"])
def create_section():
    data = request.get_json()

    if not data or "section_name" not in data:
        return jsonify({
            "status": "error",
            "message": "Section name is required"
        }), 400

    try:
        section = Section(
            section_name=data["section_name"]
        )

        db.session.add(section)
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Section created successfully",
            "section_id": section.section_id
        }), 201

    except Exception as e:
        db.session.rollback()

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400


# GET ALL SECTIONS
@section_bp.route("/api/sections", methods=["GET"])
def get_sections():
    sections = Section.query.all()

    result = []

    for section in sections:
        result.append({
            "section_id": section.section_id,
            "section_name": section.section_name
        })

    return jsonify(result), 200


# GET SECTION BY ID
@section_bp.route("/api/sections/<int:section_id>", methods=["GET"])
def get_section(section_id):
    section = Section.query.get(section_id)

    if not section:
        return jsonify({
            "status": "error",
            "message": "Section not found"
        }), 404

    return jsonify({
        "section_id": section.section_id,
        "section_name": section.section_name
    }), 200


# UPDATE SECTION
@section_bp.route("/api/sections/<int:section_id>", methods=["PUT"])
def update_section(section_id):
    section = Section.query.get(section_id)

    if not section:
        return jsonify({
            "status": "error",
            "message": "Section not found"
        }), 404

    data = request.get_json()

    try:
        if "section_name" in data:
            section.section_name = data["section_name"]

        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Section updated successfully"
        }), 200

    except Exception as e:
        db.session.rollback()

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400


# DELETE SECTION
@section_bp.route("/api/sections/<int:section_id>", methods=["DELETE"])
def delete_section(section_id):
    section = Section.query.get(section_id)

    if not section:
        return jsonify({
            "status": "error",
            "message": "Section not found"
        }), 404

    try:
        db.session.delete(section)
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Section deleted successfully"
        }), 200

    except Exception as e:
        db.session.rollback()

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400