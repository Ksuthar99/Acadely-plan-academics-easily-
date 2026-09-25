
from flask import Blueprint, request, jsonify
from datetime import datetime

from extensions import db
from models import (
    Timetable,
    AcademicYear,
    CourseAllocation,
    Course,
    Faculty,
    TimeSlot,
    Division,
    Batch,
    Classroom,
    Laboratory,
    FacultyAvailability,
    FacultyLeave
)

timetable_bp = Blueprint("timetable", __name__)


# ====================================================
# HELPER FUNCTIONS
# ====================================================

def validate_day(day):
    valid_days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ]

    return day in valid_days


def check_faculty_availability(
    faculty_id,
    day,
    time_slot
):
    """
    Check whether faculty is normally available
    during the selected day and time slot.
    """

    availability = FacultyAvailability.query.filter_by(
        faculty_id=faculty_id,
        day=day
    ).all()

    if not availability:
        return "Faculty has no availability set for this day"

    for slot in availability:

        if not slot.is_available:
            continue

        if (
            slot.start_time <= time_slot.start_time
            and slot.end_time >= time_slot.end_time
        ):
            return None

    return "Faculty is not available at this day and time"


def check_faculty_leave(
    faculty_id,
    day,
    time_slot
):
    """
    Check whether faculty has leave overlapping
    the selected date and time.

    Current timetable stores day-of-week, while leave
    stores an actual date. Therefore this function
    checks leave records whose date falls on the
    selected weekday.
    """

    weekday_number = {
        "Monday": 0,
        "Tuesday": 1,
        "Wednesday": 2,
        "Thursday": 3,
        "Friday": 4,
        "Saturday": 5,
        "Sunday": 6
    }

    target_weekday = weekday_number.get(day)

    if target_weekday is None:
        return None

    leaves = FacultyLeave.query.filter_by(
        faculty_id=faculty_id
    ).all()

    for leave in leaves:

        if leave.leave_date.weekday() != target_weekday:
            continue

        if (
            leave.start_time < time_slot.end_time
            and leave.end_time > time_slot.start_time
        ):
            return "Faculty is on leave at this day and time"

    return None


def check_timetable_conflict(
    academic_year_id,
    allocation_id,
    day,
    time_slot_id,
    division_id,
    classroom_id=None,
    laboratory_id=None,
    batch_id=None,
    exclude_timetable_id=None
):

    # --------------------------------------------
    # Selected time slot
    # --------------------------------------------

    selected_time_slot = TimeSlot.query.get(
        time_slot_id
    )

    if not selected_time_slot:
        return "Time slot not found"

    # --------------------------------------------
    # Find all timetable entries on same day
    # --------------------------------------------

    query = Timetable.query.filter(
        Timetable.academic_year_id == academic_year_id,
        Timetable.day == day
    )

    if exclude_timetable_id is not None:

        query = query.filter(
            Timetable.timetable_id != exclude_timetable_id
        )

    existing_entries = query.all()

    # --------------------------------------------
    # Current allocation
    # --------------------------------------------

    current_allocation = CourseAllocation.query.get(
        allocation_id
    )

    # --------------------------------------------
    # Check every existing timetable entry
    # --------------------------------------------

    for existing in existing_entries:

        existing_time_slot = TimeSlot.query.get(
            existing.time_slot_id
        )

        if not existing_time_slot:
            continue

        # ----------------------------------------
        # Actual time overlap
        # ----------------------------------------

        time_overlap = (
            selected_time_slot.start_time
            < existing_time_slot.end_time
            and
            selected_time_slot.end_time
            > existing_time_slot.start_time
        )

        if not time_overlap:
            continue

        # ========================================
        # Division / Batch conflict
        # ========================================

        if existing.division_id == division_id:

            # Both entries belong to batches
            if (
                batch_id is not None
                and existing.batch_id is not None
            ):

                if batch_id == existing.batch_id:

                    return (
                        "Batch is already scheduled "
                        "at this day and time"
                    )

            # One or both entries belong to
            # the complete division
            else:

                return (
                    "Division is already scheduled "
                    "at this day and time"
                )

        # ========================================
        # Faculty conflict
        # ========================================

        existing_allocation = CourseAllocation.query.get(
            existing.allocation_id
        )

        if (
            existing_allocation
            and current_allocation
            and existing_allocation.faculty_id
            == current_allocation.faculty_id
        ):

            return (
                "Faculty is already scheduled "
                "at this day and time"
            )

        # ========================================
        # Classroom conflict
        # ========================================

        if (
            classroom_id is not None
            and existing.classroom_id == classroom_id
        ):

            return (
                "Classroom is already occupied "
                "at this day and time"
            )

        # ========================================
        # Laboratory conflict
        # ========================================

        if (
            laboratory_id is not None
            and existing.laboratory_id == laboratory_id
        ):

            return (
                "Laboratory is already occupied "
                "at this day and time"
            )

    return None


# ====================================================
# GET ALL TIMETABLES
# ====================================================

@timetable_bp.route(
    "/api/timetables",
    methods=["GET"]
)
def get_timetables():

    timetables = Timetable.query.all()

    result = []

    for timetable in timetables:

        result.append({
            "timetable_id": timetable.timetable_id,
            "academic_year_id": timetable.academic_year_id,
            "allocation_id": timetable.allocation_id,
            "day": timetable.day,
            "time_slot_id": timetable.time_slot_id,
            "division_id": timetable.division_id,
            "batch_id": timetable.batch_id,
            "classroom_id": timetable.classroom_id,
            "laboratory_id": timetable.laboratory_id
        })

    return jsonify(result), 200


# ====================================================
# GET SINGLE TIMETABLE
# ====================================================

@timetable_bp.route(
    "/api/timetables/<int:timetable_id>",
    methods=["GET"]
)
def get_timetable(timetable_id):

    timetable = Timetable.query.get(timetable_id)

    if not timetable:

        return jsonify({
            "status": "error",
            "message": "Timetable not found"
        }), 404

    return jsonify({
        "timetable_id": timetable.timetable_id,
        "academic_year_id": timetable.academic_year_id,
        "allocation_id": timetable.allocation_id,
        "day": timetable.day,
        "time_slot_id": timetable.time_slot_id,
        "division_id": timetable.division_id,
        "batch_id": timetable.batch_id,
        "classroom_id": timetable.classroom_id,
        "laboratory_id": timetable.laboratory_id
    }), 200


# ====================================================
# CREATE TIMETABLE
# ====================================================

@timetable_bp.route(
    "/api/timetables",
    methods=["POST"]
)
def create_timetable():

    data = request.get_json()

    if not data:

        return jsonify({
            "status": "error",
            "message": "Request body is required"
        }), 400

    required_fields = [
        "academic_year_id",
        "allocation_id",
        "day",
        "time_slot_id",
        "division_id"
    ]

    for field in required_fields:

        if field not in data:

            return jsonify({
                "status": "error",
                "message": f"{field} is required"
            }), 400

    academic_year_id = data["academic_year_id"]
    allocation_id = data["allocation_id"]
    day = data["day"]
    time_slot_id = data["time_slot_id"]
    division_id = data["division_id"]

    batch_id = data.get("batch_id")
    classroom_id = data.get("classroom_id")
    laboratory_id = data.get("laboratory_id")

    # --------------------------------------------
    # Day validation
    # --------------------------------------------

    if not validate_day(day):

        return jsonify({
            "status": "error",
            "message": "Invalid day"
        }), 400

    # --------------------------------------------
    # Classroom / Laboratory
    # --------------------------------------------

    if (
        classroom_id is not None
        and laboratory_id is not None
    ):

        return jsonify({
            "status": "error",
            "message": (
                "A timetable entry cannot have "
                "both classroom and laboratory"
            )
        }), 400

    if (
        classroom_id is None
        and laboratory_id is None
    ):

        return jsonify({
            "status": "error",
            "message": (
                "Either classroom_id or laboratory_id "
                "is required"
            )
        }), 400

    # --------------------------------------------
    # Academic year
    # --------------------------------------------

    academic_year = AcademicYear.query.get(
        academic_year_id
    )

    if not academic_year:

        return jsonify({
            "status": "error",
            "message": "Academic year not found"
        }), 404

    # --------------------------------------------
    # Course allocation
    # --------------------------------------------

    allocation = CourseAllocation.query.get(
        allocation_id
    )

    if not allocation:

        return jsonify({
            "status": "error",
            "message": "Course allocation not found"
        }), 404

    # --------------------------------------------
    # Academic year consistency
    # --------------------------------------------

    if allocation.academic_year_id != academic_year_id:

        return jsonify({
            "status": "error",
            "message": (
                "Course allocation does not belong "
                "to the selected academic year"
            )
        }), 400

    # --------------------------------------------
    # Division consistency
    # --------------------------------------------

    if allocation.division_id != division_id:

        return jsonify({
            "status": "error",
            "message": (
                "Course allocation does not belong "
                "to the selected division"
            )
        }), 400

    # --------------------------------------------
    # Batch consistency
    # --------------------------------------------

    if allocation.batch_id is not None:

        if batch_id != allocation.batch_id:

            return jsonify({
                "status": "error",
                "message": (
                    "Course allocation does not belong "
                    "to the selected batch"
                )
            }), 400

    else:

        if batch_id is not None:

            return jsonify({
                "status": "error",
                "message": (
                    "This course allocation is not "
                    "assigned to a batch"
                )
            }), 400

    # --------------------------------------------
    # Time slot
    # --------------------------------------------

    time_slot = TimeSlot.query.get(
        time_slot_id
    )

    if not time_slot:

        return jsonify({
            "status": "error",
            "message": "Time slot not found"
        }), 404

    # --------------------------------------------
    # Division
    # --------------------------------------------

    division = Division.query.get(
        division_id
    )

    if not division:

        return jsonify({
            "status": "error",
            "message": "Division not found"
        }), 404

    # --------------------------------------------
    # Batch
    # --------------------------------------------

    if batch_id is not None:

        batch = Batch.query.get(
            batch_id
        )

        if not batch:

            return jsonify({
                "status": "error",
                "message": "Batch not found"
            }), 404

        if batch.division_id != division_id:

            return jsonify({
                "status": "error",
                "message": (
                    "Batch does not belong "
                    "to the selected division"
                )
            }), 400

    # --------------------------------------------
    # Classroom
    # --------------------------------------------

    if classroom_id is not None:

        classroom = Classroom.query.get(
            classroom_id
        )

        if not classroom:

            return jsonify({
                "status": "error",
                "message": "Classroom not found"
            }), 404

    # --------------------------------------------
    # Laboratory
    # --------------------------------------------

    if laboratory_id is not None:

        laboratory = Laboratory.query.get(
            laboratory_id
        )

        if not laboratory:

            return jsonify({
                "status": "error",
                "message": "Laboratory not found"
            }), 404

    # =================================================
    # FACULTY AVAILABILITY
    # =================================================

    availability_conflict = check_faculty_availability(
        allocation.faculty_id,
        day,
        time_slot
    )

    if availability_conflict:

        return jsonify({
            "status": "error",
            "message": availability_conflict
        }), 409

    # =================================================
    # FACULTY LEAVE
    # =================================================

    leave_conflict = check_faculty_leave(
        allocation.faculty_id,
        day,
        time_slot
    )

    if leave_conflict:

        return jsonify({
            "status": "error",
            "message": leave_conflict
        }), 409

    # =================================================
    # TIMETABLE CONFLICT
    # =================================================

    conflict = check_timetable_conflict(
        academic_year_id,
        allocation_id,
        day,
        time_slot_id,
        division_id,
        classroom_id,
        laboratory_id,
        batch_id
    )

    if conflict:

        return jsonify({
            "status": "error",
            "message": conflict
        }), 409

    # --------------------------------------------
    # Create timetable
    # --------------------------------------------

    timetable = Timetable(
        academic_year_id=academic_year_id,
        allocation_id=allocation_id,
        day=day,
        time_slot_id=time_slot_id,
        division_id=division_id,
        batch_id=batch_id,
        classroom_id=classroom_id,
        laboratory_id=laboratory_id
    )

    db.session.add(timetable)
    db.session.commit()

    return jsonify({
        "status": "success",
        "message": "Timetable created successfully",
        "timetable_id": timetable.timetable_id
    }), 201


# ====================================================
# UPDATE TIMETABLE
# ====================================================

@timetable_bp.route(
    "/api/timetables/<int:timetable_id>",
    methods=["PUT"]
)
def update_timetable(timetable_id):

    timetable = Timetable.query.get(
        timetable_id
    )

    if not timetable:

        return jsonify({
            "status": "error",
            "message": "Timetable not found"
        }), 404

    data = request.get_json()

    if not data:

        return jsonify({
            "status": "error",
            "message": "Request body is required"
        }), 400

    required_fields = [
        "academic_year_id",
        "allocation_id",
        "day",
        "time_slot_id",
        "division_id"
    ]

    for field in required_fields:

        if field not in data:

            return jsonify({
                "status": "error",
                "message": f"{field} is required"
            }), 400

    academic_year_id = data["academic_year_id"]
    allocation_id = data["allocation_id"]
    day = data["day"]
    time_slot_id = data["time_slot_id"]
    division_id = data["division_id"]

    batch_id = data.get("batch_id")
    classroom_id = data.get("classroom_id")
    laboratory_id = data.get("laboratory_id")

    # --------------------------------------------
    # Day validation
    # --------------------------------------------

    if not validate_day(day):

        return jsonify({
            "status": "error",
            "message": "Invalid day"
        }), 400

    # --------------------------------------------
    # Classroom / Laboratory
    # --------------------------------------------

    if (
        classroom_id is not None
        and laboratory_id is not None
    ):

        return jsonify({
            "status": "error",
            "message": (
                "A timetable entry cannot have "
                "both classroom and laboratory"
            )
        }), 400

    if (
        classroom_id is None
        and laboratory_id is None
    ):

        return jsonify({
            "status": "error",
            "message": (
                "Either classroom_id or laboratory_id "
                "is required"
            )
        }), 400

    # --------------------------------------------
    # Academic year
    # --------------------------------------------

    academic_year = AcademicYear.query.get(
        academic_year_id
    )

    if not academic_year:

        return jsonify({
            "status": "error",
            "message": "Academic year not found"
        }), 404

    # --------------------------------------------
    # Course allocation
    # --------------------------------------------

    allocation = CourseAllocation.query.get(
        allocation_id
    )

    if not allocation:

        return jsonify({
            "status": "error",
            "message": "Course allocation not found"
        }), 404

    # --------------------------------------------
    # Academic year consistency
    # --------------------------------------------

    if allocation.academic_year_id != academic_year_id:

        return jsonify({
            "status": "error",
            "message": (
                "Course allocation does not belong "
                "to the selected academic year"
            )
        }), 400

    # --------------------------------------------
    # Division consistency
    # --------------------------------------------

    if allocation.division_id != division_id:

        return jsonify({
            "status": "error",
            "message": (
                "Course allocation does not belong "
                "to the selected division"
            )
        }), 400

    # --------------------------------------------
    # Batch consistency
    # --------------------------------------------

    if allocation.batch_id is not None:

        if batch_id != allocation.batch_id:

            return jsonify({
                "status": "error",
                "message": (
                    "Course allocation does not belong "
                    "to the selected batch"
                )
            }), 400

    else:

        if batch_id is not None:

            return jsonify({
                "status": "error",
                "message": (
                    "This course allocation is not "
                    "assigned to a batch"
                )
            }), 400

    # --------------------------------------------
    # Time slot
    # --------------------------------------------

    time_slot = TimeSlot.query.get(
        time_slot_id
    )

    if not time_slot:

        return jsonify({
            "status": "error",
            "message": "Time slot not found"
        }), 404

    # --------------------------------------------
    # Division
    # --------------------------------------------

    division = Division.query.get(
        division_id
    )

    if not division:

        return jsonify({
            "status": "error",
            "message": "Division not found"
        }), 404

    # --------------------------------------------
    # Batch
    # --------------------------------------------

    if batch_id is not None:

        batch = Batch.query.get(
            batch_id
        )

        if not batch:

            return jsonify({
                "status": "error",
                "message": "Batch not found"
            }), 404

        if batch.division_id != division_id:

            return jsonify({
                "status": "error",
                "message": (
                    "Batch does not belong "
                    "to the selected division"
                )
            }), 400

    # --------------------------------------------
    # Classroom
    # --------------------------------------------

    if classroom_id is not None:

        classroom = Classroom.query.get(
            classroom_id
        )

        if not classroom:

            return jsonify({
                "status": "error",
                "message": "Classroom not found"
            }), 404

    # --------------------------------------------
    # Laboratory
    # --------------------------------------------

    if laboratory_id is not None:

        laboratory = Laboratory.query.get(
            laboratory_id
        )

        if not laboratory:

            return jsonify({
                "status": "error",
                "message": "Laboratory not found"
            }), 404

    # =================================================
    # FACULTY AVAILABILITY
    # =================================================

    availability_conflict = check_faculty_availability(
        allocation.faculty_id,
        day,
        time_slot
    )

    if availability_conflict:

        return jsonify({
            "status": "error",
            "message": availability_conflict
        }), 409

    # =================================================
    # FACULTY LEAVE
    # =================================================

    leave_conflict = check_faculty_leave(
        allocation.faculty_id,
        day,
        time_slot
    )

    if leave_conflict:

        return jsonify({
            "status": "error",
            "message": leave_conflict
        }), 409

    # =================================================
    # TIMETABLE CONFLICT
    # =================================================

    conflict = check_timetable_conflict(
        academic_year_id,
        allocation_id,
        day,
        time_slot_id,
        division_id,
        classroom_id,
        laboratory_id,
        batch_id,
        exclude_timetable_id=timetable_id
    )

    if conflict:

        return jsonify({
            "status": "error",
            "message": conflict
        }), 409

    # --------------------------------------------
    # Update
    # --------------------------------------------

    timetable.academic_year_id = academic_year_id
    timetable.allocation_id = allocation_id
    timetable.day = day
    timetable.time_slot_id = time_slot_id
    timetable.division_id = division_id
    timetable.batch_id = batch_id
    timetable.classroom_id = classroom_id
    timetable.laboratory_id = laboratory_id

    db.session.commit()

    return jsonify({
        "status": "success",
        "message": "Timetable updated successfully"
    }), 200


# ====================================================
# DELETE TIMETABLE
# ====================================================

@timetable_bp.route(
    "/api/timetables/<int:timetable_id>",
    methods=["DELETE"]
)
def delete_timetable(timetable_id):

    timetable = Timetable.query.get(
        timetable_id
    )

    if not timetable:

        return jsonify({
            "status": "error",
            "message": "Timetable not found"
        }), 404

    db.session.delete(timetable)
    db.session.commit()

    return jsonify({
        "status": "success",
        "message": "Timetable deleted successfully"
    }), 200


# ====================================================
# GET TIMETABLE BY DIVISION
# ====================================================

@timetable_bp.route(
    "/api/timetables/division/<int:division_id>",
    methods=["GET"]
)
def get_timetable_by_division(division_id):

    division = Division.query.get(division_id)

    if not division:

        return jsonify({
            "status": "error",
            "message": "Division not found"
        }), 404

    academic_year_id = request.args.get(
        "academic_year_id",
        type=int
    )

    query = Timetable.query.filter_by(
        division_id=division_id
    )

    if academic_year_id is not None:

        query = query.filter_by(
            academic_year_id=academic_year_id
        )

    timetables = query.all()

    day_order = {
        "Monday": 1,
        "Tuesday": 2,
        "Wednesday": 3,
        "Thursday": 4,
        "Friday": 5,
        "Saturday": 6
    }

    timetables.sort(
        key=lambda item: (
            day_order.get(item.day, 99),
            TimeSlot.query.get(
                item.time_slot_id
            ).start_time
        )
    )

    result = []

    for timetable in timetables:

        allocation = CourseAllocation.query.get(
            timetable.allocation_id
        )

        course = None

        if allocation:

            course = Course.query.get(
                allocation.course_id
            )

        faculty = None

        if allocation and allocation.faculty_id is not None:

            faculty = Faculty.query.get(
                allocation.faculty_id
            )

        batch = None

        if timetable.batch_id is not None:

            batch = Batch.query.get(
                timetable.batch_id
            )

        time_slot = TimeSlot.query.get(
            timetable.time_slot_id
        )

        classroom = None

        if timetable.classroom_id is not None:

            classroom = Classroom.query.get(
                timetable.classroom_id
            )

        laboratory = None

        if timetable.laboratory_id is not None:

            laboratory = Laboratory.query.get(
                timetable.laboratory_id
            )

        result.append({

            "timetable_id": timetable.timetable_id,

            "academic_year_id": timetable.academic_year_id,

            "allocation_id": timetable.allocation_id,

            "division_id": timetable.division_id,

            "division_name": division.division_name,

            "batch_id": timetable.batch_id,

            "batch_name": (
                batch.batch_name
                if batch else None
            ),

            "day": timetable.day,

            "time_slot_id": timetable.time_slot_id,

            "slot_name": (
                time_slot.slot_name
                if time_slot else None
            ),

            "start_time": (
                time_slot.start_time.strftime("%H:%M")
                if time_slot else None
            ),

            "end_time": (
                time_slot.end_time.strftime("%H:%M")
                if time_slot else None
            ),

            "course_id": (
                course.course_id
                if course else None
            ),

            "course_name": (
                course.course_name
                if course else None
            ),

            "course_type": (
                course.course_type
                if course else None
            ),

            "faculty_id": (
                faculty.faculty_id
                if faculty else None
            ),

            "faculty_name": (
                faculty.faculty_name
                if faculty else None
            ),

            "classroom_id": timetable.classroom_id,

            "classroom_name": (
                classroom.classroom_name
                if classroom else None
            ),

            "laboratory_id": timetable.laboratory_id,

            "laboratory_name": (
                laboratory.laboratory_name
                if laboratory else None
            )
        })

    return jsonify({
        "status": "success",
        "division_id": division_id,
        "division_name": division.division_name,
        "academic_year_id": academic_year_id,
        "count": len(result),
        "timetable": result
    }), 200

