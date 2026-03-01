# backend/app/__init__.py
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
    
    # Config
    app.config.from_object('config.Config')
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:Rakshu%40123@localhost:5432/rental-portal'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv(
        'JWT_SECRET_KEY',
        'rental-portal-super-secure-jwt-secret-key-2026-strong'
    )
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=5)

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    CORS(
    app,
    resources={r"/api/*": {"origins": "http://localhost:4200"}},
    supports_credentials=True
)
    # Import models here
    from .models import User, Flat, Booking, SupportQuery

    # Register blueprints
    from .routes.auth import auth_bp
    from .routes.flats import flats_bp
    from .routes.admin import admin_bp
    from .routes.bookings import bookings_bp  


    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(flats_bp, url_prefix='/api/flats')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(bookings_bp, url_prefix='/api/bookings') 

    return app
