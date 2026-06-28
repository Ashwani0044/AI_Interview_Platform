from extensions import db

class ProjectTechnology(db.Model):
    __tablename__ = "project_technologies"

    id = db.Column(db.Integer, primary_key=True)

    project_id = db.Column(
        db.Integer,
        db.ForeignKey("projects.id"),
        nullable=False
    )

    technology = db.Column(
        db.String(100),
        nullable=False
    )