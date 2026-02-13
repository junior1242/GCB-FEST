import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import StudentDashboard from "../pages/dashboard/StudentDashboard";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import ProtectedRoute from "./ProtectedRoute";
import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<AuthLayout />}>
          <Route index element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Student Routes */}
        <Route path="/student" element={<ProtectedRoute role="student" />}>
          <Route element={<MainLayout />}>
            <Route path="dashboard" element={<StudentDashboard />} />
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute role="admin" />}>
          <Route element={<MainLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
