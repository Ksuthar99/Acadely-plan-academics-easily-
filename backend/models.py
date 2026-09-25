
from extensions import db


class AcademicYear(db.Model):
    __tablename__ = "academic_year"

    academic_year_id = db.Column(db.Integer, primary_key=True)
    academic_year = db.Column(db.String(20), nullable=False, unique=True)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    is_active = db.Column(db.Boolean, default=False)


class Department(db.Model):
    __tablename__ = "department"

    department_id = db.Column(db.Integer, primary_key=True)
    department_name = db.Column(db.String(100), nullable=False)
    department_description = db.Column(db.Text)

    hod_id = db.Column(
        db.Integer,
        db.ForeignKey("faculty.faculty_id"),
        nullable=True
    )

    hod = db.relationship(
        "Faculty",
        foreign_keys=[hod_id],
        post_update=True
    )

    faculty_members = db.relationship(
        "Faculty",
        foreign_keys="Faculty.department_id",
        backref="department"
    )


class Section(db.Model):
    __tablename__ = "section"

    section_id = db.Column(db.Integer, primary_key=True)
    section_name = db.Column(db.String(100), nullable=False)


class Program(db.Model):
    __tablename__ = "program"

    program_id = db.Column(db.Integer, primary_key=True)
    program_name = db.Column(db.String(100), nullable=False)

    section_id = db.Column(
        db.Integer,
        db.ForeignKey("section.section_id"),
        nullable=False
    )

    department_id = db.Column(
        db.Integer,
        db.ForeignKey("department.department_id"),
        nullable=False
    )

    program_duration = db.Column(db.Integer)
    program_level = db.Column(db.String(50))
    sanction_intake = db.Column(db.Integer)
    sanction_division = db.Column(db.Integer)


class Class(db.Model):
    __tablename__ = "class"

    class_id = db.Column(db.Integer, primary_key=True)
    class_name = db.Column(db.String(100), nullable=False)

    program_id = db.Column(
        db.Integer,
        db.ForeignKey("program.program_id"),
        nullable=False
    )

    department_id = db.Column(
        db.Integer,
        db.ForeignKey("department.department_id"),
        nullable=False
    )


class Division(db.Model):
    __tablename__ = "division"

    division_id = db.Column(db.Integer, primary_key=True)
    division_name = db.Column(db.String(50), nullable=False)

    class_id = db.Column(
        db.Integer,
        db.ForeignKey("class.class_id"),
        nullable=False
    )

    program_id = db.Column(
        db.Integer,
        db.ForeignKey("program.program_id"),
        nullable=False
    )

    section_id = db.Column(
        db.Integer,
        db.ForeignKey("section.section_id"),
        nullable=False
    )

    department_id = db.Column(
        db.Integer,
        db.ForeignKey("department.department_id"),
        nullable=False
    )


class Course(db.Model):
    __tablename__ = "course"

    course_id = db.Column(db.Integer, primary_key=True)
    course_name = db.Column(db.String(150), nullable=False)
    course_type = db.Column(db.String(50))
    course_credit = db.Column(db.Integer)
    course_hours = db.Column(db.Integer)
    weekly_hours = db.Column(db.Integer)

    class_id = db.Column(
        db.Integer,
        db.ForeignKey("class.class_id"),
        nullable=False
    )

    program_id = db.Column(
        db.Integer,
        db.ForeignKey("program.program_id"),
        nullable=False
    )

    section_id = db.Column(
        db.Integer,
        db.ForeignKey("section.section_id"),
        nullable=False
    )

    department_id = db.Column(
        db.Integer,
        db.ForeignKey("department.department_id"),
        nullable=False
    )


class Batch(db.Model):
    __tablename__ = "batch"

    batch_id = db.Column(db.Integer, primary_key=True)
    batch_name = db.Column(db.String(100), nullable=False)

    division_id = db.Column(
        db.Integer,
        db.ForeignKey("division.division_id"),
        nullable=False
    )

    class_id = db.Column(
        db.Integer,
        db.ForeignKey("class.class_id"),
        nullable=False
    )

    program_id = db.Column(
        db.Integer,
        db.ForeignKey("program.program_id"),
        nullable=False
    )

    section_id = db.Column(
        db.Integer,
        db.ForeignKey("section.section_id"),
        nullable=False
    )

    department_id = db.Column(
        db.Integer,
        db.ForeignKey("department.department_id"),
        nullable=False
    )


class Faculty(db.Model):
    __tablename__ = "faculty"

    faculty_id = db.Column(db.Integer, primary_key=True)
    faculty_name = db.Column(db.String(150), nullable=False)
    faculty_email = db.Column(db.String(150), unique=True, nullable=False)
    faculty_designation = db.Column(db.String(100))
    faculty_qualification = db.Column(db.String(200))
    mobile_number = db.Column(db.String(20))
    faculty_photo = db.Column(db.String(255))
    faculty_type = db.Column(db.String(50))

    department_id = db.Column(
        db.Integer,
        db.ForeignKey("department.department_id"),
        nullable=False
    )


class Student(db.Model):
    __tablename__ = "student"

    student_id = db.Column(db.Integer, primary_key=True)
    student_name = db.Column(db.String(150), nullable=False)
    student_email = db.Column(db.String(150), unique=True)
    mobile_number = db.Column(db.String(20))
    roll_number = db.Column(db.String(50))

    academic_year_id = db.Column(
        db.Integer,
        db.ForeignKey("academic_year.academic_year_id"),
        nullable=False
    )

    program_id = db.Column(
        db.Integer,
        db.ForeignKey("program.program_id"),
        nullable=False
    )

    class_id = db.Column(
        db.Integer,
        db.ForeignKey("class.class_id"),
        nullable=False
    )

    division_id = db.Column(
        db.Integer,
        db.ForeignKey("division.division_id"),
        nullable=False
    )

    batch_id = db.Column(
        db.Integer,
        db.ForeignKey("batch.batch_id"),
        nullable=True
    )


class Classroom(db.Model):
    __tablename__ = "classroom"

    classroom_id = db.Column(db.Integer, primary_key=True)
    classroom_name = db.Column(
        db.String(100),
        nullable=False,
        unique=True
    )
    building_name = db.Column(db.String(100))
    capacity = db.Column(db.Integer)
    classroom_type = db.Column(db.String(50))

class Laboratory(db.Model):
    __tablename__ = "laboratory"

    laboratory_id = db.Column(db.Integer, primary_key=True)
    laboratory_name = db.Column(db.String(100), nullable=False, unique=True)
    building_name = db.Column(db.String(100))
    capacity = db.Column(db.Integer)
    laboratory_type = db.Column(db.String(50))
    
class TimeSlot(db.Model):
    __tablename__ = "time_slot"

    time_slot_id = db.Column(db.Integer, primary_key=True)
    slot_name = db.Column(db.String(100), nullable=False)
    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=False)
    slot_type = db.Column(db.String(50), nullable=False)
    
class CourseAllocation(db.Model):
    __tablename__ = "course_allocation"

    allocation_id = db.Column(db.Integer, primary_key=True)

    course_id = db.Column(
        db.Integer,
        db.ForeignKey("course.course_id"),
        nullable=False
    )

    faculty_id = db.Column(
        db.Integer,
        db.ForeignKey("faculty.faculty_id"),
        nullable=False
    )

    division_id = db.Column(
        db.Integer,
        db.ForeignKey("division.division_id"),
        nullable=False
    )

    batch_id = db.Column(
        db.Integer,
        db.ForeignKey("batch.batch_id"),
        nullable=True
    )

    academic_year_id = db.Column(
        db.Integer,
        db.ForeignKey("academic_year.academic_year_id"),
        nullable=False
    )

class FacultyAvailability(db.Model):
    __tablename__ = "faculty_availability"

    availability_id = db.Column(db.Integer, primary_key=True)

    faculty_id = db.Column(
        db.Integer,
        db.ForeignKey("faculty.faculty_id"),
        nullable=False
    )

    day = db.Column(db.String(20), nullable=False)

    start_time = db.Column(db.Time, nullable=False)

    end_time = db.Column(db.Time, nullable=False)

    is_available = db.Column(db.Boolean, default=True)
    
    
class Timetable(db.Model):
    __tablename__ = "timetable"

    timetable_id = db.Column(db.Integer, primary_key=True)

    academic_year_id = db.Column(
        db.Integer,
        db.ForeignKey("academic_year.academic_year_id"),
        nullable=False
    )

    allocation_id = db.Column(
        db.Integer,
        db.ForeignKey("course_allocation.allocation_id"),
        nullable=False
    )

    day = db.Column(db.String(20), nullable=False)

    time_slot_id = db.Column(
        db.Integer,
        db.ForeignKey("time_slot.time_slot_id"),
        nullable=False
    )

    division_id = db.Column(
        db.Integer,
        db.ForeignKey("division.division_id"),
        nullable=False
    )

    batch_id = db.Column(
        db.Integer,
        db.ForeignKey("batch.batch_id"),
        nullable=True
    )

    classroom_id = db.Column(
        db.Integer,
        db.ForeignKey("classroom.classroom_id"),
        nullable=True
    )

    laboratory_id = db.Column(
        db.Integer,
        db.ForeignKey("laboratory.laboratory_id"),
        nullable=True
    )
    
class FacultyLeave(db.Model):
    __tablename__ = "faculty_leave"

    leave_id = db.Column(db.Integer, primary_key=True)

    faculty_id = db.Column(
        db.Integer,
        db.ForeignKey("faculty.faculty_id"),
        nullable=False
    )

    leave_date = db.Column(db.Date, nullable=False)

    start_time = db.Column(db.Time, nullable=False)

    end_time = db.Column(db.Time, nullable=False)

    reason = db.Column(db.String(255))
    
class User(db.Model):
    __tablename__ = "user"

    user_id = db.Column(db.Integer, primary_key=True)

    username = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)

    password_hash = db.Column(db.String(255), nullable=False)

    role = db.Column(db.String(20), nullable=False)

    is_approved = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)

    faculty_id = db.Column(
        db.Integer,
        db.ForeignKey("faculty.faculty_id"),
        nullable=True
    )

    student_id = db.Column(
        db.Integer,
        db.ForeignKey("student.student_id"),
        nullable=True
    )