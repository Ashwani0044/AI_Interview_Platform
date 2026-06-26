from flask import Flask
from extensions import db, jwt
from flask_cors import CORS
from routes.auth import auth_bp

from config import Config

def create_app():

    app = Flask(__name__)

    app.config.from_object(Config)

    db.init_app(app)
    jwt.init_app(app)

    CORS(app)
    app.register_blueprint(auth_bp)

    @app.route("/")
    def home():
        return {
            "message": "AI Interview Platform Backend Running"
        }
    
    from models.user import User

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True)