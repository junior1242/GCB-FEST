import React, { useState, useEffect } from "react";
import { fetchDashboardStats } from "../../api/adminApi.js";
import {
  getCategories,
  createCategory,
  deleteCategory,
} from "../../api/categoryApi.js";
import {
  Users,
  Calendar,
  CheckCircle,
  Clock,
  Loader2,
  ListOrdered,
  Tag,
  Trash2,
  Plus,
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeEvents: 0,
    totalReservations: 0,
    pendingStudents: 0,
    eventStats: [],
  });
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, catData] = await Promise.all([
        fetchDashboardStats(),
        getCategories(),
      ]);
      setStats(statsData);
      setCategories(catData.data || catData); // Handle both response formats
    } catch (error) {
      console.error("Dashboard error:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // const handleAddCategory = async (e) => {
  //   e.preventDefault();
  //   if (!newCategory.trim()) return;
  //   try {
  //     await createCategory({ name: newCategory });
  //     setNewCategory("");
  //     const catData = await getCategories();
  //     setCategories(catData.data || catData);
  //     toast.success("Category added!");
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || "Add failed");
  //   }
  // };

  

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await deleteCategory(id);
      setCategories(categories.filter((c) => c._id !== id));
      toast.success("Category deleted");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Cannot delete category being used by events",
      );
    }
  };

  if (loading)
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500 w-10 h-10" />
      </div>
    );

  return (
    <div className="text-white max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">
        Admin Dashboard
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          border="border-blue-500"
          icon={<Users className="text-blue-500" size={20} />}
        />
        <StatCard
          title="Pending"
          value={stats.pendingStudents}
          border="border-yellow-500"
          icon={<Clock className="text-yellow-500" size={20} />}
        />
        <StatCard
          title="Active Events"
          value={stats.activeEvents}
          border="border-green-500"
          icon={<Calendar className="text-green-500" size={20} />}
        />
        <StatCard
          title="Reservations"
          value={stats.totalReservations}
          border="border-purple-500"
          icon={<CheckCircle className="text-purple-500" size={20} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: Reservation Details Table */}
        <div className="lg:col-span-2 bg-slate-900/50 border border-white/5 p-6 rounded-2xl shadow-xl backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-blue-400 flex items-center gap-2">
              <ListOrdered size={20} /> Reservation Details
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 text-sm uppercase tracking-wider">
                  <th className="py-3 px-2 font-medium">Event Name</th>
                  <th className="py-3 px-2 font-medium text-center">
                    Bookings
                  </th>
                  <th className="py-3 px-2 font-medium text-center">
                    Capacity
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.eventStats?.length > 0 ? (
                  stats.eventStats.map((event) => (
                    <tr
                      key={event._id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                    >
                      <td className="py-4 px-2">
                        <p className="font-semibold text-slate-200">
                          {event.title}
                        </p>
                        <p className="text-sm text-slate-400">
                          {new Date(event.date).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="py-4 px-2 text-center">
                        <span className="bg-blue-500/20 text-blue-400 font-bold px-3 py-1 rounded-full text-xs">
                          {event.reservationsCount}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-center">
                        <span className="bg-slate-700/50 text-slate-300 font-bold px-3 py-1 rounded-full text-xs">
                          {event.maxSeats}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="py-10 text-center text-slate-500"
                    >
                      No event data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT COLUMN: Category Management */}
        <div className="bg-slate-900/50 border border-white/5 p-6 rounded-2xl shadow-xl backdrop-blur-sm h-fit">
          <h2 className="text-xl font-semibold mb-4 text-emerald-400 flex items-center gap-2">
            <Tag size={20} /> Categories
          </h2>

          {/* Inline Add Category Form */}
          {/* <form onSubmit={handleAddCategory} className="flex gap-2 mb-6">
            <input
              type="text"
              placeholder="Add new..."
              className="bg-slate-800 border border-white/10 rounded-lg py-2 px-3 text-sm w-full focus:outline-none focus:border-emerald-500 transition-colors"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 p-2 rounded-lg transition-all"
            >
              <Plus size={18} />
            </button>
          </form> */}

          {/* Category List */}
          <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            {categories.length > 0 ? (
              categories.map((cat) => (
                <div
                  key={cat._id}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 group hover:border-white/10 transition-all"
                >
                  <span className="text-slate-200 text-sm font-medium">
                    {cat.name}
                  </span>
                  <button
                    onClick={() => handleDeleteCategory(cat._id)}
                    className="text-slate-500 hover:text-red-500 opacity-0 cursor-pointer group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-sm italic text-center py-4">
                No categories created
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, border, icon }) {
  return (
    <div
      className={`bg-slate-900/50 p-5 rounded-2xl shadow-lg border-l-4 ${border} backdrop-blur-sm flex justify-between items-center transition-transform hover:scale-[1.02]`}
    >
      <div>
        <h3 className="text-slate-500 text-xs uppercase tracking-wider font-bold">
          {title}
        </h3>
        <p className="text-3xl font-black mt-1">{value}</p>
      </div>
      <div className="p-3 bg-white/5 rounded-xl">{icon}</div>
    </div>
  );
}
