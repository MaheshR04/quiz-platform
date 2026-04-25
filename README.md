 🧠 Quiz App (Full Stack)

A fully functional Quiz Application built with modern web technologies, featuring user authentication, timed quizzes, score tracking, and seamless frontend–backend integration.

🚀 Project Overview

This project is a complete full-stack quiz platform where users can:

Register and log in securely
Attempt quizzes with a timer
Submit answers and get instant results
Track their performance

The application follows a client-server architecture, with a React-based frontend and a Node.js/Express backend connected to a MongoDB database.

🏗️ Architecture
Frontend (React)
       ↓
API Calls (Axios)
       ↓
Backend (Node.js + Express)
       ↓
Database (MongoDB Atlas)
⚙️ Tech Stack
💻 Frontend
React.js
React Router
Axios (API communication)
CSS / Tailwind (if used)
🔧 Backend
Node.js
Express.js
JWT Authentication
🗄️ Database
MongoDB Atlas (Cloud Database)
Mongoose ODM
🔐 Features
👤 Authentication
User registration and login
Secure password handling
JWT-based authentication
📝 Quiz System
Dynamic quiz loading
Multiple-choice questions
Timer-based quiz submission
⏱️ Timer Functionality
Countdown timer for each quiz
Auto-submit when time expires
📊 Results & Scoring
Instant result calculation
Score display after submission
📁 Project Structure
quiz-app/
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/api.js
│   │   └── App.js
│
├── backend/
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   ├── middleware/
│   └── server.js
│
└── README.md
🔌 API Integration

The frontend communicates with the backend using REST APIs:

POST /api/auth/register → Register user
POST /api/auth/login → Login user
GET /api/quiz/:id → Fetch quiz
POST /api/quiz/submit → Submit answers
🧪 How It Works
User logs in or registers
JWT token is generated and stored
User selects a quiz
Questions are fetched from backend
Timer starts
User submits answers
Backend evaluates and returns score
🌐 Deployment
Frontend: (e.g., Vercel / Netlify)
Backend: (e.g., Render / Railway)
Database: MongoDB Atlas
⚠️ Environment Variables

Create a .env file in the backend:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
🛠️ Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/your-username/quiz-app.git
cd quiz-app
2️⃣ Install dependencies

Frontend

cd frontend
npm install
npm start

Backend

cd backend
npm install
npm run dev
