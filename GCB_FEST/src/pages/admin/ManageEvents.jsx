import { useState, useEffect } from "react";
import {
  getEvents,
  createEvent,
  deleteEvent,
  updateEvent,
} from "../../api/eventApi";
import { getCategories, createCategory } from "../../api/categoryApi";
import {
  Plus,
  Trash2,
  Pencil,
  Image as ImageIcon,
  X,
  Loader2,
  Tag,
  Calendar,
  MapPin,
} from "lucide-react";
import toast from "react-hot-toast";

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [newCatName, setNewCatName] = useState("");
  const [isAddingCat, setIsAddingCat] = useState(false);

  const [editingEventId, setEditingEventId] = useState(null);

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

  // Correct Local Date Logic
  const now = new Date();
  const todayLocal = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setFetching(true);
      const [eventData, catData] = await Promise.all([
        getEvents(),
        getCategories(),
      ]);
      setEvents(eventData);
      setCategories(catData);
    } catch (err) {
      toast.error("Failed to sync data with server");
    } finally {
      setFetching(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Unsupported file format! Please upload JPG, PNG, or JPEG.");
      e.target.value = "";
      setImageFile(null);
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      toast.error("File is too large! Maximum limit is 3MB.");
      e.target.value = "";
      setImageFile(null);
      return;
    }

    setImageFile(file);
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      setIsAddingCat(true);
      await createCategory(newCatName);
      toast.success(`Category "${newCatName}" created!`);
      setNewCatName("");
      loadInitialData();
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

  const handleEditClick = (event) => {
    setEditingEventId(event._id);
    setForm({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      maxSeats: event.maxSeats,
      category: event.category?._id || event.category,
    });
    setShowModal(true);
  };

  const handleAddNewClick = () => {
    setEditingEventId(null);
    resetForm();
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.category) return toast.error("Please select a category");
    if (form.maxSeats <= 0)
      return toast.error("Seats must be greater than zero");
    if (form.date < todayLocal)
      return toast.error("Event date cannot be in the past");

    setLoading(true);
    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    if (imageFile) formData.append("image", imageFile);

    try {
      if (editingEventId) {
        await updateEvent(editingEventId, formData);
        toast.success("Event updated successfully!");
      } else {
        await createEvent(formData);
        toast.success("Event launched successfully!");
      }

      setShowModal(false);
      resetForm();
      loadInitialData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save event");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      maxSeats: "",
      category: "",
    });
    setImageFile(null);
    setEditingEventId(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event? Students will be notified."))
      return;
    try {
      await deleteEvent(id);
      toast.success("Event removed");
      loadInitialData();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="text-white max-w-7xl mx-auto px-2">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 bg-white/5 p-5 md:p-8 rounded-3xl md:rounded-[2.5rem] border border-white/10 backdrop-blur-md text-center md:text-left">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight italic">
            Manage Events
          </h1>
          <p className="text-slate-400 mt-1 font-medium text-xs md:text-sm">
            Create activities & manage categories
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          <form
            onSubmit={handleAddCategory}
            className="flex gap-2 w-full sm:w-auto"
          >
            <input
              type="text"
              placeholder="New Category..."
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm flex-1 sm:w-40 outline-none"
            />
            <button
              type="submit"
              disabled={isAddingCat}
              className="p-3 bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 rounded-xl disabled:opacity-50"
            >
              {isAddingCat ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Plus size={18} className="hover:cursor-pointer" />
              )}
            </button>
          </form>

          <div className="h-8 w-[1px] bg-white/10 hidden sm:block" />

          <button
            onClick={handleAddNewClick}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:cursor-pointer bg-blue-400 px-6 py-3 rounded-xl font-bold transition-all w-full sm:w-auto text-sm shadow-xl"
          >
            <Plus size={16} />
            New Event
          </button>
        </div>
      </div>

      {/* Events Table Container */}
      <div className="bg-white/5 border border-white/10 rounded-2xl md:rounded-[2rem] overflow-hidden backdrop-blur-sm shadow-2xl">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="bg-white/5 text-slate-400 text-[10px] uppercase tracking-widest font-bold">
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
                    <Loader2
                      className="animate-spin mx-auto text-blue-500 mb-2"
                      size={32}
                    />
                    <p className="text-slate-400 text-sm">
                      Fetching campus events...
                    </p>
                  </td>
                </tr>
              ) : events.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="p-20 text-center text-slate-500 italic"
                  >
                    No events found.
                  </td>
                </tr>
              ) : (
                events.map((event) => (
                  <tr
                    key={event._id}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="p-4 md:p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-800 border border-white/10 shrink-0">
                          <img
                            src={
                              event.image || "https://via.placeholder.com/150"
                            }
                            className="w-full h-full object-cover"
                            alt=""
                          />
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-base block text-white truncate">
                            {event.title}
                          </span>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <MapPin size={10} className="text-blue-500" />{" "}
                            {event.location}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 md:p-6">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[9px] font-black rounded-full border border-emerald-500/20 uppercase tracking-widest">
                        <Tag size={10} /> {event.category?.name || "General"}
                      </span>
                    </td>
                    <td className="p-4 md:p-6 text-slate-300">
                      <div className="flex flex-col text-xs md:text-sm">
                        <span className="flex items-center gap-2">
                          <Calendar size={14} className="text-blue-500" />{" "}
                          {event.date}
                        </span>
                        <span className="text-slate-500 ml-5">
                          {event.time}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 md:p-6 text-right">
                      <div className="flex justify-end gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditClick(event)}
                          className="p-2.5 text-blue-400 hover:cursor-pointer bg-blue-400/10 rounded-xl transition-all"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(event._id)}
                          className="p-2.5 text-red-400 hover:cursor-pointer bg-red-400/10 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Section */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-white/10 w-full max-w-3xl rounded-2xl md:rounded-[3rem] p-6 md:p-12 max-h-[95vh] overflow-y-auto shadow-2xl relative my-auto">
            {/* Header Section */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight">
                  {editingEventId ? "Update Event" : "New Event"}
                </h2>
                <p className="text-indigo-400/80 text-xs md:text-sm font-medium mt-1">
                  {editingEventId
                    ? "Modify the event details and save changes."
                    : "Create a new Event for the College."}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-white/10 rounded-full transition-all text-slate-400 hover:text-white"
              >
                <X size={28} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
            >
              {/* Title Field */}
              <div className="md:col-span-2">
                <label className="text-[10px] font-black text-indigo-400 uppercase mb-2 block tracking-[0.2em] ml-1">
                  Title
                </label>
                <input
                  name="title"
                  value={form.title}
                  className="w-full bg-slate-950/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600"
                  placeholder="e.g. Annual Symposium"
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Description Field */}
              <div className="md:col-span-2">
                <label className="text-[10px] font-black text-indigo-400 uppercase mb-2 block tracking-[0.2em] ml-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  className="w-full bg-slate-950/40 border border-white/10 rounded-xl px-4 py-3 h-24 md:h-28 resize-none text-sm text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600"
                  placeholder="What is this event about..."
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Category Field */}
              <div>
                <label className="text-[10px] font-black text-indigo-400 uppercase mb-2 block tracking-[0.2em] ml-1">
                  Category
                </label>
                <select
                  name="category"
                  className="w-full bg-slate-950/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none cursor-pointer focus:border-indigo-500 transition-all appearance-none"
                  onChange={handleInputChange}
                  value={form.category}
                  required
                >
                  <option value="" className="bg-slate-900">
                    Select Category
                  </option>
                  {categories.map((cat) => (
                    <option
                      key={cat._id}
                      value={cat._id}
                      className="bg-slate-900"
                    >
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Seats Field */}
              <div>
                <label className="text-[10px] font-black text-indigo-400 uppercase mb-2 block tracking-[0.2em] ml-1">
                  Seats Available
                </label>
                <input
                  type="number"
                  name="maxSeats"
                  value={form.maxSeats}
                  className="w-full bg-slate-950/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                  placeholder="e.g. 100"
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>

              {/* Date Field - High Visibility Logo */}
              <div>
                <label className="text-[10px] font-black text-indigo-400 uppercase mb-2 block tracking-[0.2em] ml-1">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  min={todayLocal}
                  value={form.date}
                  className="w-full bg-slate-950/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:hover:opacity-70"
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Time Field - High Visibility Logo */}
              <div>
                <label className="text-[10px] font-black text-indigo-400 uppercase mb-2 block tracking-[0.2em] ml-1">
                  Time
                </label>
                <input
                  type="time"
                  name="time"
                  value={form.time}
                  className="w-full bg-slate-950/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:hover:opacity-70"
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Location Field */}
              <div className="md:col-span-2">
                <label className="text-[10px] font-black text-indigo-400 uppercase mb-2 block tracking-[0.2em] ml-1">
                  Location
                </label>
                <input
                  name="location"
                  value={form.location}
                  className="w-full bg-slate-950/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                  placeholder="Main Auditorium, Building C"
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Banner Upload Field */}
              <div className="md:col-span-2">
                <label className="text-[10px] font-black text-indigo-400 uppercase mb-2 block tracking-[0.2em] ml-1">
                  Banner Image
                </label>
                <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all cursor-pointer relative group">
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    onChange={handleImageChange}
                    accept=".jpg,.jpeg,.png"
                  />
                  <ImageIcon
                    className="mx-auto mb-3 text-slate-500 group-hover:text-indigo-400 transition-colors"
                    size={32}
                  />
                  <p className="text-xs text-slate-400 font-bold group-hover:text-slate-200 transition-colors">
                    {imageFile
                      ? imageFile.name
                      : "Drag and drop or click to upload banner"}
                  </p>
                  <p className="text-[9px] text-slate-600 mt-1 uppercase tracking-tighter">
                    JPG, PNG up to 3MB
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="md:col-span-2 w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 py-4 rounded-xl font-black text-white shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98] cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} /> Processing...
                  </>
                ) : editingEventId ? (
                  "Update Event Details"
                ) : (
                  "Publish Live Event"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
