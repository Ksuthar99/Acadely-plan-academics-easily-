from flask import Blueprint, request, jsonify
from extensions import db
from models import Batch

batch_bp = Blueprint("batch", __name__)


# CREATE BATCH
@batch_bp.route("/api/batches", methods=["POST"])
def create_batch():
    data = request.get_json()

    if not data:
        return jsonify({
            "status": "error",
            "message": "Request data is required"
        }), 400

    required_fields = [
        "batch_name",
        "division_id",
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
        batch = Batch(
            batch_name=data["batch_name"],
            division_id=data["division_id"],
            class_id=data["class_id"],
            program_id=data["program_id"],
            section_id=data["section_id"],
            department_id=data["department_id"]
        )

        db.session.add(batch)
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Batch created successfully",
            "batch_id": batch.batch_id
        }), 201

    except Exception as e:
        db.session.rollback()

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400


# GET ALL BATCHES
@batch_bp.route("/api/batches", methods=["GET"])
def get_batches():
    batches = Batch.query.all()

    result = []

    for batch in batches:
        result.append({
            "batch_id": batch.batch_id,
            "batch_name": batch.batch_name,
            "division_id": batch.division_id,
            "class_id": batch.class_id,
            "program_id": batch.program_id,
            "section_id": batch.section_id,
            "department_id": batch.department_id
        })

    return jsonify(result), 200


# GET BATCH BY ID
@batch_bp.route("/api/batches/<int:batch_id>", methods=["GET"])
def get_batch(batch_id):
    batch = Batch.query.get(batch_id)

    if not batch:
        return jsonify({
            "status": "error",
            "message": "Batch not found"
        }), 404

    return jsonify({
        "batch_id": batch.batch_id,
        "batch_name": batch.batch_name,
        "division_id": batch.division_id,
        "class_id": batch.class_id,
        "program_id": batch.program_id,
        "section_id": batch.section_id,
        "department_id": batch.department_id
    }), 200


# UPDATE BATCH
@batch_bp.route("/api/batches/<int:batch_id>", methods=["PUT"])
def update_batch(batch_id):
    batch = Batch.query.get(batch_id)

    if not batch:
        return jsonify({
            "status": "error",
            "message": "Batch not found"
        }), 404

    data = request.get_json()

    try:
        if "batch_name" in data:
            batch.batch_name = data["batch_name"]

        if "division_id" in data:
            batch.division_id = data["division_id"]

        if "class_id" in data:
            batch.class_id = data["class_id"]

        if "program_id" in data:
            batch.program_id = data["program_id"]

        if "section_id" in data:
            batch.section_id = data["section_id"]

        if "department_id" in data:
            batch.department_id = data["department_id"]

        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Batch updated successfully"
        }), 200

    except Exception as e:
        db.session.rollback()

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400


# DELETE BATCH
@batch_bp.route("/api/batches/<int:batch_id>", methods=["DELETE"])
def delete_batch(batch_id):
    batch = Batch.query.get(batch_id)

    if not batch:
        return jsonify({
            "status": "error",
            "message": "Batch not found"
        }), 404

    try:
        db.session.delete(batch)
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Batch deleted successfully"
        }), 200

    except Exception as e:
        db.session.rollback()

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400