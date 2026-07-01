from flask import Blueprint, request, jsonify
from models.user import User
from extensions import db
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

auth_bp = Blueprint(
    "auth",
    __name__,
    url_prefix="/api/auth"
)


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    if not data:
        return jsonify({
            "success": False,
            "message": "Invalid request body"
        }), 400
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({
            "success": False,
            "message": "All fields are required"
        }), 400

    existing_user = User.query.filter_by(email=email).first()

    if existing_user:
         return jsonify({
            "success": False,   
            "message": "Email already exists"
        }), 409

    user = User(name=name, email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "User registered successfully",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
    }), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data:
        return jsonify({
            "success": False,
            "message": "Invalid request body"
        }), 400
    
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({
            "success": False,
            "message": "Email and password are required"
        }), 400
    
    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({
            "success": False,
            "message": "Invalid email or password"
        }), 401
    
    access_token = create_access_token(identity=str(user.id))
    
    return jsonify({
        "success": True,
        "message": "Login successful",
        "access_token": access_token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
    }), 200


@auth_bp.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    user_id = int(get_jwt_identity())

    user = User.query.filter_by(id=str(user_id)).first()

    if not user:
        return jsonify({
            "success": False,
            "message": "User not found"
        }), 404
    
    return jsonify({
        "success": True,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
    }), 200
