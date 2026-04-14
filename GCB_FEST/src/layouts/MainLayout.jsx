import React, { useState, useEffect } from "react";
import { Link, useLocation, Outlet} from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Users,
  LogOut,
  UserCircle,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { jwtDecode } from "jwt-decode";

export default function MainLayout() {
  const location = useLocation();
  // const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const token = localStorage.getItem("token");
  let user = { role: "student" };
  try {
    if (token) {
      user = jwtDecode(token);
    }
  } catch (err) {
    console.error("Invalid token");
  }

  const menuItems =
    user.role === "admin"
      ? [
          {
            name: "Admin Panel",
            path: "/admin/dashboard",
            icon: LayoutDashboard,
          },
          { name: "Manage Events", path: "/admin/events", icon: Calendar },
          { name: "Students List", path: "/admin/students", icon: Users },
          { name: "Registrations", path: "/admin/registrations", icon: Users },
          {
            name: "Pending Verifications",
            path: "/admin/pending-students",
            icon: Users,
          },
        ]
      : [
          {
            name: "Events Feed",
            path: "/student/dashboard",
            icon: LayoutDashboard,
          },
          {
            name: "My Registrations",
            path: "/student/my-bookings",
            icon: Calendar,
          },
        { name: "My Profile", path: "/student/profile", icon: UserCircle },
          {name:"Previous Events", path:"/student/previous-events", icon: Calendar}
        ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.replace("/");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex overflow-x-hidden">
      {/* 1. MOBILE OVERLAY (Darkens screen when menu is open) */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[50] md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* 2. SIDEBAR */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-[60] w-64 bg-slate-900 border-r border-white/5 p-6 flex flex-col transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0
      `}
      >
        {/* Logo Section */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              CampusEvents
            </h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 font-bold">
              {user.role} Portal
            </p>
          </div>
          {/* Close button for mobile only */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden text-slate-400"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
                location.pathname === item.path
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} />
                <span className="font-medium text-sm">{item.name}</span>
              </div>
              {location.pathname === item.path && <ChevronRight size={14} />}
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all mt-auto"
        >
          <LogOut size={18} />
          <span className="font-medium text-sm">Log Out</span>
        </button>
      </aside>

      {/* 3. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-64 transition-all duration-300">
        {/* RESPONSIVE HEADER */}
        <header className="h-16 border-b border-white/5 bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-slate-400 hover:bg-white/5 rounded-lg md:hidden"
          >
            <Menu size={24} />
          </button>

          {/* Spacer for mobile to keep profile on right */}
          <div className="md:hidden" />

          {/* User Section */}
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-xs text-slate-400 uppercase tracking-wide italic">
              Welcome back,{" "}
              <span className="text-slate-200 font-medium">{user.role}</span>
            </span>
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-600 to-emerald-500 border border-white/10 shadow-inner p-[2px]">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-[10px] font-bold">
                {user.role?.[0].toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto w-full transition-all">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
