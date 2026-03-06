import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../api/authApi";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Hash,
  BookOpen,
  GraduationCap,
  Lock,
  ArrowRight,
} from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    rollNumber: "",
    department: "",
    semester: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Prevent negative numbers or zero during typing/pasting
    if (name === "rollNumber" && value !== "" && parseInt(value) < 1) {
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await registerUser(form);
      toast.success("Registration successful! Please verify your email.");
      navigate("/");
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || "Registration failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Reusable styles for a clean look
  const inputStyle =
    "w-full bg-white/5 border border-white/10 rounded-xl px-11 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 text-sm";
  const iconStyle =
    "absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4";

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-slate-950 font-sans p-4 overflow-x-hidden">
      {/* Background with Overlay */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('../../assets/wallpaperforProject.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-[3px]" />
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-2xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl p-8 md:p-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
            Create Account
          </h1>
          <p className="text-slate-400">
            Enter your details to join the student portal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Full Name */}
            <div className="relative">
              <User className={iconStyle} />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
                className={inputStyle}
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className={iconStyle} />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
                className={inputStyle}
              />
            </div>

            {/* Roll Number - Forced Positive */}
            <div className="relative">
              <Hash className={iconStyle} />
              <input
                type="number"
                name="rollNumber"
                placeholder="Roll Number"
                value={form.rollNumber}
                onChange={handleChange}
                onKeyDown={(e) =>
                  ["-", "e", "E", "+"].includes(e.key) && e.preventDefault()
                }
                min="1"
                required
                className={inputStyle}
              />
            </div>

            {/* Department */}
            <div className="relative">
              <BookOpen className={iconStyle} />
              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                required
                className={`${inputStyle} appearance-none`}
              >
                <option value="" disabled className="bg-slate-900">
                  Select Department
                </option>
                {[
                  "Computer Science",
                  "Information Technology",
                  "Mathematics",
                  "Physics",
                  "Chemistry",
                  "Urdu",
                  "English",
                ].map((dept) => (
                  <option
                    key={dept}
                    value={dept}
                    className="bg-slate-900 text-white"
                  >
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Semester */}
            <div className="relative">
              <GraduationCap className={iconStyle} />
              <select
                name="semester"
                value={form.semester}
                onChange={handleChange}
                required
                className={`${inputStyle} appearance-none`}
              >
                <option value="" disabled className="bg-slate-900">
                  Semester
                </option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <option
                    key={num}
                    value={num}
                    className="bg-slate-900 text-white"
                  >
                    {num}
                  </option>
                ))}
              </select>
            </div>

            <div className="hidden md:block"></div>

            {/* Password */}
            <div className="relative">
              <Lock className={iconStyle} />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className={inputStyle}
              />
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Lock className={iconStyle} />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className={inputStyle}
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="group relative w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Creating Account...
              </span>
            ) : (
              <>
                Register Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <p className="text-center text-slate-400 text-sm">
            Already have an account?{" "}
            <Link
              to="/"
              className="text-blue-400 font-medium hover:text-blue-300 transition-colors"
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
