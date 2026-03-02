from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
import os
from datetime import timedelta

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)

    app.config.from_object('config.Config')

    app.config['JWT_SECRET_KEY'] = os.getenv(
        'JWT_SECRET_KEY',
        'rental-portal-super-secure-jwt-secret-key-2026-strong'
    )

    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=5)

    db_url = os.getenv("DATABASE_URL")

    if not db_url:
    # Local development fallback
        db_url = "postgresql://postgres:Rakshu%40123@localhost:5432/rental-portal"

    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)

    app.config["SQLALCHEMY_DATABASE_URI"] = db_url
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)
    jwt.init_app(app)

    CORS(
        app,
        resources={r"/api/*": {"origins": "*"}},
        supports_credentials=True
    )

    from .models import User, Flat, Booking
    from .routes.auth import auth_bp
    from .routes.flats import flats_bp
    from .routes.admin import admin_bp
    from .routes.bookings import bookings_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(flats_bp, url_prefix='/api/flats')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(bookings_bp, url_prefix='/api/bookings')

    with app.app_context():
        db.create_all()

    return app