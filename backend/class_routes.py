from flask import Blueprint, request, jsonify
from extensions import db
from models import Class

class_bp = Blueprint("class", __name__)


# CREATE CLASS
@class_bp.route("/api/classes", methods=["POST"])
def create_class():
    data = request.get_json()

    if not data:
        return jsonify({
            "status": "error",
            "message": "Request data is required"
        }), 400

    required_fields = [
        "class_name",
        "program_id",
        "department_id"
    ]

    for field in required_fields:
        if field not in data:
            return jsonify({
                "status": "error",
                "message": f"{field} is required"
            }), 400

    try:
        new_class = Class(
            class_name=data["class_name"],
            program_id=data["program_id"],
            department_id=data["department_id"]
        )

        db.session.add(new_class)
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Class created successfully",
            "class_id": new_class.class_id
        }), 201

    except Exception as e:
        db.session.rollback()

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400


# GET ALL CLASSES
@class_bp.route("/api/classes", methods=["GET"])
def get_classes():
    classes = Class.query.all()

    result = []

    for item in classes:
        result.append({
            "class_id": item.class_id,
            "class_name": item.class_name,
            "program_id": item.program_id,
            "department_id": item.department_id
        })

    return jsonify(result), 200


# GET CLASS BY ID
@class_bp.route("/api/classes/<int:class_id>", methods=["GET"])
def get_class(class_id):
    item = Class.query.get(class_id)

    if not item:
        return jsonify({
            "status": "error",
            "message": "Class not found"
        }), 404

    return jsonify({
        "class_id": item.class_id,
        "class_name": item.class_name,
        "program_id": item.program_id,
        "department_id": item.department_id
    }), 200


# UPDATE CLASS
@class_bp.route("/api/classes/<int:class_id>", methods=["PUT"])
def update_class(class_id):
    item = Class.query.get(class_id)

    if not item:
        return jsonify({
            "status": "error",
            "message": "Class not found"
        }), 404

    data = request.get_json()

    try:
        if "class_name" in data:
            item.class_name = data["class_name"]

        if "program_id" in data:
            item.program_id = data["program_id"]

        if "department_id" in data:
            item.department_id = data["department_id"]

        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Class updated successfully"
        }), 200

    except Exception as e:
        db.session.rollback()

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400


# DELETE CLASS
@class_bp.route("/api/classes/<int:class_id>", methods=["DELETE"])
def delete_class(class_id):
    item = Class.query.get(class_id)

    if not item:
        return jsonify({
            "status": "error",
            "message": "Class not found"
        }), 404

    try:
        db.session.delete(item)
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Class deleted successfully"
        }), 200

    except Exception as e:
        db.session.rollback()

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400