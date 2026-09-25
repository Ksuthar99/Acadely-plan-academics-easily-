from flask_jwt_extended import JWTManager
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

from extensions import db

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = "acadely-development-secret-key"

jwt = JWTManager(app)
# Enable CORS
CORS(app)

# PostgreSQL database configuration
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Initialize SQLAlchemy
db.init_app(app)


# Register routes
from academic_year_routes import academic_year_bp
from department_routes import department_bp
from faculty_routes import faculty_bp
from section_routes import section_bp
from program_routes import program_bp
from class_routes import class_bp
from division_routes import division_bp
from course_routes import course_bp
from batch_routes import batch_bp
from student_routes import student_bp
from classroom_routes import classroom_bp
from laboratory_routes import laboratory_bp
from time_slot_routes import time_slot_bp
from course_allocation_routes import course_allocation_bp
from faculty_availability_routes import faculty_availability_bp
from timetable_routes import timetable_bp
from faculty_leave_routes import faculty_leave_bp
from auth_routes import auth_bp
from timetable_generator_routes import timetable_generator_bp

app.register_blueprint(academic_year_bp)
app.register_blueprint(department_bp)
app.register_blueprint(faculty_bp)
app.register_blueprint(section_bp)
app.register_blueprint(program_bp)
app.register_blueprint(class_bp)
app.register_blueprint(division_bp)
app.register_blueprint(course_bp)
app.register_blueprint(batch_bp)
app.register_blueprint(student_bp)
app.register_blueprint(classroom_bp)
app.register_blueprint(laboratory_bp)
app.register_blueprint(time_slot_bp)
app.register_blueprint(course_allocation_bp)
app.register_blueprint(faculty_availability_bp)
app.register_blueprint(timetable_bp)
app.register_blueprint(faculty_leave_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(timetable_generator_bp)

# Health Check API
@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "ok",
        "message": "Acadely Flask Backend is running!"
    })


# Database Test API
@app.route("/api/db-test", methods=["GET"])
def database_test():
    try:
        db.session.execute(db.text("SELECT 1"))

        return jsonify({
            "status": "ok",
            "message": "PostgreSQL database connected successfully!"
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


# Import all models
from models import (
    AcademicYear,
    Department,
    Section,
    Program,
    Class,
    Division,
    Course,
    Batch,
    Faculty,
    Student,
    Laboratory,
    TimeSlot,
    CourseAllocation,
    FacultyAvailability,
    Timetable,
    FacultyLeave,
    User
)


# Create database tables
with app.app_context():
    db.create_all()
    print("Acadely database tables created successfully!")


# Run Flask application
if __name__ == "__main__":
    app.run(debug=True, port=5000)