from extensions import db
from datetime import datetime

class InterviewAnswer(db.Model):

    __tablename__ = "interview_answers"

    id = db.Column(db.Integer, primary_key=True)

    interview_question_id = db.Column(
        db.Integer,
        db.ForeignKey("interview_questions.id"),
        nullable=False
    )

    answer_text = db.Column(
        db.Text,
        nullable=False
    )

    score = db.Column(
        db.Float,
        default=0.0
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    feedback = db.Column(
        db.Text
    )
