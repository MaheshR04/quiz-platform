import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Register from "./pages/Register";
import QuizList from "./pages/QuizList";
import QuizPage from "./pages/QuizPage";
import Leaderboard from "./pages/Leaderboard";
import Result from "./pages/Result";
import HistoryPage from "./pages/HistoryPage";
import AdminCreateQuiz from "./pages/AdminCreateQuiz";
import EditQuiz from "./pages/EditQuiz"; // ✅ NEW

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Default */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />

        {/* Quiz List */}
        <Route
          path="/quizzes"
          element={
            <ProtectedRoute>
              <QuizList />
            </ProtectedRoute>
          }
        />

        {/* Quiz */}
        <Route
          path="/quiz/:id"
          element={
            <ProtectedRoute>
              <QuizPage />
            </ProtectedRoute>
          }
        />

        {/* Result */}
        <Route
          path="/result"
          element={
            <ProtectedRoute>
              <Result />
            </ProtectedRoute>
          }
        />

        {/* Leaderboard */}
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          }
        />

        {/* History */}
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Create Quiz */}
        <Route
          path="/admin/create-quiz"
          element={
            <ProtectedRoute>
              <AdminCreateQuiz />
            </ProtectedRoute>
          }
        />

        {/* ✅ NEW: Edit Quiz Route */}
        <Route
          path="/admin/edit-quiz/:id"
          element={
            <ProtectedRoute>
              <EditQuiz />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;