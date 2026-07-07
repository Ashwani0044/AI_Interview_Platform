from extensions import db
import datetime

class Interview(db.Model):
    __tablename__ = "interviews"

    id = db.Column(db.Integer, primary_key=True)

    resume_id = db.Column(
        db.Integer,
        db.ForeignKey("resumes.id"),
        nullable=False
    )   

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    role = db.Column(
    db.String(100),
    nullable=False
    )

    difficulty = db.Column(
        db.String(50),
        nullable=False
    )

    status = db.Column(
        db.String(50),
        nullable=False,
        default="pending"
    )
    overall_score = db.Column(
        db.Float,
        default = 0.0
    )

    created_at = db.Column(
        db.DateTime,    
        default=datetime.datetime.utcnow
    )

    questions = db.relationship(
        "InterviewQuestion",
        backref="interview",
        lazy=True,
        cascade="all, delete-orphan"
    )

