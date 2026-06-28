from extensions import db

class Project(db.Model):
    __tablename__ = "projects"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    title = db.Column(
        db.String(255),
        nullable=False
    )

    description = db.Column(
        db.Text
    )

    role = db.Column(
        db.String(100)
    )

    technologies = db.relationship(
        "ProjectTechnology",
        backref="project",
        lazy=True,
        cascade="all, delete-orphan"
    )