import { Navigate } from "react-router-dom";
import { getCurrentUser, getToken } from "../utils/auth";

function ProtectedRoute({ children, allowedRoles }) {
  const token = getToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    const user = getCurrentUser();
    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/quizzes" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;
