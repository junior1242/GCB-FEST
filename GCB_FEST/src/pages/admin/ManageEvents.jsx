import { useState, useEffect } from "react";
import { getEvents, createEvent, deleteEvent } from "../../api/eventApi";
import { Plus, Trash2, Image as ImageIcon, X } from "lucide-react";
import toast from "react-hot-toast";

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    maxSeats: "",
    category: "65d123...", // Replace with a real category ID from your DB
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    loadAllEvents();
  }, []);

  const loadAllEvents = async () => {
    const data = await getEvents();
    setEvents(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    // Append text fields
    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    // Append image file
    if (imageFile) formData.append("image", imageFile);

    try {
      await createEvent(formData);
      toast.success("Event Created!");
      setShowModal(false);
      loadAllEvents();
    } catch (err) {
      toast.error("Failed to create event", err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-white">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Manage Events</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20"
        >
          <Plus size={20} /> Create New Event
        </button>
      </div>

      {/* Table style list for Admin */}
      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 text-slate-400 text-sm uppercase">
              <th className="p-5">Event</th>
              <th className="p-5">Date/Time</th>
              <th className="p-5">Location</th>
              <th className="p-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {events.map((event) => (
              <tr
                key={event._id}
                className="hover:bg-white/[0.02] transition-colors"
              >
                <td className="p-5">
                  <div className="flex items-center gap-4">
                    <img
                      src={event.image}
                      className="w-12 h-12 rounded-lg object-cover bg-slate-800"
                    />
                    <span className="font-semibold">{event.title}</span>
                  </div>
                </td>
                <td className="p-5 text-slate-300">
                  {event.date} at {event.time}
                </td>
                <td className="p-5 text-slate-300">{event.location}</td>
                <td className="p-5 text-right">
                  <button
                    onClick={() => {
                      if (confirm("Delete event?"))
                        deleteEvent(event._id).then(loadAllEvents);
                    }}
                    className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-white/10 w-full max-w-2xl rounded-3xl p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Add New Event</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                placeholder="Event Title"
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
              <textarea
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500 h-32"
                placeholder="Description"
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3"
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                />
                <input
                  type="time"
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3"
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  required
                />
              </div>
              <input
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3"
                placeholder="Location"
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                required
              />
              <input
                type="number"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3"
                placeholder="Max Seats"
                onChange={(e) => setForm({ ...form, maxSeats: e.target.value })}
                required
              />

              <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-blue-500/50 transition-colors cursor-pointer relative">
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  accept="image/*"
                />
                <ImageIcon className="mx-auto mb-2 text-slate-500" size={32} />
                <p className="text-sm text-slate-400">
                  {imageFile ? imageFile.name : "Click to upload event banner"}
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold text-white shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? "Creating..." : "Launch Event"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
