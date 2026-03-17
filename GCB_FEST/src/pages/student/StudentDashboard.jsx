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
} from "lucide-react";
import toast from "react-hot-toast";

export default function StudentDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState(null);

  // --- NEW STATE FOR DIALOG ---
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await getEvents();
      setEvents(data);
    } catch (err) {
      toast.error("Could not load events");
      console.log(err);
      
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
      const message = err.response?.data?.message || "Registration failed";
      toast.error(message);
    } finally {
      setRegisteringId(null);
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500 w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto relative">
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="text-blue-400 w-5 h-5" />
          <h1 className="text-4xl font-extrabold text-white tracking-tight italic">
            Available Events
          </h1>
        </div>
        <p className="text-slate-400 font-medium max-w-2xl">
          Discover and register for upcoming campus activities. Secure your spot
          before seats run out!
        </p>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-[2.5rem] border border-dashed border-white/10">
          <p className="text-slate-500 text-lg italic">
            No upcoming events found.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white/5 border border-white/10 rounded-4xl overflow-hidden hover:border-blue-500/40 transition-all duration-300 group flex flex-col shadow-2xl backdrop-blur-sm"
            >
              <div className="h-52 bg-slate-800 overflow-hidden relative">
                <img
                  src={event.image || "https://via.placeholder.com/400x200"}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black rounded-lg uppercase tracking-widest shadow-lg">
                    {event.category?.name || "General"}
                  </span>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
                  {event.title}
                </h3>

                {/* --- UPDATED BUTTON: VIEW DETAIL --- */}
                <button
                  onClick={() => setSelectedEvent(event)}
                  className="mt-auto w-full bg-white/5 border border-white/10 hover:bg-white/10 hover:cursor-pointer text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <Info size={18} />
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- EVENT DETAILS DIALOG (MODAL) --- */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-white/10 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300">
            {/* Close Button */}
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white p-2 bg-white/5 rounded-full z-10"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col md:flex-row">
              {/* Image Side */}
              <div className="md:w-1/3 h-64 md:h-auto overflow-hidden">
                <img
                  src={selectedEvent.image}
                  className="w-full h-full object-cover"
                  alt={selectedEvent.title}
                />
              </div>

              {/* Content Side */}
              <div className="md:w-1/2 p-8 flex flex-col">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {selectedEvent.title}
                </h2>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  {selectedEvent.description}
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    <Calendar size={16} className="text-blue-500" />
                    <span>
                      {selectedEvent.date} at {selectedEvent.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    <MapPin size={16} className="text-emerald-500" />
                    <span>{selectedEvent.location}</span>
                  </div>

                  {/* --- REMAINING SEATS LOGIC --- */}
                  <div className="flex items-center gap-3 text-sm">
                    <Users size={16} className="text-amber-500" />
                    <span className="text-slate-300 font-medium">
                      Remaining Seats:
                    </span>
                    <span
                      className={`font-black ${selectedEvent.remainingSeats > 0 ? "text-emerald-400" : "text-red-500"}`}
                    >
                      {selectedEvent.remainingSeats} / {selectedEvent.maxSeats}
                    </span>
                  </div>
                </div>

                {/* Final Register Button */}
                <button
                  onClick={() => handleRegister(selectedEvent._id)}
                  disabled={
                    registeringId === selectedEvent._id ||
                    selectedEvent.remainingSeats <= 0
                  }
                  className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {registeringId === selectedEvent._id ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : selectedEvent.remainingSeats > 0 ? (
                    <>
                      <CheckCircle size={18} />
                      Confirm Registration
                    </>
                  ) : (
                    "Event Fully Booked"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
