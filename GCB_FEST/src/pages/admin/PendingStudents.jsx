import React, { useState, useEffect } from "react";
import {
  fetchUnverifiedStudents,
<<<<<<< Updated upstream
  verifyStudentAccount,
=======
  processStudentStatus,
>>>>>>> Stashed changes
} from "../../api/adminApi.js";
import {
  Loader2,
  UserCheck,
  Mail,
  Calendar,
  Search,
  ShieldAlert,
} from "lucide-react";
import toast from "react-hot-toast"; // Optional: for notifications

export default function PendingStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const loadStudents = async () => {
    try {
      const data = await fetchUnverifiedStudents();
      setStudents(data);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleVerify = async (id) => {
    try {
      await verifyStudentAccount(id);
      setStudents(students.filter((s) => s._id !== id));
      toast.success("Student verified!");
    } catch (error) {
      toast.error("Verification failed");
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()),
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
            Review and approve student registrations
          </p>
        </div>

        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="bg-slate-900 border border-white/10 rounded-lg py-2 pl-10 pr-4 w-full md:w-64 focus:outline-none focus:border-blue-500 transition-colors"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-slate-400 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-medium">Student Info</th>
              <th className="px-6 py-4 font-medium">Joined Date</th>
              <th className="px-6 py-4 font-medium text-right">Action</th>
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
                  <td className="px-6 py-4 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      {new Date(student.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleVerify(student._id)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all active:scale-95 flex items-center gap-2 ml-auto"
                    >
                      <UserCheck size={14} /> Verify Student
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  className="px-6 py-20 text-center text-slate-500 italic"
                >
                  {searchTerm
                    ? "No students match your search."
                    : "No students are waiting for verification."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
