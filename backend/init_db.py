# backend/init_db.py

from app import create_app, db
from app.models import Flat  # Optional: if you want to add sample flats

app = create_app()

with app.app_context():
    # Create all tables
    db.create_all()
    print("Database tables created successfully!")

    # Optional: Add sample flats
    if not Flat.query.first():
        f1 = Flat(tower="A", number="101", size="2BHK", amenities="Gym, Pool")
        f2 = Flat(tower="B", number="202", size="3BHK", amenities="Parking, Pool")
        db.session.add_all([f1, f2])
        db.session.commit()
        print("Sample flats added!")
