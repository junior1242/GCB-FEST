import { useEffect, useState } from "react";
import { getEvents } from "../../api/eventApi";
import { registerForEvent } from "../../api/reservationApi";
import {
  Calendar,
  MapPin,
  Users,
  Loader2,
  Sparkles,
  X,
  Info,
  CheckCircle,
  ShieldCheck,
  ShieldAlert,
  Clock, // Added Clock icon
} from "lucide-react";
import toast from "react-hot-toast";

export default function StudentDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    loadEvents();
  }, []);

  // --- HELPER FUNCTION: Check if registration time has passed ---
  const isRegistrationClosed = (eventDate, eventTime) => {
    // This assumes eventDate is "YYYY-MM-DD" and eventTime is "HH:mm"
    const eventDateTime = new Date(`${eventDate}T${eventTime}`);
    const now = new Date();
    return now > eventDateTime;
  };

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await getEvents();
      setEvents(data);
    } catch (err) {
      toast.error("Could not load events");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId) => {
    try {
      setRegisteringId(eventId);
      const res = await registerForEvent(eventId);
      toast.success(res.message || "Successfully registered!");
      setSelectedEvent(null);
      loadEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setRegisteringId(null);
    }
  };

  if (loading)
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500 w-10 h-10" />
      </div>
    );

  return (
    <div className="w-full max-w-7xl mx-auto px-2 py-6">
      <div className="mb-10 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
          <Sparkles className="text-blue-400 w-5 h-5" />
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight italic">
            Available Events
          </h1>
        </div>
        <p className="text-slate-400 font-medium max-w-2xl mx-auto md:mx-0 text-sm md:text-base">
          Find your Favourite Events and Register Now!
        </p>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
          <p className="text-slate-500 text-lg italic">
            No upcoming events found.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {events.map((event) => {
            const closed = isRegistrationClosed(event.date, event.time);
            return (
              <div
                key={event._id}
                className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-blue-500/40 transition-all duration-300 group flex flex-col shadow-2xl backdrop-blur-sm"
              >
                <div className="h-48 md:h-52 bg-slate-800 overflow-hidden relative">
                  <img
                    src={event.image || "https://via.placeholder.com/400x200"}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />

                  {/* Status Badges */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    {closed && (
                      <span className="px-3 py-1 bg-red-500/80 backdrop-blur-md text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-lg">
                        Closed
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-4 left-4 flex gap-2">
                    <span className="px-3 py-1 bg-purple-600 text-white text-[10px] font-black rounded-lg uppercase tracking-widest shadow-lg flex items-center gap-1">
                      <ShieldCheck size={10} />
                      {event.targetDepartment || "All Departments"}
                    </span>
                  </div>
                </div>
                <div className="p-5 md:p-6 flex flex-col flex-1">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors line-clamp-1">
                    {event.title}
                  </h3>
                  <button
                    onClick={() => setSelectedEvent(event)}
                    className="mt-auto w-full bg-white/5 border border-white/10 hover:bg-white/10 cursor-pointer text-white font-bold py-3 md:py-4 rounded-xl md:rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95 text-sm md:text-base"
                  >
                    <Info size={18} /> View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- MODAL --- */}
      {selectedEvent &&
        (() => {
          const closed = isRegistrationClosed(
            selectedEvent.date,
            selectedEvent.time,
          );
          const noSeats = selectedEvent.remainingSeats <= 0;

          return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
              <div className="bg-slate-900 border border-white/10 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative my-auto">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-4 right-4 text-slate-400 hover:cursor-pointer hover:text-white p-2 bg-slate-950/50 rounded-full z-20"
                >
                  <X size={20} />
                </button>

                <div className="flex flex-col md:flex-row max-h-[90vh] overflow-y-auto">
                  <div className="w-full md:w-2/5 h-48 md:h-auto overflow-hidden">
                    <img
                      src={selectedEvent.image}
                      className="w-full h-full object-cover"
                      alt={selectedEvent.title}
                    />
                  </div>

                  <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      {selectedEvent.title}
                    </h2>
                    <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                      {selectedEvent.description}
                    </p>

                    <div className="space-y-3 mb-6 md:mb-8">
                      <div
                        className={`flex items-center gap-3 text-sm ${closed ? "text-red-400" : "text-slate-300"}`}
                      >
                        <Calendar
                          size={16}
                          className={`${closed ? "text-red-500" : "text-blue-500"} shrink-0`}
                        />
                        <span>
                          {selectedEvent.date} at {selectedEvent.time}
                          {closed && " (Expired)"}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-sm text-slate-300">
                        <ShieldAlert
                          size={16}
                          className="text-purple-400 shrink-0"
                        />
                        <span>
                          Eligible:{" "}
                          <span className="text-white font-semibold italic">
                            {selectedEvent.targetDepartment || "Open for All"}
                          </span>
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-sm text-slate-300">
                        <MapPin
                          size={16}
                          className="text-emerald-500 shrink-0"
                        />
                        <span className="truncate">
                          {selectedEvent.location}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-sm">
                        <Users size={16} className="text-amber-500 shrink-0" />
                        <span className="text-slate-300 font-medium">
                          Seats:{" "}
                          <span
                            className={
                              noSeats ? "text-red-500" : "text-emerald-400"
                            }
                          >
                            {selectedEvent.remainingSeats} /{" "}
                            {selectedEvent.maxSeats}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* REGISTRATION BUTTON LOGIC */}
                    <button
                      onClick={() => handleRegister(selectedEvent._id)}
                      disabled={
                        registeringId === selectedEvent._id || noSeats || closed
                      }
                      className={`w-full font-bold py-3 md:py-4 rounded-xl transition-all shadow-xl flex items-center justify-center gap-2 mt-auto 
                      ${
                        noSeats || closed
                          ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5"
                          : "bg-blue-600 text-white hover:cursor-pointer hover:bg-blue-500 active:scale-95"
                      }`}
                    >
                      {registeringId === selectedEvent._id ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : closed ? (
                        <>
                          <Clock size={18} /> Registration Closed
                        </>
                      ) : noSeats ? (
                        "Fully Booked"
                      ) : (
                        <>
                          <CheckCircle size={18} /> Confirm Registration
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
}
