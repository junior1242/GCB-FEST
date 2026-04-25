import { useEffect, useState } from "react";
import { getMyBookings, updateBookingStatus } from "../../api/reservationApi"; // Changed from cancelBooking
import { Calendar, MapPin, Loader2, ChevronDown } from "lucide-react";

export default function MyBookings() {
  const [list, setList] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const data = await getMyBookings();
      setList(data);
    } catch (err) {
      console.error("Failed to load bookings", err);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    setLoadingId(id);
    try {
      // Call API to update status in DB
      const response = await updateBookingStatus(id, newStatus);

      if (response.success) {
        // Update local state so the UI changes immediately
        setList((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, status: newStatus } : item,
          ),
        );
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update status");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-2 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center md:text-left">
        My Registered Events
      </h1>

      <div className="grid gap-4">
        {list.length === 0 ? (
          <div className="bg-white/5 p-10 rounded-3xl border border-dashed border-white/10 text-center">
            <p className="text-slate-400">
              You haven't registered for any events yet.
            </p>
          </div>
        ) : (
          list.map((item) => (
            <div
              key={item._id}
              className="bg-white/5 p-5 md:p-6 rounded-2xl border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:bg-white/[0.07]"
            >
              <div className="space-y-1">
                <h3 className="text-lg md:text-xl font-bold text-blue-400">
                  {item.event?.title}
                </h3>
                <div className="flex flex-wrap gap-3 text-sm text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} /> {item.event?.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={14} /> {item.event?.location}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto relative">
                {loadingId === item._id && (
                  <Loader2
                    size={16}
                    className="animate-spin text-blue-400 absolute -left-6"
                  />
                )}

                <div className="relative w-full sm:w-40">
                  <select
                    value={item.status}
                    disabled={loadingId === item._id}
                    onChange={(e) =>
                      handleStatusUpdate(item._id, e.target.value)
                    }
                    className={`appearance-none w-full px-4 py-2 rounded-full text-[10px] font-black tracking-widest uppercase border cursor-pointer outline-none transition-all
                      ${
                        item.status === "confirmed"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                          : "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20"
                      } ${loadingId === item._id ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <option
                      value="confirmed"
                      className="bg-slate-900 text-white"
                    >
                      Confirm
                    </option>
                    <option
                      value="cancelled"
                      className="bg-slate-900 text-white"
                    >
                      Cancel
                    </option>
                  </select>
                  <ChevronDown
                    size={12}
                    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50"
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
