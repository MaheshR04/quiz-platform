 # 🧠 QuizApp

A full-stack quiz platform built with React (Vite) on the frontend and Node.js/Express on the backend, featuring user authentication, quiz creation, editing, and management.

---

## 📁 Project Structure

```
quizapp/
├── backend/
│   ├── config/           # Database and app configuration
│   ├── controllers/      # Route handler logic
│   ├── middleware/       # Auth and custom middleware
│   ├── models/           # Database models/schemas
│   ├── routes/           # API route definitions
│   ├── .env              # Environment variables (not committed)
│   ├── .env.example      # Environment variable template
│   ├── nodemon.json      # Nodemon config for dev server
│   ├── server.js         # Express app entry point
│   └── package.json
│
└── frontend/
    ├── public/           # Static assets
    ├── src/              # React source code
    │   ├── components/   # Reusable UI components
    │   └── pages/        # Page-level components
    ├── dist/             # Production build output
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── package.json
```

---

## 🚀 Features

- ✅ User Registration & Login
- 🔐 Forgot Password / Reset Password
- 👤 Profile Settings
- ➕ Create, Edit & Delete Quizzes
- 📝 Support for 5 Question Types:
  - Multiple Choice (Radio buttons)
  - Multiple Select (Checkboxes)
  - True / False
  - Fill in the Blank (Text input)
  - Dropdown (Select menu)
- 🏆 Real-time Leaderboards
- 📈 User Quiz History
- 🛡️ Protected Routes (auth-guarded pages)
- 📱 Responsive UI with Tailwind CSS
- ⚡ Fast development with Vite + React

---

## 🛠️ Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React, Vite, Tailwind CSS         |
| Backend   | Node.js, Express.js               |
| Auth      | JWT (JSON Web Tokens)             |
| Database  | MongoDB (Mongoose)                |
| Dev Tools | Nodemon, ESLint, Prettier         |

---

## ⚙️ Getting Started

### Prerequisites

- Node.js >= 18.x
- npm >= 9.x

---

### 1. Clone the Repository

```bash
git clone https://github.com/MaheshR04/quiz-platform.git
cd quizapp
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Fill in the required values in `.env`:

```env
PORT=5000
MONGO_URI=your_database_connection_string
JWT_SECRET=your_jwt_secret_key
```

Start the backend server:

```bash
npm run dev       # Development (nodemon)
npm start         # Production
```

The backend runs on **http://localhost:5000**

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on **http://localhost:5173**

---

## 🔑 Environment Variables

| Variable     | Description                        |
|--------------|------------------------------------|
| `PORT`       | Port for the Express server        |
| `MONGO_URI`  | Database connection string         |
| `JWT_SECRET` | Secret key used to sign JWT tokens |

> ⚠️ Never commit your `.env` file. It is listed in `.gitignore`.

---

## 📡 API Endpoints

### Auth
| Method | Endpoint                  | Description              | Auth Required |
|--------|---------------------------|--------------------------|---------------|
| POST   | `/api/auth/register`      | Register a new user      | ❌            |
| POST   | `/api/auth/login`         | Login and get token      | ❌            |
| POST   | `/api/auth/forgot-password` | Send reset email       | ❌            |
| POST   | `/api/auth/reset-password`  | Reset user password    | ❌            |

### Quizzes
| Method | Endpoint                  | Description              | Auth Required | Admin Only |
|--------|---------------------------|--------------------------|---------------|------------|
| GET    | `/api/quiz`               | Get all quizzes          | ✅            | ❌          |
| GET    | `/api/quiz/:id`           | Get single quiz          | ✅            | ❌          |
| POST   | `/api/quiz/create`        | Create a new quiz        | ✅            | ✅          |
| PUT    | `/api/quiz/:id`           | Edit a quiz              | ✅            | ✅          |
| DELETE | `/api/quiz/:id`           | Delete a quiz            | ✅            | ✅          |
| POST   | `/api/quiz/start/:id`     | Start a quiz             | ✅            | ❌          |
| POST   | `/api/quiz/submit`        | Submit quiz answers      | ✅            | ❌          |
| GET    | `/api/quiz/leaderboard/:id`| Get quiz leaderboard    | ✅            | ✅          |
| GET    | `/api/quiz/history`       | Get quiz history (All for admin, self for students) | ✅            | ❌          |






---

## 📦 Scripts

### Backend

| Command         | Description                      |
|-----------------|----------------------------------|
| `npm start`     | Start production server          |
| `npm run dev`   | Start dev server with nodemon    |

### Frontend

| Command           | Description                   |
|-------------------|-------------------------------|
| `npm run dev`     | Start Vite dev server         |
| `npm run build`   | Build for production          |
| `npm run preview` | Preview production build      |
| `npm run lint`    | Lint the codebase             |

---

## 🤝 Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

 