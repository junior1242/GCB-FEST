import { useEffect, useState } from "react";
import { getAllRegistrations } from "../../api/reservationApi";
import { Loader2, Users, Calendar, Mail, Search } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getAllRegistrations();
      setRegistrations(data);
    } catch (err) {
      toast.error("Failed to load registration list");
    } finally {
      setLoading(false);
    }
  };

  // Filter registrations based on search input (Student Name or Event Title)
  const filteredData = registrations.filter(
    (reg) =>
      reg.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.event?.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-blue-500" />
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Event Registrations</h1>
          <p className="text-slate-400">
            View and manage all student event sign-ups.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Search student or event..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white focus:border-blue-500 outline-none transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden backdrop-blur-sm shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-slate-400 text-xs uppercase tracking-widest font-bold">
            <tr>
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Event Details</th>
              <th className="px-6 py-4">Reg. Date</th>
              <th className="px-6 py-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-300">
            {filteredData.map((reg) => (
              <tr key={reg._id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center text-white font-bold">
                      {reg.user?.name[0]}
                    </div>
                    <div>
                      <div className="font-bold text-white">
                        {reg.user?.name}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <Mail size={12} /> {reg.user?.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-blue-400">
                    {reg.event?.title}
                  </div>
                  <div className="text-xs flex items-center gap-1 text-slate-500">
                    <Calendar size={12} /> {reg.event?.date}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  {new Date(reg.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded-full border border-emerald-500/20">
                    Confirmed
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredData.length === 0 && (
          <div className="p-10 text-center text-slate-500 italic">
            No registrations found.
          </div>
        )}
      </div>
    </div>
  );
}
