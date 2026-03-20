import { useEffect, useState } from "react";
import { getMyBookings } from "../../api/reservationApi";
import { Calendar, MapPin } from "lucide-react";

export default function MyBookings() {
  const [list, setList] = useState([]);

  useEffect(() => {
    getMyBookings().then((data) => setList(data));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-2 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center md:text-left">
        My Registered Events
      </h1>

      <div className="grid gap-4">
        {list.length === 0 ? (
          <div className="bg-white/5 p-10 rounded-3xl border border-dashed border-white/10 text-center">
            <p className="text-slate-400">You haven't registered for any events yet.</p>
          </div>
        ) : (
          list.map((item) => (
            <div key={item._id} className="bg-white/5 p-5 md:p-6 rounded-2xl border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <h3 className="text-lg md:text-xl font-bold text-blue-400">{item.event?.title}</h3>
                <div className="flex flex-wrap gap-3 text-sm text-slate-400">
                  <span className="flex items-center gap-1"><Calendar size={14}/> {item.event?.date}</span>
                  <span className="flex items-center gap-1"><MapPin size={14}/> {item.event?.location}</span>
                </div>
              </div>
              <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] font-black tracking-widest uppercase">
                CONFIRMED
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}