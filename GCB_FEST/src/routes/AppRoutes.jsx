import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import StudentDashboard from "../pages/student/StudentDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ProtectedRoute from "./ProtectedRoute";
import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import VerifyEmail from "../pages/auth/VerifyEmail";
import ManageEvents from "../pages/admin/ManageEvents";
import MyBookings from "../pages/student/MyBookings";
import StudentProfile from "../pages/student/StudentProfile";
import AdminStudents from "../pages/admin/AdminStudents";
import AdminRegistrations from "../pages/admin/AdminRegistrations";
import PendingStudents from "../pages/admin/PendingStudents";
import ForgotPassword from "../pages/auth/ForgotPassword";
<<<<<<< HEAD
<<<<<<< Updated upstream
=======
import ResetPassword from "../pages/auth/ResetPassword";
>>>>>>> a8af5790d94358980f6cf7789c274b18afeaff5c

=======
import ResetPassword from "../pages/auth/ResetPassword";
import PreviousEvents from "../pages/student/PreviousEvents";
>>>>>>> Stashed changes

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<AuthLayout />}>
<<<<<<< HEAD
<<<<<<< Updated upstream
  
          <Route path="forgot-password" element={<ForgotPassword />} />
=======
>>>>>>> Stashed changes
=======
          {/* <Route path="forgot-password" element={<ForgotPassword />} /> */}
>>>>>>> a8af5790d94358980f6cf7789c274b18afeaff5c
          <Route index element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="register" element={<Register />} />
          <Route path="verify-email/:token" element={<VerifyEmail />} />
        </Route>

        {/* Student Routes */}
        <Route path="/student" element={<ProtectedRoute role="student" />}>
          <Route element={<MainLayout />}>
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="my-bookings" element={<MyBookings />} />
            <Route path="profile" element={<StudentProfile />} />
<<<<<<< HEAD
<<<<<<< Updated upstream
=======
            <Route path="previous-events" element={<PreviousEvents />} />
>>>>>>> Stashed changes
=======
            {/* <Route path="previous-events" element={<PreviousEvents />} /> */}
>>>>>>> a8af5790d94358980f6cf7789c274b18afeaff5c
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute role="admin" />}>
          <Route element={<MainLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="events" element={<ManageEvents />} />
            <Route path="students" element={<AdminStudents />} />

            {/* 2. ADD THIS ROUTE FOR ADMIN REGISTRATIONS */}
            <Route path="registrations" element={<AdminRegistrations />} />
            <Route path="pending-students" element={<PendingStudents />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
