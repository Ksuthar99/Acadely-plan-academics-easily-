from flask import Blueprint, request, jsonify
from extensions import db
from models import Student

student_bp = Blueprint("student", __name__)


# CREATE STUDENT
@student_bp.route("/api/students", methods=["POST"])
def create_student():
    data = request.get_json()

    if not data:
        return jsonify({
            "status": "error",
            "message": "Request data is required"
        }), 400

    required_fields = [
        "student_name",
        "academic_year_id",
        "program_id",
        "class_id",
        "division_id"
    ]

    for field in required_fields:
        if field not in data:
            return jsonify({
                "status": "error",
                "message": f"{field} is required"
            }), 400

    try:
        student = Student(
            student_name=data["student_name"],
            student_email=data.get("student_email"),
            mobile_number=data.get("mobile_number"),
            roll_number=data.get("roll_number"),
            academic_year_id=data["academic_year_id"],
            program_id=data["program_id"],
            class_id=data["class_id"],
            division_id=data["division_id"],
            batch_id=data.get("batch_id")
        )

        db.session.add(student)
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Student created successfully",
            "student_id": student.student_id
        }), 201

    except Exception as e:
        db.session.rollback()

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400


# GET ALL STUDENTS
@student_bp.route("/api/students", methods=["GET"])
def get_students():
    students = Student.query.all()

    result = []

    for student in students:
        result.append({
            "student_id": student.student_id,
            "student_name": student.student_name,
            "student_email": student.student_email,
            "mobile_number": student.mobile_number,
            "roll_number": student.roll_number,
            "academic_year_id": student.academic_year_id,
            "program_id": student.program_id,
            "class_id": student.class_id,
            "division_id": student.division_id,
            "batch_id": student.batch_id
        })

    return jsonify(result), 200


# GET STUDENT BY ID
@student_bp.route("/api/students/<int:student_id>", methods=["GET"])
def get_student(student_id):
    student = Student.query.get(student_id)

    if not student:
        return jsonify({
            "status": "error",
            "message": "Student not found"
        }), 404

    return jsonify({
        "student_id": student.student_id,
        "student_name": student.student_name,
        "student_email": student.student_email,
        "mobile_number": student.mobile_number,
        "roll_number": student.roll_number,
        "academic_year_id": student.academic_year_id,
        "program_id": student.program_id,
        "class_id": student.class_id,
        "division_id": student.division_id,
        "batch_id": student.batch_id
    }), 200


# UPDATE STUDENT
@student_bp.route("/api/students/<int:student_id>", methods=["PUT"])
def update_student(student_id):
    student = Student.query.get(student_id)

    if not student:
        return jsonify({
            "status": "error",
            "message": "Student not found"
        }), 404

    data = request.get_json()

    try:
        if "student_name" in data:
            student.student_name = data["student_name"]

        if "student_email" in data:
            student.student_email = data["student_email"]

        if "mobile_number" in data:
            student.mobile_number = data["mobile_number"]

        if "roll_number" in data:
            student.roll_number = data["roll_number"]

        if "academic_year_id" in data:
            student.academic_year_id = data["academic_year_id"]

        if "program_id" in data:
            student.program_id = data["program_id"]

        if "class_id" in data:
            student.class_id = data["class_id"]

        if "division_id" in data:
            student.division_id = data["division_id"]

        if "batch_id" in data:
            student.batch_id = data["batch_id"]

        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Student updated successfully"
        }), 200

    except Exception as e:
        db.session.rollback()

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400


# DELETE STUDENT
@student_bp.route("/api/students/<int:student_id>", methods=["DELETE"])
def delete_student(student_id):
    student = Student.query.get(student_id)

    if not student:
        return jsonify({
            "status": "error",
            "message": "Student not found"
        }), 404

    try:
        db.session.delete(student)
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Student deleted successfully"
        }), 200

    except Exception as e:
        db.session.rollback()

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400