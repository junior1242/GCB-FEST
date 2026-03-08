import React from "react";

export default function EventDetailModal({ event, onClose, onRegister }) {
  if (!event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-white">{event.title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>

        <img
          src={event.image}
          alt=""
          className="w-full h-48 object-cover rounded-xl mb-4"
        />

        <div className="space-y-3 text-slate-300">
          <p>{event.description}</p>
          <div className="flex justify-between text-sm bg-white/5 p-3 rounded-lg">
            <span>📅 {event.date}</span>
            <span>⏰ {event.time}</span>
            <span>📍 {event.location}</span>
          </div>

          {/* Remaining Seats Display */}
          <div className="flex justify-between items-center py-2">
            <span className="font-semibold">Remaining Seats:</span>
            <span
              className={`text-lg font-bold ${event.remainingSeats > 0 ? "text-emerald-400" : "text-red-400"}`}
            >
              {event.remainingSeats} / {event.maxSeats}
            </span>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
          >
            Close
          </button>
          <button
            disabled={event.remainingSeats <= 0}
            onClick={() => onRegister(event._id)}
            className="flex-1 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed transition-all font-bold"
          >
            {event.remainingSeats > 0 ? "Register Now" : "Event Full"}
          </button>
        </div>
      </div>
    </div>
  );
}
