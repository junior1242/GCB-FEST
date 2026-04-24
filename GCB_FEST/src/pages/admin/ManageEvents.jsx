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
  Users, // Icon for Department
} from "lucide-react";
import toast from "react-hot-toast";

// Specific department list provided by you
const DEPARTMENTS = [
  "Computer Science",
  "Information Technology",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Urdu",
  "English",
];

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
    targetDepartment: "", // New field for backend integration
  });
  const [imageFile, setImageFile] = useState(null);

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
      toast.error("Unsupported format!");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      toast.error("Max size 3MB");
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
      targetDepartment: event.targetDepartment || "",
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
    if (form.maxSeats <= 0) return toast.error("Seats must be > 0");
    if (form.date < todayLocal) return toast.error("Date cannot be in past");

    setLoading(true);
    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    if (imageFile) formData.append("image", imageFile);

    try {
      if (editingEventId) {
        await updateEvent(editingEventId, formData);
        toast.success("Event updated!");
      } else {
        await createEvent(formData);
        toast.success("Event launched & Emails scheduled!");
      }
      setShowModal(false);
      resetForm();
      loadInitialData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save");
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
      targetDepartment: "",
    });
    setImageFile(null);
    setEditingEventId(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await deleteEvent(id);
      toast.success("Removed");
      loadInitialData();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="text-white max-w-7xl mx-auto px-2">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 bg-white/5 p-5 md:p-8 rounded-3xl border border-white/10 backdrop-blur-md">
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
              className="p-3 bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 rounded-xl"
            >
              {isAddingCat ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Plus size={18} />
              )}
            </button>
          </form>

          <div className="h-8 w-[1px] bg-white/10 hidden sm:block" />

          <button
            onClick={handleAddNewClick}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-bold transition-all w-full sm:w-auto text-sm shadow-xl cursor-pointer"
          >
            <Plus size={16} /> New Event
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm shadow-2xl">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="bg-white/5 text-slate-400 text-[10px] uppercase tracking-widest font-bold">
                <th className="p-6">Event Details</th>
                <th className="p-6">Targeting</th>
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
                        <img
                          src={event.image || "https://via.placeholder.com/150"}
                          className="w-12 h-12 rounded-xl object-cover border border-white/10"
                          alt=""
                        />
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
                      <div className="flex flex-col gap-1.5">
                        <span className="inline-flex items-center w-fit gap-1 px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[9px] font-black rounded-full border border-emerald-500/20 uppercase">
                          <Tag size={10} /> {event.category?.name || "General"}
                        </span>
                        <span className="inline-flex items-center w-fit gap-1 px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[9px] font-black rounded-full border border-blue-500/20 uppercase">
                          <Users size={10} />{" "}
                          {event.targetDepartment || "All Departments"}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 md:p-6 text-slate-300">
                      <div className="flex flex-col text-xs">
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
                          className="p-2.5 text-blue-400 bg-blue-400/10 rounded-xl hover:bg-blue-400/20"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(event._id)}
                          className="p-2.5 text-red-400 bg-red-400/10 rounded-xl hover:bg-red-400/20"
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-white/10 w-full max-w-3xl rounded-[2rem] p-6 md:p-10 shadow-2xl relative my-auto">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-white">
                  {editingEventId ? "Update Event" : "New Event"}
                </h2>
                <p className="text-indigo-400/80 text-xs font-medium">
                  Emails will be sent to the selected target audience.
                </p>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-slate-400 hover:text-white"
              >
                <X size={28} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5"
            >
              <div className="md:col-span-2">
                <label className="text-[10px] font-black text-indigo-400 uppercase mb-2 block tracking-widest">
                  Title
                </label>
                <input
                  name="title"
                  value={form.title}
                  className="w-full bg-slate-950/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-[10px] font-black text-indigo-400 uppercase mb-2 block tracking-widest">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  className="w-full bg-slate-950/40 border border-white/10 rounded-xl px-4 py-3 h-24 resize-none text-sm text-white outline-none focus:border-indigo-500"
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-[10px] font-black text-indigo-400 uppercase mb-2 block tracking-widest">
                  Category
                </label>
                <select
                  name="category"
                  className="w-full bg-slate-950/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none cursor-pointer"
                  onChange={handleInputChange}
                  value={form.category}
                  required
                >
                  <option value="">Select Category</option>
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

              {/* Target Department Selection */}
              <div>
                <label className="text-[10px] font-black text-indigo-400 uppercase mb-2 block tracking-widest">
                  Target Department (Optional)
                </label>
                <select
                  name="targetDepartment"
                  className="w-full bg-slate-950/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none cursor-pointer focus:border-indigo-500"
                  onChange={handleInputChange}
                  value={form.targetDepartment}
                >
                  <option value="" className="bg-slate-900">
                    All Departments (Send to All)
                  </option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept} className="bg-slate-900">
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-indigo-400 uppercase mb-2 block tracking-widest">
                  Seats
                </label>
                <input
                  type="number"
                  name="maxSeats"
                  value={form.maxSeats}
                  className="w-full bg-slate-950/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none"
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3 md:col-span-1">
                <div>
                  <label className="text-[10px] font-black text-indigo-400 uppercase mb-2 block tracking-widest">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    min={todayLocal}
                    value={form.date}
                    className="w-full bg-slate-950/40 border border-white/10 rounded-xl px-3 py-3 text-sm text-white [color-scheme:dark]"
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-indigo-400 uppercase mb-2 block tracking-widest">
                    Time
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={form.time}
                    className="w-full bg-slate-950/40 border border-white/10 rounded-xl px-3 py-3 text-sm text-white [color-scheme:dark]"
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="text-[10px] font-black text-indigo-400 uppercase mb-2 block tracking-widest">
                  Location
                </label>
                <input
                  name="location"
                  value={form.location}
                  className="w-full bg-slate-950/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none"
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-[10px] font-black text-indigo-400 uppercase mb-2 block tracking-widest">
                  Banner Image
                </label>
                <div className="border-2 border-dashed border-white/10 rounded-2xl p-6 text-center hover:bg-white/5 transition-all cursor-pointer relative">
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleImageChange}
                    accept=".jpg,.jpeg,.png"
                  />
                  <ImageIcon
                    className="mx-auto mb-2 text-slate-500"
                    size={24}
                  />
                  <p className="text-xs text-slate-400">
                    {imageFile ? imageFile.name : "Upload Banner (JPG/PNG)"}
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="md:col-span-2 w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-xl font-black text-white transition-all cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="animate-spin mx-auto" size={20} />
                ) : editingEventId ? (
                  "Update Event"
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
