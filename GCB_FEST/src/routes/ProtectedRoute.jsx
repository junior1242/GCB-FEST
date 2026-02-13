import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ role }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return <Navigate to="/" />;

  if (role && user.role !== role) return <Navigate to="/" />;

  return <Outlet />;
}
