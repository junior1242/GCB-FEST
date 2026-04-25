import { useEffect, useState } from "react";
import { getAllRegistrations } from "../../api/reservationApi";
import { Loader2, Calendar, Mail, Search } from "lucide-react";
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
      toast.error("Failed to load list");
    } finally {
      setLoading(false);
    }
  };

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
    <div className="w-full max-w-7xl mx-auto px-2">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 text-center md:text-left">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Event Registrations
          </h1>
          <p className="text-slate-400 text-sm">
            Monitor student sign-ups across all events.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Search student or event..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm outline-none focus:border-blue-500 transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm shadow-2xl">
        <div className="overflow-x-auto w-full">
          {/* We set a min-width to force scrolling on mobile instead of squashing */}
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-white/5 text-slate-400 text-[10px] uppercase tracking-widest font-bold">
              <tr>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Event Details</th>
                <th className="px-6 py-4">Reg. Date</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {filteredData.map((reg) => (
                <tr
                  key={reg._id}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs shrink-0 uppercase">
                        {reg.user?.name[0]}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-white text-sm truncate">
                          {reg.user?.name}
                        </div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Mail size={10} /> {reg.user?.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-blue-400 text-sm truncate">
                      {reg.event?.title}
                    </div>
                    <div className="text-[10px] flex items-center gap-1 text-slate-500">
                      <Calendar size={10} /> {reg.event?.date}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs">
                    {new Date(reg.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[9px] font-black rounded-full border border-emerald-500/20 uppercase">
                      {reg.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredData.length === 0 && (
          <div className="p-10 text-center text-slate-500 italic">
            No records found.
          </div>
        )}
      </div>
    </div>
  );
}
