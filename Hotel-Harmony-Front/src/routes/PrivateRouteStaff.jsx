import { Navigate } from "react-router-dom";

export default function PrivateRouteStaff({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/auth" replace />;

  if (role !== "admin" && role !== "employe") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}