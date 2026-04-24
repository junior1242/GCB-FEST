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
      const dataArray = res.data?.data || res.data;
      setPastEvents(Array.isArray(dataArray) ? dataArray : []);
    } catch (error) {
      toast.error("Failed to load event archives");
      setPastEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const viewDetailedReport = async (archiveId) => {
    try {
      const res = await getPastEventDetails(archiveId);
      const reportData = res.data?.data || res.data;
      setSelectedReport(reportData);
      setAttendeeSearch("");
    } catch (error) {
      toast.error("Could not load report details");
    }
  };

  // Filter Logic for Main List
  const filteredEvents = Array.isArray(pastEvents)
    ? pastEvents.filter((item) =>
        item.eventSnapshot?.title
          ?.toLowerCase()
          .includes(eventSearch.toLowerCase()),
      )
    : [];

  // Filter Logic for Attendee Modal
  const filteredAttendees = Array.isArray(selectedReport?.registrationsSnapshot)
    ? selectedReport.registrationsSnapshot.filter((reg) => {
        const name = reg.user?.name?.toLowerCase() || "";
        const email = reg.user?.email?.toLowerCase() || "";
        const roll = reg.user?.rollNumber?.toLowerCase() || "";
        const search = attendeeSearch.toLowerCase();

        return (
          name.includes(search) ||
          email.includes(search) ||
          roll.includes(search)
        );
      })
    : [];

  if (loading)
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500 w-10 h-10" />
      </div>
    );

  return (
    <div className="text-white max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-400 italic">
            <History /> Event History & Archives
          </h1>
          <p className="text-slate-500 text-sm">
            Review past event data and attendance logs
          </p>
        </div>
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Search events..."
            className="bg-slate-900 border border-white/10 rounded-xl py-2 px-10 w-full md:w-64 focus:border-blue-500 outline-none text-sm"
            onChange={(e) => setEventSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Cards List */}
      <div className="space-y-4">
        {filteredEvents.map((item) => (
          <div
            key={item._id}
            className="bg-slate-900/40 border border-white/5 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-center hover:bg-white/5 transition-all"
          >
            <div className="flex items-center gap-4 w-full">
              <div className="p-3 bg-slate-800 rounded-xl text-blue-500">
                <Calendar size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">
                  {item.eventSnapshot?.title}
                </h3>
                <p className="text-xs text-slate-500">
                  {item.eventSnapshot?.date}
                </p>
                <div className="flex gap-2 mt-2">
                  <span className="text-[10px] px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-md font-bold">
                    Total: {item.stats?.totalRegistered}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-md font-bold">
                    Attended: {item.stats?.totalArrived}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => viewDetailedReport(item._id)}
              className="mt-4 md:mt-0 bg-white/5 border border-white/10 px-6 py-2 rounded-xl text-xs font-bold hover:bg-white/10 transition-all flex items-center gap-2 text-slate-300"
            >
              <FileText size={14} /> View Report
            </button>
          </div>
        ))}
      </div>

      {/* Detailed Report Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-[100]">
          <div className="bg-slate-900 border border-white/10 rounded-[2rem] w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col relative shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-white uppercase italic tracking-tight">
                  {selectedReport.eventSnapshot?.title}
                </h2>
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">
                  Attendance Archive
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  size={14}
                />
                <input
                  type="text"
                  placeholder="Filter by Name or Roll..."
                  className="bg-slate-800 border border-white/10 rounded-lg py-1.5 pl-9 pr-3 w-full text-xs focus:outline-none focus:border-blue-500 text-white"
                  value={attendeeSearch}
                  onChange={(e) => setAttendeeSearch(e.target.value)}
                />
              </div>

              <button
                onClick={() => setSelectedReport(null)}
                className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Table */}
            <div className="overflow-y-auto flex-1">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-slate-500 text-[10px] uppercase tracking-widest sticky top-0">
                  <tr>
                    <th className="px-8 py-4">Student Identity</th>
                    <th className="px-8 py-4 text-center">Final Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredAttendees.length > 0 ? (
                    filteredAttendees.map((reg, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="px-8 py-4">
                          <div className="flex flex-col">
                            {/* STUDENT NAME */}
                            <span className="font-bold text-sm text-slate-200 uppercase">
                              {reg.user && typeof reg.user === "object"
                                ? reg.user.name
                                : "Member Data Not Found"}
                            </span>
                            {/* ROLL NO & EMAIL */}
                            <div className="flex flex-col gap-0.5 mt-1">
                              <span className="text-[10px] text-blue-400 font-black uppercase tracking-widest">
                                ROLL NO: {reg.user?.rollNumber || "N/A"}
                              </span>
                              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                                <Mail size={10} className="text-slate-600" />{" "}
                                {reg.user?.email || "No email archived"}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          <div className="flex justify-center">
                            {reg.attendanceStatus === "Arrived" ? (
                              <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-4 py-1.5 rounded-full text-[9px] font-black uppercase flex items-center gap-1">
                                <CheckCircle size={12} /> Present
                              </span>
                            ) : (
                              <span className="bg-red-500/10 text-red-400 border border-red-400/20 px-4 py-1.5 rounded-full text-[9px] font-black uppercase flex items-center gap-1">
                                <XCircle size={12} /> Absent
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="2"
                        className="px-8 py-20 text-center text-slate-600 italic"
                      >
                        No matching records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/5 bg-white/[0.02] flex justify-between items-center text-[10px] text-slate-500 uppercase font-bold px-8">
              <span>
                Archived: {new Date(selectedReport.createdAt).toLocaleString()}
              </span>
              <button
                onClick={() => setSelectedReport(null)}
                className="bg-slate-800 hover:bg-slate-700 px-8 py-2 rounded-xl text-white transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PastEvents;
