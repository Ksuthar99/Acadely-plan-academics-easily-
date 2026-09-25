from flask import Blueprint, request, jsonify
from extensions import db
from models import Classroom

classroom_bp = Blueprint("classroom", __name__)


# CREATE CLASSROOM
@classroom_bp.route("/api/classrooms", methods=["POST"])
def create_classroom():
    data = request.get_json()

    if not data:
        return jsonify({
            "status": "error",
            "message": "Request data is required"
        }), 400

    if "classroom_name" not in data:
        return jsonify({
            "status": "error",
            "message": "classroom_name is required"
        }), 400

    try:
        classroom = Classroom(
            classroom_name=data["classroom_name"],
            building_name=data.get("building_name"),
            capacity=data.get("capacity"),
            classroom_type=data.get("classroom_type")
        )

        db.session.add(classroom)
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Classroom created successfully",
            "classroom_id": classroom.classroom_id
        }), 201

    except Exception as e:
        db.session.rollback()

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400


# GET ALL CLASSROOMS
@classroom_bp.route("/api/classrooms", methods=["GET"])
def get_classrooms():
    classrooms = Classroom.query.all()

    result = []

    for classroom in classrooms:
        result.append({
            "classroom_id": classroom.classroom_id,
            "classroom_name": classroom.classroom_name,
            "building_name": classroom.building_name,
            "capacity": classroom.capacity,
            "classroom_type": classroom.classroom_type
        })

    return jsonify(result), 200


# GET CLASSROOM BY ID
@classroom_bp.route("/api/classrooms/<int:classroom_id>", methods=["GET"])
def get_classroom(classroom_id):
    classroom = Classroom.query.get(classroom_id)

    if not classroom:
        return jsonify({
            "status": "error",
            "message": "Classroom not found"
        }), 404

    return jsonify({
        "classroom_id": classroom.classroom_id,
        "classroom_name": classroom.classroom_name,
        "building_name": classroom.building_name,
        "capacity": classroom.capacity,
        "classroom_type": classroom.classroom_type
    }), 200


# UPDATE CLASSROOM
@classroom_bp.route("/api/classrooms/<int:classroom_id>", methods=["PUT"])
def update_classroom(classroom_id):
    classroom = Classroom.query.get(classroom_id)

    if not classroom:
        return jsonify({
            "status": "error",
            "message": "Classroom not found"
        }), 404

    data = request.get_json()

    try:
        if "classroom_name" in data:
            classroom.classroom_name = data["classroom_name"]

        if "building_name" in data:
            classroom.building_name = data["building_name"]

        if "capacity" in data:
            classroom.capacity = data["capacity"]

        if "classroom_type" in data:
            classroom.classroom_type = data["classroom_type"]

        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Classroom updated successfully"
        }), 200

    except Exception as e:
        db.session.rollback()

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400


# DELETE CLASSROOM
@classroom_bp.route("/api/classrooms/<int:classroom_id>", methods=["DELETE"])
def delete_classroom(classroom_id):
    classroom = Classroom.query.get(classroom_id)

    if not classroom:
        return jsonify({
            "status": "error",
            "message": "Classroom not found"
        }), 404

    try:
        db.session.delete(classroom)
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Classroom deleted successfully"
        }), 200

    except Exception as e:
        db.session.rollback()

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400