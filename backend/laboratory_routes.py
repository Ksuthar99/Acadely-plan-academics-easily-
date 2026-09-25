from flask import Blueprint, request, jsonify
from extensions import db
from models import Laboratory

laboratory_bp = Blueprint("laboratory", __name__)


# CREATE LABORATORY
@laboratory_bp.route("/api/laboratories", methods=["POST"])
def create_laboratory():
    data = request.get_json()

    if not data:
        return jsonify({
            "status": "error",
            "message": "Request data is required"
        }), 400

    if "laboratory_name" not in data:
        return jsonify({
            "status": "error",
            "message": "laboratory_name is required"
        }), 400

    try:
        laboratory = Laboratory(
            laboratory_name=data["laboratory_name"],
            building_name=data.get("building_name"),
            capacity=data.get("capacity"),
            laboratory_type=data.get("laboratory_type")
        )

        db.session.add(laboratory)
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Laboratory created successfully",
            "laboratory_id": laboratory.laboratory_id
        }), 201

    except Exception as e:
        db.session.rollback()

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400


# GET ALL LABORATORIES
@laboratory_bp.route("/api/laboratories", methods=["GET"])
def get_laboratories():
    laboratories = Laboratory.query.all()

    result = []

    for laboratory in laboratories:
        result.append({
            "laboratory_id": laboratory.laboratory_id,
            "laboratory_name": laboratory.laboratory_name,
            "building_name": laboratory.building_name,
            "capacity": laboratory.capacity,
            "laboratory_type": laboratory.laboratory_type
        })

    return jsonify(result), 200


# GET LABORATORY BY ID
@laboratory_bp.route("/api/laboratories/<int:laboratory_id>", methods=["GET"])
def get_laboratory(laboratory_id):
    laboratory = Laboratory.query.get(laboratory_id)

    if not laboratory:
        return jsonify({
            "status": "error",
            "message": "Laboratory not found"
        }), 404

    return jsonify({
        "laboratory_id": laboratory.laboratory_id,
        "laboratory_name": laboratory.laboratory_name,
        "building_name": laboratory.building_name,
        "capacity": laboratory.capacity,
        "laboratory_type": laboratory.laboratory_type
    }), 200


# UPDATE LABORATORY
@laboratory_bp.route("/api/laboratories/<int:laboratory_id>", methods=["PUT"])
def update_laboratory(laboratory_id):
    laboratory = Laboratory.query.get(laboratory_id)

    if not laboratory:
        return jsonify({
            "status": "error",
            "message": "Laboratory not found"
        }), 404

    data = request.get_json()

    try:
        if "laboratory_name" in data:
            laboratory.laboratory_name = data["laboratory_name"]

        if "building_name" in data:
            laboratory.building_name = data["building_name"]

        if "capacity" in data:
            laboratory.capacity = data["capacity"]

        if "laboratory_type" in data:
            laboratory.laboratory_type = data["laboratory_type"]

        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Laboratory updated successfully"
        }), 200

    except Exception as e:
        db.session.rollback()

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400


# DELETE LABORATORY
@laboratory_bp.route("/api/laboratories/<int:laboratory_id>", methods=["DELETE"])
def delete_laboratory(laboratory_id):
    laboratory = Laboratory.query.get(laboratory_id)

    if not laboratory:
        return jsonify({
            "status": "error",
            "message": "Laboratory not found"
        }), 404

    try:
        db.session.delete(laboratory)
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Laboratory deleted successfully"
        }), 200

    except Exception as e:
        db.session.rollback()

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400