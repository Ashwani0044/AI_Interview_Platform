from extensions import db

class Experience(db.Model):
    __tablename__ = "experiences"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    company = db.Column(
        db.String(255),
        nullable=False
    )

    role = db.Column(
        db.String(100)
    )

    duration = db.Column(
        db.String(100)
    )

    description = db.Column(
        db.Text
    )