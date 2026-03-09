import { Link, useLocation, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Users,
  LogOut,
  Bell,
  UserCircle,
} from "lucide-react";
import { jwtDecode } from "jwt-decode"; // You might need: npm install jwt-decode

export default function MainLayout() {
  const location = useLocation();

  // Get user info from token
  const token = localStorage.getItem("token");
  let user = { role: "student" }; // Default
  if (token) {
    user = jwtDecode(token); // Decodes the ID and Role from your JWT
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
        ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // cookieStore.removeItem()
    window.location.replace("/");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex">
      {/* Sidebar - Stays fixed on the left */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-slate-900/50 backdrop-blur-2xl border-r border-white/5 p-6 flex flex-col">
        <div className="mb-10">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            CampusEvents
          </h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 font-bold">
            {user.role} Portal
          </p>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                location.pathname === item.path
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon size={18} />
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all mt-auto"
        >
          <LogOut size={18} />
          <span className="font-medium text-sm">Log Out</span>
        </button>
      </aside>

      {/* Content Area - Moves to the right of the sidebar */}
      <main className="flex-1 ml-64 min-h-screen">
        <header className="h-16 border-b border-white/5 bg-slate-950/50 backdrop-blur-md flex items-center justify-end px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-400 italic">Welcome back!</span>
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-emerald-500" />
          </div>
        </header>

        <div className="p-8">
          <Outlet />{" "}
          {/* This is where StudentDashboard or AdminDashboard will render */}
        </div>
      </main>
    </div>
  );
}
