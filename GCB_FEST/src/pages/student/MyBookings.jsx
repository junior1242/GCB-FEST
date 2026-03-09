import { useEffect, useState } from "react";
import { getMyBookings } from "../../api/reservationApi";

export default function MyBookings() {
  const [list, setList] = useState([]);

  useEffect(() => {
    // When the page opens, get the bookings
    getMyBookings().then((data) => setList(data));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-6">
        My Registered Events
      </h1>

      <div className="grid gap-4">
        {list.length === 0 ? (
          <p className="text-slate-400">
            You haven't registered for any events yet.
          </p>
        ) : (
          list.map((item) => (
            <div
              key={item._id}
              className="bg-white/5 p-6 rounded-2xl border border-white/10 flex justify-between items-center"
            >
              <div>
                <h3 className="text-xl font-bold text-blue-400">
                  {item.event?.title}
                </h3>
                <p className="text-slate-400">
                  {item.event?.date} at {item.event?.location}
                </p>
              </div>
              <span className="px-4 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold">
                CONFIRMED
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
