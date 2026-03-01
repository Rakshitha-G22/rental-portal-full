class Config:
    SQLALCHEMY_DATABASE_URI = (
        'postgresql://postgres:Rakshu%40123@localhost:5432/rental-portal'
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = 'super-secret'
