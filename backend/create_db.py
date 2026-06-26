from backend.run import db, app

with app.app_context():
    db.create_all()

print("Tables Created Successfully")