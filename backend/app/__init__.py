import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from datetime import timedelta

db = SQLAlchemy()
jwt = JWTManager()


def create_app():

    app = Flask(__name__)

    # ==========================
    # CONFIG
    # ==========================
    app.config.from_object("config.Config")

    # ==========================
    # JWT CONFIG
    # ==========================
    app.config["JWT_SECRET_KEY"] = os.getenv(
        "JWT_SECRET_KEY",
        "rental-portal-super-secure-jwt-secret-key"
    )

    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=5)

    # ==========================
    # DATABASE CONFIG
    # ==========================
    db_url = os.getenv("DATABASE_URL")

    if not db_url:
        db_url = "postgresql://postgres:Rakshu%40123@localhost:5432/rental-portal"

    # Railway PostgreSQL fix
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)

    app.config["SQLALCHEMY_DATABASE_URI"] = db_url
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # ==========================
    # EXTENSIONS INIT
    # ==========================
    db.init_app(app)
    jwt.init_app(app)

    # ==========================
    # CORS CONFIG ⭐⭐⭐⭐⭐ (MOST IMPORTANT)
    # ==========================
    CORS(app,
        supports_credentials=True,
        resources={
            r"/api/*": {
                "origins": "https://rental-portal-full-production.up.railway.app",
                "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                "allow_headers": ["Content-Type", "Authorization"]
            }
        }
    )

    # ==========================
    # IMPORT ROUTES
    # ==========================
    from .routes.auth import auth_bp
    from .routes.flats import flats_bp
    from .routes.admin import admin_bp
    from .routes.bookings import bookings_bp

    # ==========================
    # REGISTER BLUEPRINTS
    # ==========================
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(flats_bp, url_prefix="/api/flats")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")
    app.register_blueprint(bookings_bp, url_prefix="/api/bookings")

    # ==========================
    # CREATE TABLES (Dev Only)
    # ==========================
    with app.app_context():
        db.create_all()

    return app