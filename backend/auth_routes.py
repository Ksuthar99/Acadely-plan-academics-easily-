from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt
from werkzeug.security import generate_password_hash, check_password_hash

from extensions import db
from models import User, Faculty, Student

auth_bp = Blueprint("auth", __name__)


# =========================================================
# HOD CHECK
# =========================================================


def hod_required():
    claims = get_jwt()

    if claims.get("role") != "HOD":
        return False

    return True


# =========================================================
# REGISTER
# =========================================================


@auth_bp.route("/api/auth/register", methods=["POST"])
def register():
    data = request.get_json()

    if not data:
        return jsonify({"status": "error", "message": "Request body is required"}), 400

    required_fields = ["username", "email", "password", "role"]

    for field in required_fields:
        if field not in data:
            return jsonify({"status": "error", "message": f"{field} is required"}), 400

    username = data["username"].strip()
    email = data["email"].strip().lower()
    password = data["password"]
    role = data["role"].upper()

    allowed_roles = ["HOD", "FACULTY", "STUDENT"]

    if role not in allowed_roles:
        return jsonify({"status": "error", "message": "Invalid role"}), 400

    if len(password) < 6:
        return (
            jsonify(
                {
                    "status": "error",
                    "message": "Password must contain at least 6 characters",
                }
            ),
            400,
        )

    if User.query.filter_by(username=username).first():
        return jsonify({"status": "error", "message": "Username already exists"}), 409

    if User.query.filter_by(email=email).first():
        return jsonify({"status": "error", "message": "Email already exists"}), 409

    faculty_id = data.get("faculty_id")
    student_id = data.get("student_id")

    # =====================================================
    # FACULTY
    # =====================================================

    if role == "FACULTY":
        if not faculty_id:
            return (
                jsonify(
                    {"status": "error", "message": "faculty_id is required for FACULTY"}
                ),
                400,
            )

        faculty = Faculty.query.get(faculty_id)

        if not faculty:
            return jsonify({"status": "error", "message": "Faculty not found"}), 404

        existing_user = User.query.filter_by(faculty_id=faculty_id).first()

        if existing_user:
            return (
                jsonify(
                    {
                        "status": "error",
                        "message": "This faculty already has an account",
                    }
                ),
                409,
            )

        student_id = None

    # =====================================================
    # STUDENT
    # =====================================================

    elif role == "STUDENT":
        if not student_id:
            return (
                jsonify(
                    {"status": "error", "message": "student_id is required for STUDENT"}
                ),
                400,
            )

        student = Student.query.get(student_id)

        if not student:
            return jsonify({"status": "error", "message": "Student not found"}), 404

        existing_user = User.query.filter_by(student_id=student_id).first()

        if existing_user:
            return (
                jsonify(
                    {
                        "status": "error",
                        "message": "This student already has an account",
                    }
                ),
                409,
            )

        faculty_id = None

    # =====================================================
    # HOD
    # =====================================================

    else:
        faculty_id = None
        student_id = None

    password_hash = generate_password_hash(password)

    # HOD accounts are approved immediately.
    # Faculty and Student accounts need HOD approval.

    is_approved = role == "HOD"

    user = User(
        username=username,
        email=email,
        password_hash=password_hash,
        role=role,
        is_approved=is_approved,
        is_active=True,
        faculty_id=faculty_id,
        student_id=student_id,
    )

    db.session.add(user)
    db.session.commit()

    try:

        db.session.add(user)
        db.session.commit()

    except Exception as e:

        db.session.rollback()

    return jsonify({"status": "error", "message": str(e)}), 400

    return (
        jsonify(
            {
                "status": "success",
                "message": (
                    "Faculty account created successfully. "
                    "Your account is waiting for HOD approval."
                    if role == "FACULTY"
                    else "User registered successfully"
                ),
                "user_id": user.user_id,
                "faculty_id": user.faculty_id,
                "role": user.role,
                "is_approved": user.is_approved,
            }
        ),
        201,
    )


# =========================================================
# LOGIN
# =========================================================


@auth_bp.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json()

    if not data:
        return jsonify({"status": "error", "message": "Request body is required"}), 400

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return (
            jsonify({"status": "error", "message": "Email and password are required"}),
            400,
        )

    email = email.strip().lower()

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"status": "error", "message": "Invalid email or password"}), 401

    if not check_password_hash(user.password_hash, password):
        return jsonify({"status": "error", "message": "Invalid email or password"}), 401

    if not user.is_active:
        return jsonify({"status": "error", "message": "Account is inactive"}), 403

    if not user.is_approved:
        return (
            jsonify({"status": "error", "message": "Account is waiting for approval"}),
            403,
        )

    access_token = create_access_token(
        identity=str(user.user_id), additional_claims={"role": user.role}
    )

    return jsonify(
        {
            "status": "success",
            "message": "Login successful",
            "access_token": access_token,
            "user": {
                "user_id": user.user_id,
                "username": user.username,
                "email": user.email,
                "role": user.role,
                "faculty_id": user.faculty_id,
                "student_id": user.student_id,
            },
        }
    )


# =========================================================
# GET PENDING USERS
# =========================================================


@auth_bp.route("/api/auth/pending-users", methods=["GET"])
@jwt_required()
def pending_users():
    if not hod_required():
        return jsonify({"status": "error", "message": "HOD access required"}), 403

    users = User.query.filter_by(is_approved=False, is_active=True).all()

    result = []

    for user in users:
        result.append(
            {
                "user_id": user.user_id,
                "username": user.username,
                "email": user.email,
                "role": user.role,
                "faculty_id": user.faculty_id,
                "student_id": user.student_id,
            }
        )

    return jsonify(result)


# =========================================================
# APPROVE USER
# =========================================================


@auth_bp.route("/api/auth/users//approve", methods=["PATCH"])
@jwt_required()
def approve_user(user_id):
    if not hod_required():
        return jsonify({"status": "error", "message": "HOD access required"}), 403

    user = User.query.get(user_id)

    if not user:
        return jsonify({"status": "error", "message": "User not found"}), 404

    if user.role == "HOD":
        return (
            jsonify(
                {
                    "status": "error",
                    "message": "HOD accounts cannot be approved using this API",
                }
            ),
            400,
        )

    user.is_approved = True
    user.is_active = True

    db.session.commit()

    return jsonify(
        {
            "status": "success",
            "message": "User approved successfully",
            "user_id": user.user_id,
        }
    )


# =========================================================
# REJECT / DEACTIVATE USER
# =========================================================


@auth_bp.route("/api/auth/users//reject", methods=["PATCH"])
@jwt_required()
def reject_user(user_id):
    if not hod_required():
        return jsonify({"status": "error", "message": "HOD access required"}), 403

    user = User.query.get(user_id)

    if not user:
        return jsonify({"status": "error", "message": "User not found"}), 404

    if user.role == "HOD":
        return (
            jsonify({"status": "error", "message": "HOD accounts cannot be rejected"}),
            400,
        )

    user.is_approved = False
    user.is_active = False

    db.session.commit()

    return jsonify(
        {
            "status": "success",
            "message": "User rejected successfully",
            "user_id": user.user_id,
        }
    )


# =========================================================
# GET CURRENT USER
# =========================================================


@auth_bp.route("/api/auth/me", methods=["GET"])
@jwt_required()
def current_user():
    from flask_jwt_extended import get_jwt_identity

    user_id = get_jwt_identity()

    user = User.query.get(int(user_id))

    if not user:
        return jsonify({"status": "error", "message": "User not found"}), 404

    return jsonify(
        {
            "status": "success",
            "user": {
                "user_id": user.user_id,
                "username": user.username,
                "email": user.email,
                "role": user.role,
                "is_approved": user.is_approved,
                "is_active": user.is_active,
                "faculty_id": user.faculty_id,
                "student_id": user.student_id,
            },
        }
    )
