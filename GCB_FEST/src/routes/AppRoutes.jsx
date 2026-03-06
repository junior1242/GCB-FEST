import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import StudentDashboard from "../pages/dashboard/StudentDashboard";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import ProtectedRoute from "./ProtectedRoute";
import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import VerifyEmail from "../pages/auth/VerifyEmail";
import ManageEvents from "../pages/admin/ManageEvents";
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<AuthLayout />}>
          <Route index element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="verify-email/:token" element={<VerifyEmail />} />
        </Route>

        {/* Student Routes */}
        <Route path="/student" element={<ProtectedRoute role="student" />}>
          <Route element={<MainLayout />}>
            <Route path="dashboard" element={<StudentDashboard />} />
            {/* Add these later */}
            <Route path="profile" element={<div>Profile Page</div>} />
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute role="admin" />}>
          <Route element={<MainLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            {/* IMPORTANT: Add this for the Admin Manage Events Page */}
            <Route path="events" element={<ManageEvents />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
