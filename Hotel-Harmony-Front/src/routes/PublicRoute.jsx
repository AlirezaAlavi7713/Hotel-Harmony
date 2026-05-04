import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // pas connecté => on laisse accéder à /auth
  if (!token) return children;

  // connecté => redirection selon rôle
  if (role === "admin" || role === "employe") {
    return <Navigate to="/staff" replace />;
  }

  return <Navigate to="/dashboard" replace />;
}