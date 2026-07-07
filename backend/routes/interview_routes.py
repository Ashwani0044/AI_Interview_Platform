from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.interview import Interview
from extensions import db

from services.interview_service import InterviewService

interview_bp = Blueprint(
    "interview",
    __name__,
    url_prefix="/api/interview"
)


@interview_bp.route("/start", methods=["POST"])
@jwt_required()
def start_interview():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is required."
        }), 400

    resume_id = data.get("resume_id")
    role = data.get("role")
    difficulty = data.get("difficulty")

    if not resume_id:
        return jsonify({
            "success": False,
            "message": "resume_id is required."
        }), 400

    if not role:
        return jsonify({
            "success": False,
            "message": "role is required."
        }), 400

    if not difficulty:
        return jsonify({
            "success": False,
            "message": "difficulty is required."
        }), 400

    user_id = get_jwt_identity()

    try:

        result = InterviewService.start_interview(
            user_id=user_id,
            resume_id=resume_id,
            role=role,
            difficulty=difficulty
        )

        return jsonify({

            "success": True,

            "message": "Interview started successfully.",

            "interview": {
                "id": result["interview"].id,
                "role": result["interview"].role,
                "difficulty": result["interview"].difficulty,
                "status": result["interview"].status
            },

            "questions": result["questions"]

        }), 201

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500
    
@interview_bp.route("/submit/<int:interview_id>", methods=["POST"])
@jwt_required()
def submit_interview(interview_id):

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is required."
        }), 400

    answers = data.get("answers")

    if not answers or not isinstance(answers, list):
        return jsonify({
            "success": False,
            "message": "answers must be a non-empty list."
        }), 400

    try:

        InterviewService.save_answers(answers)

        db.session.commit()

        evaluation = InterviewService.evaluate_interview(
            interview_id
        )

        return jsonify({
            "success": True,
            "message": "Interview submitted successfully.",
            "evaluation": evaluation
        }), 200

    except Exception as e:

        db.session.rollback()

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500
    

@interview_bp.route("/<int:interview_id>", methods=["GET"])
@jwt_required()
def get_interview(interview_id):

    try:

        interview = InterviewService.get_interview_details(
            interview_id
        )

        return jsonify({
            "success": True,
            "interview": interview
        }), 200

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 404
    
@interview_bp.route("/history", methods=["GET"])
@jwt_required()
def get_interview_history():

    user_id = get_jwt_identity()

    try:

        history = InterviewService.get_user_interview_history(
            user_id
        )

        return jsonify({
            "success": True,
            "history": history
        }), 200

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500