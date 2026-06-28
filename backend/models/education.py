from extensions import db

class Education(db.Model):
    __tablename__ = "educations"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    degree = db.Column(
        db.String(255),
        nullable=False
    )

    institution = db.Column(
        db.String(255),
        nullable=False
    )

    year = db.Column(
        db.String(20)
    )