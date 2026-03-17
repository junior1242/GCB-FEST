import { useState, useEffect } from "react";
import { getEvents, createEvent, deleteEvent } from "../../api/eventApi";
import { getCategories, createCategory } from "../../api/categoryApi"; 
import { Plus, Trash2, Image as ImageIcon, X, Loader2, Tag, Calendar, MapPin, Hash } from "lucide-react";
import toast from "react-hot-toast";

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false); // For Event Creation
  const [fetching, setFetching] = useState(true); // For Initial Page Load
  
  // Category Management States
  const [newCatName, setNewCatName] = useState("");
  const [isAddingCat, setIsAddingCat] = useState(false);

  // Form State for New Event
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    maxSeats: "",
    category: "", 
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setFetching(true);
      const [eventData, catData] = await Promise.all([
        getEvents(),
        getCategories()
      ]);
      setEvents(eventData);
      setCategories(catData);
    } catch (err) {
      console.error("Error loading data:", err);
      toast.error("Failed to sync data with server");
    } finally {
      setFetching(false);
    }
  };

  // Logic to handle adding a new category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    try {
      setIsAddingCat(true);
      await createCategory(newCatName); 
      toast.success(`Category "${newCatName}" created!`);
      setNewCatName(""); 
      loadInitialData(); // Refresh dropdown and list
    } catch (err) {
      toast.error("Failed to add category");
    } finally {
      setIsAddingCat(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category) {
      toast.error("Please select a category");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    if (imageFile) formData.append("image", imageFile);

    try {
      await createEvent(formData);
      toast.success("Event launched successfully!");
      setShowModal(false);
      resetForm();
      loadInitialData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ title: "", description: "", date: "", time: "", location: "", maxSeats: "", category: "" });
    setImageFile(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event? All registered students will be notified via email.")) return;
    try {
      await deleteEvent(id);
      toast.success("Event removed");
      loadInitialData();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="text-white max-w-7xl mx-auto">
      {/* Header Section with Quick Add Category */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10 bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-md">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight italic">Manage Events</h1>
          <p className="text-slate-400 mt-1 font-medium text-sm text-center md:text-left">Create activities & manage categories</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          {/* Inline Category Form */}
          <form onSubmit={handleAddCategory} className="flex gap-2 w-full sm:w-auto">
            <input 
              type="text" 
              placeholder="New Category..." 
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 w-full sm:w-40 transition-all"
            />
            <button 
              type="submit"
              disabled={isAddingCat}
              className="p-3 bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 rounded-xl hover:bg-emerald-600/40 transition-all disabled:opacity-50"
            >
              {isAddingCat ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
            </button>
          </form>

          <div className="h-8 w-[1px] bg-white/10 hidden sm:block" />

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-xl font-bold transition-all shadow-xl shadow-blue-600/20 active:scale-95 w-full sm:w-auto"
          >
            <Plus size={20} /> Launch Event
          </button>
        </div>
      </div>

      {/* Events Table Container */}
      <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden backdrop-blur-sm shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-slate-400 text-xs uppercase tracking-widest font-bold">
                <th className="p-6">Event Details</th>
                <th className="p-6">Category</th>
                <th className="p-6">Schedule</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {fetching ? (
                <tr>
                  <td colSpan="4" className="p-20 text-center">
                    <Loader2 className="animate-spin mx-auto text-blue-500 mb-4" size={40} />
                    <p className="text-slate-400 font-medium tracking-wide">Fetching campus events...</p>
                  </td>
                </tr>
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-20 text-center text-slate-500 italic">
                    No events found. Start by launching your first activity!
                  </td>
                </tr>
              ) : (
                events.map((event) => (
                  <tr key={event._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-800 border border-white/10 flex-shrink-0">
                          <img src={event.image || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-lg block text-white truncate">{event.title}</span>
                          <span className="text-sm text-slate-500 flex items-center gap-1">
                            <MapPin size={12} className="text-blue-500" /> {event.location}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-500/20 uppercase tracking-widest">
                        <Tag size={10} /> {event.category?.name || "General"}
                      </span>
                    </td>
                    <td className="p-6 text-slate-300 font-medium">
                      <div className="flex flex-col">
                        <span className="flex items-center gap-2"><Calendar size={14} className="text-blue-500" /> {event.date}</span>
                        <span className="text-xs text-slate-500 mt-1 ml-5">{event.time}</span>
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <button
                        onClick={() => handleDelete(event._id)}
                        className="p-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Launch Event Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-white/10 w-full max-w-3xl rounded-[3rem] p-8 md:p-12 max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold">New Event</h2>
                <p className="text-slate-400 text-sm">Announce a new campus activity to students.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 ml-1 tracking-widest">Title</label>
                <input
                  name="title"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 outline-none focus:border-blue-500 transition-all text-sm"
                  placeholder="e.g. Annual Tech Symposium"
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 ml-1 tracking-widest">Description</label>
                <textarea
                  name="description"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 outline-none focus:border-blue-500 h-28 resize-none text-sm"
                  placeholder="Briefly describe the event..."
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 ml-1 tracking-widest">Category</label>
                <div className="relative">
                  <select
                    name="category"
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3.5 outline-none focus:border-blue-500 appearance-none text-sm text-white cursor-pointer"
                    onChange={handleInputChange}
                    value={form.category}
                    required
                  >
                    <option value="" className="text-slate-400">Select Category</option>
                    {Array.isArray(categories) && categories.map((cat) => (
                      <option key={cat._id} value={cat._id} className="bg-slate-900">{cat.name}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 ml-1 tracking-widest">Seats Available</label>
                <input
                  type="number"
                  name="maxSeats"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 outline-none focus:border-blue-500 text-sm"
                  placeholder="e.g. 100"
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 ml-1 tracking-widest">Date</label>
                <input
                  type="date"
                  name="date"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 outline-none focus:border-blue-500 text-sm"
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 ml-1 tracking-widest">Time</label>
                <input
                  type="time"
                  name="time"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 outline-none focus:border-blue-500 text-sm"
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 ml-1 tracking-widest">Location</label>
                <input
                  name="location"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 outline-none focus:border-blue-500 text-sm"
                  placeholder="Main Auditorium or Meeting Room"
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 ml-1 tracking-widest">Event Banner</label>
                <div className="border-2 border-dashed border-white/10 rounded-2xl p-6 text-center hover:border-blue-500/50 transition-all cursor-pointer relative bg-white/[0.02] group">
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    accept="image/*"
                  />
                  <ImageIcon className="mx-auto mb-2 text-slate-500 group-hover:text-blue-500 transition-colors" size={32} />
                  <p className="text-xs text-slate-400 font-medium tracking-tight">
                    {imageFile ? imageFile.name : "Click or drag to upload banner image"}
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="md:col-span-2 w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-bold text-white shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
              >
                {loading ? (
                  <> <Loader2 className="animate-spin" size={20} /> Deploying Event... </>
                ) : (
                  <>Launch Event</>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}