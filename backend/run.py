from flask import Flask
from extensions import db, jwt, migrate
from flask_cors import CORS
from routes.auth import auth_bp
from routes.resume import resume_bp

from config import Config

def create_app():

    app = Flask(__name__)

    app.config.from_object(Config)

    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    CORS(app)
    app.register_blueprint(auth_bp)
    app.register_blueprint(resume_bp)

    @app.route("/")
    def home():
        return {
            "message": "AI Interview Platform Backend Running"
        }
    
    from models.user import User
    from models.resume import Resume
    from models.skill import Skill
    from models.project import Project
    from models.projectTechnology import ProjectTechnology
    from models.education import Education
    from models.experience import Experience

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True)