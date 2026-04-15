import React, { useEffect, useState } from "react";
import { getPastEvents, getPastEventDetails } from "../../api/adminApi";
import {
  History,
  FileText,
  CheckCircle,
  XCircle,
  Loader2,
  Search,
  Calendar,
  Users,
  Mail,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

const PastEvents = () => {
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [eventSearch, setEventSearch] = useState("");
  const [attendeeSearch, setAttendeeSearch] = useState("");

  useEffect(() => {
    fetchArchivedEvents();
  }, []);

  const fetchArchivedEvents = async () => {
    try {
      setLoading(true);
      const res = await getPastEvents();
      setPastEvents(res.data);
    } catch (error) {
      toast.error("Failed to load event archives");
    } finally {
      setLoading(false);
    }
  };

  const viewDetailedReport = async (archiveId) => {
    try {
      const res = await getPastEventDetails(archiveId);
      setSelectedReport(res.data);
      setAttendeeSearch(""); // Reset attendee search when opening new report
    } catch (error) {
      toast.error("Could not load report details");
    }
  };

  // Filter Logic
  const filteredEvents = pastEvents.filter((item) =>
    item.event?.title.toLowerCase().includes(eventSearch.toLowerCase()),
  );

  const filteredAttendees = selectedReport?.registrations?.filter(
    (reg) =>
      reg.user?.name.toLowerCase().includes(attendeeSearch.toLowerCase()) ||
      reg.user?.email.toLowerCase().includes(attendeeSearch.toLowerCase()),
  );

  if (loading)
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500 w-10 h-10" />
      </div>
    );

  return (
    <div className="text-white max-w-6xl mx-auto px-4 py-6">
      {/* Header & Main Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-400">
            <History /> Event History & Archives
          </h1>
          <p className="text-slate-500 text-sm">
            Review past event performance and attendance
          </p>
        </div>

        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Search past events..."
            className="bg-slate-900 border border-white/10 rounded-lg py-2 pl-10 pr-4 w-full md:w-64 focus:outline-none focus:border-blue-500 transition-colors"
            onChange={(e) => setEventSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((item) => (
            <div
              key={item._id}
              className="bg-slate-900/50 border border-white/5 rounded-2xl p-5 backdrop-blur-sm flex flex-col md:flex-row justify-between items-center hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-5 w-full md:w-auto">
                <div className="bg-slate-800 p-3 rounded-xl text-slate-500 hidden sm:block">
                  <Calendar size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-200">
                    {item.event?.title}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    {new Date(item.event?.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>

                  {/* Stats Badges */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/10 px-2 py-1 rounded-md">
                      Total: {item.stats?.totalRegistered || 0}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/10 px-2 py-1 rounded-md">
                      Present: {item.stats?.totalArrived || 0}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/10 px-2 py-1 rounded-md">
                      Absent: {item.stats?.totalAbsent || 0}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => viewDetailedReport(item._id)}
                className="mt-4 md:mt-0 w-full md:w-auto flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
              >
                <FileText size={16} /> View Report
              </button>
            </div>
          ))
        ) : (
          <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-20 text-center italic text-slate-500">
            No archived events found matching your search.
          </div>
        )}
      </div>

      {/* Detailed Report Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-200">
                  {selectedReport.event?.title}
                </h2>
                <p className="text-xs text-slate-500">Full Attendance Record</p>
              </div>

              <div className="relative w-full sm:w-48">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                  size={14}
                />
                <input
                  type="text"
                  placeholder="Search student..."
                  className="bg-slate-800/50 border border-white/5 rounded-lg py-1.5 pl-9 pr-3 w-full text-xs focus:outline-none focus:border-blue-500"
                  value={attendeeSearch}
                  onChange={(e) => setAttendeeSearch(e.target.value)}
                />
              </div>

              <button
                onClick={() => setSelectedReport(null)}
                className="absolute top-4 right-4 sm:static p-2 text-slate-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content - Table */}
            <div className="p-0 overflow-y-auto">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-slate-500 text-[10px] uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4 font-medium">Student Info</th>
                    <th className="px-6 py-4 font-medium text-center">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredAttendees.length > 0 ? (
                    filteredAttendees.map((reg) => (
                      <tr
                        key={reg._id}
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-300">
                              {reg.user?.name}
                            </span>
                            <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                              <Mail size={10} /> {reg.user?.email}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center">
                            {reg.attendanceStatus === "Arrived" ? (
                              <div className="flex items-center gap-1 text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase border border-emerald-500/20">
                                <CheckCircle size={12} /> Present
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-red-400 bg-red-400/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase border border-red-400/20">
                                <XCircle size={12} /> Absent
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="2"
                        className="px-6 py-12 text-center text-slate-600 italic"
                      >
                        No student records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/5 bg-white/5 flex justify-between items-center">
              <p className="text-[10px] text-slate-500 px-2 italic">
                Archived on{" "}
                {new Date(selectedReport.createdAt).toLocaleDateString()}
              </p>
              <button
                onClick={() => setSelectedReport(null)}
                className="bg-slate-800 hover:bg-slate-700 px-6 py-2 rounded-xl text-xs font-bold text-slate-200 transition-colors"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PastEvents;
