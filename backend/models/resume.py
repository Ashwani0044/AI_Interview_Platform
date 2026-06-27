from extensions import db
from datetime import datetime

class Resume(db.Model):
    __tablename__ = "resumes"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    original_filename = db.Column(
        db.String(255),
        nullable=False
    )

    stored_filename = db.Column(
        db.String(255),
        nullable=False
    )

    file_path = db.Column(
        db.String(255),
        nullable=False
    )

    is_parsed = db.Column(
        db.Boolean,
        default=False   
    )

    uploaded_at = db.Column(
        db.DateTime,    
        default=datetime.utcnow
    )
