from extensions import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(100), nullable=False)

    email = db.Column(
        db.String(120),
        unique=True,
        nullable=False
    )

    password = db.Column(
        db.String(255),
        nullable=False
    )

    role = db.Column(
        db.String(20),
        default="candidate"
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    resumes = db.relationship(
        "Resume",
        backref="user",
        lazy=True,
        cascade="all, delete-orphan"
    )

    skills = db.relationship(
        "Skill",
        backref="user",
        lazy=True,
        cascade="all, delete-orphan"
    )

    projects = db.relationship(
        "Project",
        backref="user",
        lazy=True,
        cascade="all, delete-orphan"
    )

    educations = db.relationship(
        "Education",
        backref="user",
        lazy=True,
        cascade="all, delete-orphan"
    )

    experiences = db.relationship(
        "Experience",
        backref="user",
        lazy=True,
        cascade="all, delete-orphan"
    )
    
    interviews = db.relationship(
        "Interview",
        backref="user",
        lazy=True,
        cascade="all, delete-orphan"
    )

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password) 