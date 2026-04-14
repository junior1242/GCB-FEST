import React, { useState, useEffect } from "react";
import {
  fetchUnverifiedStudents,
<<<<<<< HEAD
<<<<<<< Updated upstream
  verifyStudentAccount,
=======
  processStudentStatus,
>>>>>>> Stashed changes
=======
  processStudentStatus, // Updated function name
>>>>>>> a8af5790d94358980f6cf7789c274b18afeaff5c
} from "../../api/adminApi.js";
import {
  Loader2,
  UserCheck,
  UserX, // Added for rejection
  Mail,
  Calendar,
  Search,
  ShieldAlert,
  GraduationCap,
  Hash,
} from "lucide-react";
import toast from "react-hot-toast";

export default function PendingStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const loadStudents = async () => {
    try {
      const data = await fetchUnverifiedStudents();
      setStudents(data);
    } catch (error) {
      toast.error("Could not load pending registrations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleAction = async (id, status) => {
    try {
      const res = await processStudentStatus(id, status);
      setStudents(students.filter((s) => s._id !== id));

      if (status === "active") {
        toast.success("Student approved!");
      } else {
        toast.error("Student rejected and removed");
      }
    } catch (error) {
      toast.error("Action failed");
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading)
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500 w-10 h-10" />
      </div>
    );

  return (
    <div className="text-white max-w-6xl mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-yellow-500">
            <ShieldAlert /> Pending Verifications
          </h1>
          <p className="text-slate-400 text-sm">
            Approve or Reject student registrations
          </p>
        </div>

        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Search..."
            className="bg-slate-900 border border-white/10 rounded-lg py-2 pl-10 pr-4 w-full md:w-64 focus:outline-none focus:border-blue-500 transition-colors"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-slate-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">Student Info</th>
                <th className="px-6 py-4 font-medium">Academic Details</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr
                    key={student._id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-200">
                          {student.name}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <Mail size={12} /> {student.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-blue-400 flex items-center gap-1">
                          <Hash size={12} /> {student.rollNumber}
                        </span>
                        <span className="text-xs text-slate-300 flex items-center gap-1">
                          <GraduationCap size={12} /> {student.department} (
                          {student.semester})
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        {/* REJECT BUTTON */}
                        <button
                          onClick={() => handleAction(student._id, "rejected")}
                          className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                          title="Reject and Delete"
                        >
                          <UserX size={14} /> Reject
                        </button>

                        {/* APPROVE BUTTON */}
                        <button
                          onClick={() => handleAction(student._id, "active")}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                        >
                          <UserCheck size={14} /> Approve
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-20 text-center text-slate-500 italic"
                  >
                    No pending students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
