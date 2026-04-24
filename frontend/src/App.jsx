import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { getToken } from "./utils/auth";

import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Register from "./pages/Register";
import QuizList from "./pages/QuizList";
import AvailableQuizzes from "./pages/AvailableQuizzes";
import QuizPage from "./pages/QuizPage";
import Result from "./pages/Result";
import Leaderboard from "./pages/Leaderboard";
import HistoryPage from "./pages/HistoryPage";
import Settings from "./pages/Settings";
import ProfileSettings from "./pages/ProfileSettings";
import StudentHelp from "./pages/StudentHelp";
import AdminCreateQuiz from "./pages/AdminCreateQuiz";
import EditQuiz from "./pages/EditQuiz";

function HomeRedirect() {
  return <Navigate to={getToken() ? "/quizzes" : "/login"} replace />;
}

function InAppRoute({ children, allowedRoles }) {
  return (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/dashboard" element={<Navigate to="/quizzes" replace />} />

        <Route
          path="/quizzes"
          element={
            <InAppRoute>
              <QuizList />
            </InAppRoute>
          }
        />

        <Route
          path="/available-quizzes"
          element={
            <InAppRoute allowedRoles={["student", "teacher"]}>
              <AvailableQuizzes />
            </InAppRoute>
          }
        />

        <Route
          path="/leaderboard"
          element={
            <InAppRoute>
              <Leaderboard />
            </InAppRoute>
          }
        />

        <Route
          path="/history"
          element={
            <InAppRoute>
              <HistoryPage />
            </InAppRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <InAppRoute>
              <Settings />
            </InAppRoute>
          }
        />

        <Route
          path="/profile-settings"
          element={
            <InAppRoute>
              <ProfileSettings />
            </InAppRoute>
          }
        />

        <Route
          path="/help"
          element={
            <InAppRoute allowedRoles={["student", "teacher"]}>
              <StudentHelp />
            </InAppRoute>
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
            <InAppRoute>
              <Result />
            </InAppRoute>
          }
        />

        <Route
          path="/admin/create-quiz"
          element={
            <InAppRoute allowedRoles={["admin"]}>
              <AdminCreateQuiz />
            </InAppRoute>
          }
        />

        <Route
          path="/admin/edit-quiz/:id"
          element={
            <InAppRoute allowedRoles={["admin"]}>
              <EditQuiz />
            </InAppRoute>
          }
        />

        <Route path="*" element={<HomeRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
