import React, { useState, useEffect } from "react";
import { fetchMyPastEvents } from "../../api/eventApi.js";
import {
  Calendar,
  MapPin,
  Clock,
  Loader2,
  Archive,
  CheckCircle,
  ArrowRightCircle,
} from "lucide-react";
import toast from "react-hot-toast";

export default function PreviousEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchMyPastEvents();
        setEvents(data);
      } catch (error) {
        toast.error("Failed to load your past events");
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  if (loading)
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500 w-10 h-10" />
      </div>
    );

  return (
    <div className="text-white max-w-6xl mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-400">
          <Archive className="text-blue-500" /> Previous Events
        </h1>
        <p className="text-slate-500 text-sm">
          History of events you have attended
        </p>
      </div>

      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-slate-900/30 border border-white/5 rounded-2xl p-5 backdrop-blur-sm hover:border-white/10 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-slate-700/30 text-slate-400 p-2 rounded-lg">
                  <Calendar size={20} />
                </div>
                <span className="text-[10px] uppercase font-bold px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center gap-1">
                  <CheckCircle size={10} /> Completed
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-300 mb-2 group-hover:text-white transition-colors">
                {event.title}
              </h3>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Clock size={14} />
<<<<<<< HEAD
                  {new Date(event.date).toLocaleDateString()}
=======
                  {new Date(event.eventDate).toLocaleDateString()}
>>>>>>> a8af5790d94358980f6cf7789c274b18afeaff5c
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <MapPin size={14} />
                  {event.location || "Main Auditorium"}
                </div>
              </div>

              <button className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 py-2 rounded-xl text-sm font-medium transition-colors border border-white/5 text-slate-300 hover:text-white">
<<<<<<< HEAD
                View Event Details <ArrowRightCircle size={16}  />
=======
                View Event Details <ArrowRightCircle size={16} />
>>>>>>> a8af5790d94358980f6cf7789c274b18afeaff5c
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-900/50 border border-dashed border-white/10 rounded-3xl p-20 text-center">
          <Archive className="mx-auto text-slate-700 mb-4" size={48} />
          <p className="text-slate-600 italic">
            No past events found in your history.
          </p>
        </div>
      )}
    </div>
  );
}
