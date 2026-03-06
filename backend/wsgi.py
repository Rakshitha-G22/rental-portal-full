import os
from app import create_app

app = create_app()

# Railway + Gunicorn will use this
application = app

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port)