from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import os
from flask import current_app
from utils.file_helper import allowed_file, generate_unique_filename
from models.resume import Resume
from extensions import db
from services.resume_services import ResumeParserService

resume_bp = Blueprint(
    "resume",
    __name__,
    url_prefix="/api/resume"
)

@resume_bp.route("/upload", methods=["POST"])
@jwt_required()
def upload_resume():
    
    file = request.files.get("file")

    if not file:
        return jsonify({"error": "No file provided"}), 400
    
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400
    
    if not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type. Only PDF files are allowed."}), 400
    
    unique_filename = generate_unique_filename(file.filename)

    # filepath = f"uploads/resumes/{unique_filename}"

    filepath = os.path.join(
        current_app.config["UPLOAD_FOLDER"], unique_filename
    )
    try:
        file.save(filepath)

        user_id = int(get_jwt_identity())
        resume = Resume(user_id=user_id, original_filename=file.filename, stored_filename=unique_filename, file_path=filepath)
        db.session.add(resume)
        db.session.commit()
        ResumeParserService.process_resume(
            user_id=user_id,
            resume_id=resume.id,
            filepath=filepath
        )
    except Exception as e:
        db.session.rollback()

        if os.path.exists(filepath):
            os.remove(filepath)

        return jsonify({"success": False, "error": "Failed to upload resume", "message": str(e)}), 500

    return jsonify({"success": True,
                    "message": "Resume uploaded successfully", 
                    "resume": {
                        "id": resume.id,
                        "original_filename": resume.original_filename,
                        "stored_filename": resume.stored_filename,
                        "file_path": resume.file_path
                    }}), 201