import { useState, useEffect } from "react";
import apiClient from "../../api/apiClient";
import { Users, Mail, Hash, BookOpen, Search, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await apiClient.get("/auth/students");
      // Ensure we are setting an array even if the response is weird
      setStudents(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  // --- FIXED FILTER LOGIC ---
  const filteredStudents = students.filter((student) => {
    // Convert everything to lowercase strings safely
    const name = student.name?.toLowerCase() || "";
    const roll = student.rollNumber?.toString().toLowerCase() || "";
    const dept = student.department?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();

    // Check if the search term exists in Name, Roll Number, or Department
    return name.includes(search) || roll.includes(search) || dept.includes(search);
  });

  return (
    <div className="text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold italic">Student Directory</h1>
          <p className="text-slate-400 text-sm">Managing {students.length} registered students</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text"
            placeholder="Search by name, roll no, or dept..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-slate-400 text-xs uppercase tracking-widest font-bold">
                <th className="p-6">Student Info</th>
                <th className="p-6">Roll No</th>
                <th className="p-6">Academic Details</th>
                <th className="p-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-20 text-center">
                    <Loader2 className="animate-spin mx-auto text-blue-500 mb-2" size={32} />
                    <p className="text-slate-500">Syncing database...</p>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-20 text-center text-slate-500">
                    No results found for "{searchTerm}"
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-600/10 flex items-center justify-center border border-blue-500/20 text-blue-400 font-bold text-lg">
                          {student.name?.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-white group-hover:text-blue-400 transition-colors">
                            {student.name}
                          </div>
                          <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <Mail size={12} /> {student.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <code className="bg-slate-800 px-2 py-1 rounded text-blue-300 text-xs font-mono">
                        #{student.rollNumber}
                      </code>
                    </td>
                    <td className="p-6">
                      <div className="text-sm text-slate-300 font-medium">
                        <BookOpen size={14} className="inline mr-2 text-slate-500" />
                        {student.department}
                      </div>
                      <div className="text-[10px] text-slate-500 uppercase mt-1">
                        Semester {student.semester}
                      </div>
                    </td>
                    <td className="p-6">
                      {student.isVerified ? (
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-500/20 uppercase tracking-tighter">
                          Verified
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-yellow-500/10 text-yellow-400 text-[10px] font-bold rounded-full border border-yellow-500/20 uppercase tracking-tighter">
                          Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}