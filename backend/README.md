#  🏠⭐ Rental Portal Project
🏠 About Project

## This is a Full Stack Rental Portal Application built using:

*Frontend*

✅ Angular
✅ HTML
✅ CSS
✅ TypeScript

*Backend*

✅ Flask
✅ SQLAlchemy
✅ Flask-JWT-Extended
✅ PostgreSQL

# Features include:

User Authentication
Role Based Access (User & Admin)
Flat Listing
Booking System
Booking Confirmation
PDF Receipt Download
Admin Dashboard
Booking Approval Management

# ⭐ Project Setup Guide
📁 Project Structure
Rental-Portal/
 ├── frontend/
 │    └── user-app/
 └── backend/

 🚀 Backend Setup
# Step 1 — Go to backend folder
cd Rental-Portal/backend

# Step 2 — Create Virtual Environment (Optional but Recommended)
python -m venv venv

Activate:
Windows
venv\Scripts\activate
Linux / Mac
source venv/bin/activate

# Step 3 — Install Dependencies
pip install -r requirements.txt

# Step 4 — Run Backend Server
flask run

Backend will run at:
http://localhost:5000

🚀 Frontend Setup
# Step 1 — Go to frontend folder
cd Rental-Portal/frontend/user-app

# Step 2 — Install Dependencies
npm install

# Step 3 — Run Angular Server
ng serve

Frontend will run at:
http://localhost:4200

*****"🔐 Login Details (For Testing)
*Admin Login*
Email: admin@gmail.com
Password: admin123456"*****

User Login
Email: -----
Password: ---- (Register as new User)


⭐ How To Use Application
*User Flow*
Login →
Browse Flats →
Select Flat →
Confirm Booking →
Download Receipt PDF →
View My Bookings

*Admin Flow*
Login as Admin →
Open Admin Dashboard →
Manage Flats →
Approve / Reject Bookings →
View All Bookings

# ⭐ Environment Configuration
Frontend

Edit:
frontend/user-app/src/environments/environment.ts

Set:
apiUrl: "http://localhost:5000"
Backend

Edit:
backend/config.py

Set:
DATABASE_URL
JWT_SECRET_KEY


# ⭐ Future Improvements

✅ Real-time notifications
✅ Payment gateway integration
✅ Chat support
✅ Email notifications

# ⭐ How To Contribute

Fork repository
Create feature branch
Commit changes
Create pull request

# ⭐ License
This project is for educational and portfolio purposes.
