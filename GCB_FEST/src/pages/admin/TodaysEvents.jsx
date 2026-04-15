import React, { useEffect, useState } from "react";
import {
  getTodaysEvents,
  getEventStudents,
  updateAttendance,
} from "../../api/adminApi";
import {
  CheckCircle,
  XCircle,
  Users,
  Calendar,
  MapPin,
  Loader2,
  ChevronRight,
  UserCheck,
  UserX,
  Mail,
  Search, // Added Search icon
} from "lucide-react";
import toast from "react-hot-toast";

const TodaysEvents = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [attendeeSearch, setAttendeeSearch] = useState(""); // State for attendee search

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await getTodaysEvents();
      setEvents(res.data);
    } catch (err) {
      toast.error("Failed to load today's events");
    } finally {
      setLoading(false);
    }
  };

  const openAttendance = async (event) => {
    setSelectedEvent(event);
    setAttendeeSearch(""); // Reset search when changing events
    try {
      const res = await getEventStudents(event._id);
      setStudents(res.data);
    } catch (err) {
      toast.error("Error loading student list");
    }
  };

  const handleMark = async (regId, status) => {
    try {
      await updateAttendance(regId, status);
      setStudents((prev) =>
        prev.map((s) =>
          s._id === regId ? { ...s, attendanceStatus: status } : s,
        ),
      );

      if (status === "Arrived") toast.success("Marked as Present");
      else toast.error("Marked as Absent");
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  // Filter Logic for Attendees
  const filteredAttendees = students.filter(
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-blue-500">
          <Calendar /> Today's Scheduled Events
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Select an event to manage real-time attendance
        </p>
      </div>

      {/* Events Grid */}
      {events.length === 0 ? (
        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-12 text-center italic text-slate-500">
          No events found for today.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {events.map((event) => (
            <div
              key={event._id}
              onClick={() => openAttendance(event)}
              className={`cursor-pointer p-5 rounded-2xl border transition-all duration-300 ${
                selectedEvent?._id === event._id
                  ? "bg-blue-600/20 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                  : "bg-slate-900/50 border-white/5 hover:border-white/20"
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="bg-blue-500/10 p-2 rounded-lg text-blue-400">
                  <Users size={20} />
                </div>
                <ChevronRight
                  size={18}
                  className={
                    selectedEvent?._id === event._id
                      ? "text-blue-400 rotate-90 transition-transform"
                      : "text-slate-600"
                  }
                />
              </div>
              <h3 className="font-bold text-slate-200 truncate">
                {event.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
                <MapPin size={14} /> {event.location}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Attendance Table Section */}
      {selectedEvent && (
        <div className="bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Table Header with Search */}
          <div className="bg-white/5 px-6 py-4 flex flex-col md:flex-row justify-between items-center border-b border-white/5 gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-200">
                {selectedEvent.title}
              </h2>
              <p className="text-xs text-slate-500">
                Total Registered: {students.length}
              </p>
            </div>

            {/* Search Input - Same style as your PendingStudents.jsx */}
            <div className="relative w-full md:w-64">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                size={16}
              />
              <input
                type="text"
                placeholder="Search attendee..."
                className="bg-slate-900 border border-white/10 rounded-lg py-2 pl-10 pr-4 w-full text-sm focus:outline-none focus:border-blue-500 transition-colors text-slate-200"
                value={attendeeSearch}
                onChange={(e) => setAttendeeSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-slate-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-medium">Student Info</th>
                  <th className="px-6 py-4 font-medium text-center">
                    Current Status
                  </th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
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
                          <span className="font-semibold text-slate-200">
                            {reg.user?.name}
                          </span>
                          <span className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                            <Mail size={12} /> {reg.user?.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                            reg.attendanceStatus === "Arrived"
                              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                              : reg.attendanceStatus === "Absent"
                                ? "bg-red-500/10 text-red-500 border-red-500/20"
                                : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                          }`}
                        >
                          {reg.attendanceStatus || "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {/* ABSENT BUTTON */}
                          <button
                            onClick={() => handleMark(reg._id, "Absent")}
                            className={`p-2 rounded-lg transition-all border ${
                              reg.attendanceStatus === "Absent"
                                ? "bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/20"
                                : "bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500 hover:text-white"
                            }`}
                            title="Mark Absent"
                          >
                            <UserX size={16} />
                          </button>

                          {/* PRESENT BUTTON */}
                          <button
                            onClick={() => handleMark(reg._id, "Arrived")}
                            className={`p-2 rounded-lg transition-all border ${
                              reg.attendanceStatus === "Arrived"
                                ? "bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-500/20"
                                : "bg-emerald-600/10 text-emerald-600 border-emerald-600/20 hover:bg-emerald-600 hover:text-white"
                            }`}
                            title="Mark Present"
                          >
                            <UserCheck size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-6 py-12 text-center text-slate-500 italic"
                    >
                      {attendeeSearch
                        ? `No results found for "${attendeeSearch}"`
                        : "No attendees found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-white/5 p-4 text-right">
            <button
              onClick={() => setSelectedEvent(null)}
              className="text-xs font-bold text-slate-500 hover:text-white transition-colors"
            >
              Close List
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodaysEvents;
