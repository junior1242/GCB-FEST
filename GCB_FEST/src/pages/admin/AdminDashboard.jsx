import React, { useState, useEffect } from "react";
import { fetchDashboardStats } from "../../api/adminApi.js"; // Adjust path to your adminApi.js

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
        console.log(data)
        setStats(data);
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    getStats();
  }, []);

  if (loading)
    return (
      <div className="p-6 text-white text-center">Loading Dashboard...</div>
    );

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          border="border-blue-500"
        />
        <StatCard
          title="Pending Verification"
          value={stats.pendingStudents}
          border="border-yellow-500"
        />
        <StatCard
          title="Active Events"
          value={stats.activeEvents}
          border="border-green-500"
        />
        <StatCard
          title="Total Reservations"
          value={stats.totalReservations}
          border="border-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Overview</h2>
          <p className="text-slate-400">
            Currently managing {stats.totalStudents} students and{" "}
            {stats.activeEvents} upcoming events.
          </p>
        </div>

        {/* <div className="bg-slate-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <ul className="list-disc list-inside text-slate-400 space-y-2">
            <li className="hover:text-white cursor-pointer transition-colors">
              Generate Reports
            </li>
            <li className="hover:text-white cursor-pointer transition-colors">
              Audit Logs
            </li>
          </ul>
        </div> */}
      </div>
    </div>
  );
}

// Reusable UI Component
function StatCard({ title, value, border }) {
  return (
    <div className={`bg-slate-800 p-4 rounded-lg shadow border-l-4 ${border}`}>
      <h3 className="text-slate-400 text-sm font-semibold">{title}</h3>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
