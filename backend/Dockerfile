# Use Python 3.14 base image
FROM python:3.14-slim

# Set working directory
WORKDIR /app

# Copy requirements
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY . .

# Cloud Run requires port 8080
ENV PORT=8080

# Run using Gunicorn (production server)
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "wsgi:app"]