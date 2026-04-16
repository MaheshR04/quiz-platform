import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Register from "./pages/Register";
import QuizList from "./pages/QuizList";
import QuizPage from "./pages/QuizPage";
import Leaderboard from "./pages/Leaderboard";
import Result from "./pages/Result";
import HistoryPage from "./pages/HistoryPage";
import AdminCreateQuiz from "./pages/AdminCreateQuiz";
import EditQuiz from "./pages/EditQuiz";
import Settings from "./pages/Settings";
import ProfileSettings from "./pages/ProfileSettings"; // ✅ ADD THIS

import ProtectedRoute from "./components/ProtectedRoute";

function AppWrapper() {
  const location = useLocation();

  // Hide navbar on auth pages
  const hideNavbarRoutes = ["/login", "/register", "/forgot-password"];

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}

      <Routes>

        {/* Default */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />

        {/* Quiz */}
        <Route
          path="/quizzes"
          element={
            <ProtectedRoute>
              <QuizList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/quiz/:id"
          element={
            <ProtectedRoute>
              <QuizPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/result"
          element={
            <ProtectedRoute>
              <Result />
            </ProtectedRoute>
          }
        />

        {/* Features */}
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* ✅ NEW PROFILE SETTINGS ROUTE */}
        <Route
          path="/profile-settings"
          element={
            <ProtectedRoute>
              <ProfileSettings />
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin/create-quiz"
          element={
            <ProtectedRoute>
              <AdminCreateQuiz />
            </ProtectedRoute>
          }
        />

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
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}

export default App;