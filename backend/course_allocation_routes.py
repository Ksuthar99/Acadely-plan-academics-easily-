from flask import Blueprint, request, jsonify
from extensions import db
from models import CourseAllocation

course_allocation_bp = Blueprint(
    "course_allocation",
    __name__
)


# CREATE COURSE ALLOCATION
@course_allocation_bp.route("/api/course-allocations", methods=["POST"])
def create_course_allocation():

    data = request.get_json()

    if not data:
        return jsonify({
            "status": "error",
            "message": "Request data is required"
        }), 400

    required_fields = [
        "course_id",
        "faculty_id",
        "division_id",
        "academic_year_id"
    ]

    for field in required_fields:
        if field not in data:
            return jsonify({
                "status": "error",
                "message": f"{field} is required"
            }), 400

    try:
        allocation = CourseAllocation(
            course_id=data["course_id"],
            faculty_id=data["faculty_id"],
            division_id=data["division_id"],
            batch_id=data.get("batch_id"),
            academic_year_id=data["academic_year_id"]
        )

        db.session.add(allocation)
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Course allocation created successfully",
            "allocation_id": allocation.allocation_id
        }), 201

    except Exception as e:
        db.session.rollback()

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400


# GET ALL COURSE ALLOCATIONS
@course_allocation_bp.route(
    "/api/course-allocations",
    methods=["GET"]
)
def get_course_allocations():

    allocations = CourseAllocation.query.all()

    result = []

    for allocation in allocations:

        result.append({
            "allocation_id": allocation.allocation_id,
            "course_id": allocation.course_id,
            "faculty_id": allocation.faculty_id,
            "division_id": allocation.division_id,
            "batch_id": allocation.batch_id,
            "academic_year_id": allocation.academic_year_id
        })

    return jsonify(result), 200


# GET COURSE ALLOCATION BY ID
@course_allocation_bp.route(
    "/api/course-allocations/<int:allocation_id>",
    methods=["GET"]
)
def get_course_allocation(allocation_id):

    allocation = CourseAllocation.query.get(allocation_id)

    if not allocation:
        return jsonify({
            "status": "error",
            "message": "Course allocation not found"
        }), 404

    return jsonify({
        "allocation_id": allocation.allocation_id,
        "course_id": allocation.course_id,
        "faculty_id": allocation.faculty_id,
        "division_id": allocation.division_id,
        "batch_id": allocation.batch_id,
        "academic_year_id": allocation.academic_year_id
    }), 200


# UPDATE COURSE ALLOCATION
@course_allocation_bp.route(
    "/api/course-allocations/<int:allocation_id>",
    methods=["PUT"]
)
def update_course_allocation(allocation_id):

    allocation = CourseAllocation.query.get(allocation_id)

    if not allocation:
        return jsonify({
            "status": "error",
            "message": "Course allocation not found"
        }), 404

    data = request.get_json()

    try:

        if "course_id" in data:
            allocation.course_id = data["course_id"]

        if "faculty_id" in data:
            allocation.faculty_id = data["faculty_id"]

        if "division_id" in data:
            allocation.division_id = data["division_id"]

        if "batch_id" in data:
            allocation.batch_id = data["batch_id"]

        if "academic_year_id" in data:
            allocation.academic_year_id = data["academic_year_id"]

        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Course allocation updated successfully"
        }), 200

    except Exception as e:
        db.session.rollback()

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400


# DELETE COURSE ALLOCATION
@course_allocation_bp.route(
    "/api/course-allocations/<int:allocation_id>",
    methods=["DELETE"]
)
def delete_course_allocation(allocation_id):

    allocation = CourseAllocation.query.get(allocation_id)

    if not allocation:
        return jsonify({
            "status": "error",
            "message": "Course allocation not found"
        }), 404

    try:

        db.session.delete(allocation)
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Course allocation deleted successfully"
        }), 200

    except Exception as e:
        db.session.rollback()

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400