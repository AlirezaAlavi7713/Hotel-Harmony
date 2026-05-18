import { Navigate } from "react-router-dom";

export default function PrivateRouteClient({ children, allowStaff = false }) {
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");

  if (!token) return <Navigate to="/auth" replace />;

  // si staff et que ce n'est PAS autorisé
  if (!allowStaff && (role === "admin" || role === "employe")) {
    return <Navigate to="/staff" replace />;
  }

  return children;
}