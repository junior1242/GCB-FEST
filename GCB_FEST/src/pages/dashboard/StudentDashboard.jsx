import { useEffect, useState } from "react";
import { getEvents } from "../../api/eventApi";
import { registerForEvent } from "../../api/reservationApi"; // Added this import
import { Calendar, MapPin, Users, Loader2, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

export default function StudentDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState(null); // Track specific button loading

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
    } finally {
      setLoading(false);
    }
  };
  // --- NEW REGISTRATION LOGIC ---
  const handleRegister = async (eventId) => {
    try {
      setRegisteringId(eventId); // Start loading for this specific event
      const res = await registerForEvent(eventId);
      toast.success(res.message || "Successfully registered for the event!");
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed";
      toast.error(message);
    } finally {
      setRegisteringId(null); // Stop loading
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
    <div className="max-w-7xl mx-auto">
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="text-blue-400 w-5 h-5" />
          <h1 className="text-4xl font-extrabold text-white tracking-tight italic">
            Available Events
          </h1>
        </div>
        <p className="text-slate-400 font-medium max-w-2xl">
          Discover and register for upcoming campus activities. Secure your spot before seats run out!
        </p>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-[2.5rem] border border-dashed border-white/10">
          <p className="text-slate-500 text-lg italic">No upcoming events found at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden hover:border-blue-500/40 transition-all duration-300 group flex flex-col shadow-2xl backdrop-blur-sm"
            >
              {/* Event Image */}
              <div className="h-52 bg-slate-800 overflow-hidden relative">
                <img
                  src={event.image || "https://via.placeholder.com/400x200"}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                   <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black rounded-lg uppercase tracking-widest shadow-lg">
                    {event.category?.name || "General"}
                  </span>
                </div>
              </div>

              {/* Event Details */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
                  {event.title}
                </h3>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                      <Calendar size={14} className="text-blue-500" />
                    </div>
                    <span>{event.date} • {event.time}</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                      <MapPin size={14} className="text-emerald-500" />
                    </div>
                    <span className="truncate">{event.location}</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                      <Users size={14} className="text-amber-500" />
                    </div>
                    <span className="font-semibold">{event.maxSeats} Total Seats</span>
                  </div>
                </div>

                <button 
                  onClick={() => handleRegister(event._id)}
                  disabled={registeringId === event._id}
                  className="mt-auto w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-blue-600/10 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {registeringId === event._id ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Registering...
                    </>
                  ) : (
                    "Register Now"
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}