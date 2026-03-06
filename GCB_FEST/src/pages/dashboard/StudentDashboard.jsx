import { useEffect, useState } from "react";
import { getEvents } from "../../api/eventApi";
import { Calendar, MapPin, Users } from "lucide-react";
import toast from "react-hot-toast";

export default function StudentDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        toast.error("Could not load events", err.response?.data?.message);

      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  if (loading) return <div className="text-white">Loading events...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Available Events</h1>
      <p className="text-slate-400 mb-8">
        Discover and register for upcoming campus activities.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event._id}
            className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group"
          >
            {/* Event Image */}
            <div className="h-48 bg-slate-800 overflow-hidden">
              <img
                src={event.image || "https://via.placeholder.com/400x200"}
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Event Details */}
            <div className="p-5">
              <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-bold rounded-full uppercase tracking-wider">
                {event.category?.name || "General"}
              </span>
              <h3 className="text-xl font-bold text-white mt-3 mb-4">
                {event.title}
              </h3>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Calendar size={14} className="text-blue-500" />
                  <span>
                    {event.date} at {event.time}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <MapPin size={14} className="text-blue-500" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Users size={14} className="text-blue-500" />
                  <span>{event.maxSeats} Seats Available</span>
                </div>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all active:scale-95">
                Register Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
