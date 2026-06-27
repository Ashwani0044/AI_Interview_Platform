import os
from urllib.parse import quote_plus
from dotenv import load_dotenv

load_dotenv()

password = quote_plus(os.getenv("DB_PASSWORD"))

class Config:
    SQLALCHEMY_DATABASE_URI = (
        f"mysql+pymysql://{os.getenv('DB_USER')}:{password}@"
        f"{os.getenv('DB_HOST')}/{os.getenv('DB_NAME')}"
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

    BASE_DIR = os.path.abspath(os.path.dirname(__file__))

    UPLOAD_FOLDER = os.path.join(
        BASE_DIR,
        "uploads",
        "resumes"
    )

    MAX_CONTENT_LENGTH = 5 * 1024 * 1024