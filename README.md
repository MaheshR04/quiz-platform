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
| Database  | (your DB here, e.g. MongoDB/PostgreSQL) |
| Dev Tools | Nodemon, ESLint, Prettier         |

---

## ⚙️ Getting Started

### Prerequisites

- Node.js >= 18.x
- npm >= 9.x

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/quizapp.git
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

| Method | Endpoint                  | Description              | Auth Required |
|--------|---------------------------|--------------------------|---------------|
| POST   | `/api/auth/register`      | Register a new user      | ❌            |
| POST   | `/api/auth/login`         | Login and get token      | ❌            |
| POST   | `/api/auth/forgot-password` | Send reset email       | ❌            |
| POST   | `/api/auth/reset-password`  | Reset user password    | ❌            |
| GET    | `/api/users/profile`      | Get user profile         | ✅            |
| PUT    | `/api/users/profile`      | Update profile settings  | ✅            |
| GET    | `/api/quizzes`            | Get all quizzes          | ✅            |
| POST   | `/api/quizzes`            | Create a new quiz        | ✅            |
| PUT    | `/api/quizzes/:id`        | Edit a quiz              | ✅            |
| DELETE | `/api/quizzes/:id`        | Delete a quiz            | ✅            |

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

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Mahesh Rathod**  
GitHub: [@your-username](https://github.com/your-username)