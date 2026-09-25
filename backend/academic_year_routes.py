from flask import Blueprint, request, jsonify
from extensions import db
from models import AcademicYear
from datetime import datetime

academic_year_bp = Blueprint("academic_year", __name__)


# CREATE Academic Year
@academic_year_bp.route("/api/academic-years", methods=["POST"])
def create_academic_year():
    data = request.get_json()

    try:
        academic_year = AcademicYear(
            academic_year=data["academic_year"],
            start_date=datetime.strptime(data["start_date"], "%Y-%m-%d").date(),
            end_date=datetime.strptime(data["end_date"], "%Y-%m-%d").date(),
            is_active=data.get("is_active", False)
        )

        db.session.add(academic_year)
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Academic year created successfully",
            "academic_year_id": academic_year.academic_year_id
        }), 201

    except Exception as e:
        db.session.rollback()

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400


# GET all Academic Years
@academic_year_bp.route("/api/academic-years", methods=["GET"])
def get_academic_years():
    academic_years = AcademicYear.query.all()

    result = []

    for year in academic_years:
        result.append({
            "academic_year_id": year.academic_year_id,
            "academic_year": year.academic_year,
            "start_date": year.start_date.isoformat(),
            "end_date": year.end_date.isoformat(),
            "is_active": year.is_active
        })

    return jsonify(result), 200

# GET Academic Year by ID
@academic_year_bp.route("/api/academic-years/<int:academic_year_id>", methods=["GET"])
def get_academic_year(academic_year_id):
    academic_year = AcademicYear.query.get(academic_year_id)

    if not academic_year:
        return jsonify({
            "status": "error",
            "message": "Academic year not found"
        }), 404

    return jsonify({
        "academic_year_id": academic_year.academic_year_id,
        "academic_year": academic_year.academic_year,
        "start_date": academic_year.start_date.isoformat(),
        "end_date": academic_year.end_date.isoformat(),
        "is_active": academic_year.is_active
    }), 200
    
    # UPDATE Academic Year
@academic_year_bp.route("/api/academic-years/<int:academic_year_id>", methods=["PUT"])
def update_academic_year(academic_year_id):
    academic_year = AcademicYear.query.get(academic_year_id)

    if not academic_year:
        return jsonify({
            "status": "error",
            "message": "Academic year not found"
        }), 404

    data = request.get_json()

    try:
        if "academic_year" in data:
            academic_year.academic_year = data["academic_year"]

        if "start_date" in data:
            academic_year.start_date = datetime.strptime(
                data["start_date"], "%Y-%m-%d"
            ).date()

        if "end_date" in data:
            academic_year.end_date = datetime.strptime(
                data["end_date"], "%Y-%m-%d"
            ).date()

        if "is_active" in data:
            academic_year.is_active = data["is_active"]

        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Academic year updated successfully"
        }), 200

    except Exception as e:
        db.session.rollback()

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400
        
        
    # DELETE Academic Year
@academic_year_bp.route("/api/academic-years/<int:academic_year_id>", methods=["DELETE"])
def delete_academic_year(academic_year_id):
    academic_year = AcademicYear.query.get(academic_year_id)

    if not academic_year:
        return jsonify({
            "status": "error",
            "message": "Academic year not found"
        }), 404

    try:
        db.session.delete(academic_year)
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Academic year deleted successfully"
        }), 200

    except Exception as e:
        db.session.rollback()

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400