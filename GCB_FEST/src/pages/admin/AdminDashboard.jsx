import React, { useState, useEffect } from "react";
import { fetchDashboardStats } from "../../api/adminApi.js"; 
import { Users, Calendar, CheckCircle, Clock, Loader2 } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeEvents: 0,
    totalReservations: 0,
    pendingStudents: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStats = async () => {
      try {
        const data = await fetchDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };
    getStats();
  }, []);

  if (loading) return (
    <div className="h-96 flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-500 w-10 h-10" />
    </div>
  );

  return (
    <div className="text-white max-w-7xl mx-auto px-2">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">Admin Dashboard</h1>

      {/* Stats Grid: 1 col on mobile, 2 on tablet, 4 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Students" value={stats.totalStudents} border="border-blue-500" icon={<Users className="text-blue-500" size={20}/>} />
        <StatCard title="Pending Verification" value={stats.pendingStudents} border="border-yellow-500" icon={<Clock className="text-yellow-500" size={20}/>} />
        <StatCard title="Active Events" value={stats.activeEvents} border="border-green-500" icon={<Calendar className="text-green-500" size={20}/>} />
        <StatCard title="Total Reservations" value={stats.totalReservations} border="border-purple-500" icon={<CheckCircle className="text-purple-500" size={20}/>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/50 border border-white/5 p-6 rounded-2xl shadow-xl backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-4 text-blue-400">System Overview</h2>
          <p className="text-slate-400 leading-relaxed">
            The portal is currently serving <span className="text-white font-bold">{stats.totalStudents}</span> students with <span className="text-white font-bold">{stats.activeEvents}</span> active events. All systems are operational.
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, border, icon }) {
  return (
    <div className={`bg-slate-900/50 p-5 rounded-2xl shadow-lg border-l-4 ${border} backdrop-blur-sm flex justify-between items-center`}>
      <div>
        <h3 className="text-slate-500 text-xs uppercase tracking-wider font-bold">{title}</h3>
        <p className="text-3xl font-black mt-1">{value}</p>
      </div>
      <div className="p-3 bg-white/5 rounded-xl">{icon}</div>
    </div>
  );
}