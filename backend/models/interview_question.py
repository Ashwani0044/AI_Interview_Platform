from extensions import db


class InterviewQuestion(db.Model):
    __tablename__ = "interview_questions"

    id = db.Column(db.Integer, primary_key=True)

    interview_id = db.Column(
        db.Integer,
        db.ForeignKey("interviews.id"),
        nullable=False
    )

    question = db.Column(
        db.Text,
        nullable=False
    )

    topic = db.Column(
        db.String(100),
        nullable=False
    )

    difficulty = db.Column(
        db.String(50),
        nullable=False
    )

    question_order = db.Column(
        db.Integer,
        nullable=False
    )

    answers = db.relationship(
        "InterviewAnswer",
        backref="interview_question",
        uselist=False,
        cascade="all, delete-orphan"
    )