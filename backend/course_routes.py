from flask import Blueprint, request, jsonify
from extensions import db
from models import Course

course_bp = Blueprint("course", __name__)


# CREATE COURSE
@course_bp.route("/api/courses", methods=["POST"])
def create_course():
    data = request.get_json()

    if not data:
        return jsonify({
            "status": "error",
            "message": "Request data is required"
        }), 400

    required_fields = [
        "course_name",
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
        course = Course(
            course_name=data["course_name"],
            course_type=data.get("course_type"),
            course_credit=data.get("course_credit"),
            course_hours=data.get("course_hours"),
            weekly_hours=data.get("weekly_hours"),
            class_id=data["class_id"],
            program_id=data["program_id"],
            section_id=data["section_id"],
            department_id=data["department_id"]
        )

        db.session.add(course)
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Course created successfully",
            "course_id": course.course_id
        }), 201

    except Exception as e:
        db.session.rollback()

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400


# GET ALL COURSES
@course_bp.route("/api/courses", methods=["GET"])
def get_courses():
    courses = Course.query.all()

    result = []

    for course in courses:
        result.append({
            "course_id": course.course_id,
            "course_name": course.course_name,
            "course_type": course.course_type,
            "course_credit": course.course_credit,
            "course_hours": course.course_hours,
            "weekly_hours": course.weekly_hours,
            "class_id": course.class_id,
            "program_id": course.program_id,
            "section_id": course.section_id,
            "department_id": course.department_id
        })

    return jsonify(result), 200


# GET COURSE BY ID
@course_bp.route("/api/courses/<int:course_id>", methods=["GET"])
def get_course(course_id):
    course = Course.query.get(course_id)

    if not course:
        return jsonify({
            "status": "error",
            "message": "Course not found"
        }), 404

    return jsonify({
        "course_id": course.course_id,
        "course_name": course.course_name,
        "course_type": course.course_type,
        "course_credit": course.course_credit,
        "course_hours": course.course_hours,
        "weekly_hours": course.weekly_hours,
        "class_id": course.class_id,
        "program_id": course.program_id,
        "section_id": course.section_id,
        "department_id": course.department_id
    }), 200


# UPDATE COURSE
@course_bp.route("/api/courses/<int:course_id>", methods=["PUT"])
def update_course(course_id):
    course = Course.query.get(course_id)

    if not course:
        return jsonify({
            "status": "error",
            "message": "Course not found"
        }), 404

    data = request.get_json()

    try:
        if "course_name" in data:
            course.course_name = data["course_name"]

        if "course_type" in data:
            course.course_type = data["course_type"]

        if "course_credit" in data:
            course.course_credit = data["course_credit"]

        if "course_hours" in data:
            course.course_hours = data["course_hours"]
            
        if "weekly_hours" in data:
            course.weekly_hours = data["weekly_hours"]
        
        if "class_id" in data:
            course.class_id = data["class_id"]

        if "program_id" in data:
            course.program_id = data["program_id"]

        if "section_id" in data:
            course.section_id = data["section_id"]

        if "department_id" in data:
            course.department_id = data["department_id"]

        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Course updated successfully"
        }), 200

    except Exception as e:
        db.session.rollback()

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400


# DELETE COURSE
@course_bp.route("/api/courses/<int:course_id>", methods=["DELETE"])
def delete_course(course_id):
    course = Course.query.get(course_id)

    if not course:
        return jsonify({
            "status": "error",
            "message": "Course not found"
        }), 404

    try:
        db.session.delete(course)
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Course deleted successfully"
        }), 200

    except Exception as e:
        db.session.rollback()

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400