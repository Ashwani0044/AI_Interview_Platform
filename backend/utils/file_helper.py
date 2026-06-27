import uuid

ALLOWED_EXTENSIONS = {'pdf'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def generate_unique_filename(filename):
    ext = filename.rsplit('.', 1)[1].lower()
    unique_filename = f"{uuid.uuid4()}.{ext}"
    return unique_filename