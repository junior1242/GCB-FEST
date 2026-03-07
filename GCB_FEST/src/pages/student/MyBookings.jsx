import { Calendar, Clock, MapPin } from "lucide-react";

export default function MyBookings() {
  return (
    <div className="text-white max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-2">My Registrations</h1>
      <p className="text-slate-400 mb-10">Events you have successfully joined.</p>

      {/* Placeholder for now */}
      <div className="flex flex-col items-center justify-center py-20 bg-white/5 border border-dashed border-white/10 rounded-[2.5rem]">
        <div className="bg-white/5 p-4 rounded-full mb-4">
          <Calendar className="text-slate-500" size={32} />
        </div>
        <p className="text-slate-400 font-medium">No events joined yet.</p>
        <p className="text-sm text-slate-600 mt-1">Visit the Events Feed to find something exciting!</p>
      </div>
    </div>
  );
}