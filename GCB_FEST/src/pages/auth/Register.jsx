// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { registerUser } from "../../api/authApi";
// import toast from "react-hot-toast";

// export default function Register() {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     rollNumber: "",
//     department: "",
//     semester: "",
//     password: "",
//     confirmPassword: "",
//     role: "student", // fixed role
//   });

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // 1️⃣ Client-side password match check
//     if (form.password !== form.confirmPassword) {
//       toast.error("Passwords do not match");
//       return;
//     }

//     try {
//       // 2️⃣ Call backend registration
//       await registerUser(form);

//       // 3️⃣ Success toast & redirect
//       toast.success("Student registered successfully!");
//       navigate("/"); // redirect to login
//     } catch (err) {
//       // 4️⃣ Handle backend errors safely
//       const message =
//         err?.response?.data?.message || err?.message || "Registration failed";

//       toast.error(message); // show toast
//       console.log("Registration error:", message);

//       // Optional: Highlight specific fields if error mentions rollNumber/email
//       if (message.toLowerCase().includes("roll number")) {
//         document.querySelector('input[name="rollNumber"]')?.focus();
//       } else if (message.toLowerCase().includes("email")) {
//         document.querySelector('input[name="email"]')?.focus();
//       }
//     }
//   };
//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="space-y-4 w-full max-w-md mx-auto bg-white p-6 rounded shadow"
//     >
//       <h2 className="text-2xl font-bold text-center">Register Student</h2>

//       <input
//         type="text"
//         name="name"
//         placeholder="Full Name"
//         className="w-full border p-2 rounded"
//         onChange={handleChange}
//         required
//       />

//       <input
//         type="email"
//         name="email"
//         placeholder="Email"
//         className="w-full border p-2 rounded"
//         onChange={handleChange}
//         required
//       />

//       <input
//         type="number"
//         name="rollNumber"
//         placeholder="Roll Number"
//         className="w-full border p-2 rounded"
//         onChange={handleChange}
//         required
//       />

//       <select
//         name="department"
//         className="w-full border p-2 rounded"
//         onChange={handleChange}
//         required
//       >
//         <option value="">Select Department</option>
//         <option value="Computer Science">Computer Science</option>
//         <option value="Information Technology">Information Technology</option>
//         <option value="Mathematics">Mathematics</option>
//         <option value="Urdu">Urdu</option>
//         <option value="English">English</option>
//         <option value="Physics">Physics</option>
//         <option value="Chemistry">Chemistry</option>
//         <option value="Botany">Botany</option>
//         <option value="Islamiat">Islamiat</option>
//       </select>

//       <select
//         name="semester"
//         className="w-full border p-2 rounded"
//         onChange={handleChange}
//         required
//       >
//         <option value="">Select Semester</option>
//         <option value="1st">1st</option>
//         <option value="2nd">2nd</option>
//         <option value="3rd">3rd</option>
//         <option value="4th">4th</option>
//         <option value="5th">5th</option>
//         <option value="6th">6th</option>
//         <option value="7th">7th</option>
//         <option value="8th">8th</option>
//       </select>

//       <input
//         type="password"
//         name="password"
//         placeholder="Password"
//         className="w-full border p-2 rounded"
//         onChange={handleChange}
//         required
//       />
//       <input
//         type="password"
//         name="confirmPassword"
//         placeholder="Confirm Password"
//         className="w-full border p-2 rounded"
//         onChange={handleChange}
//         required
//       />

//       <input type="hidden" name="role" value="student" />

//       <button className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
//         Register
//       </button>

//       <p className="text-center text-gray-500">
//         Already have an account?{" "}
//         <Link to="/" className="text-blue-600 hover:underline">
//           Login
//         </Link>
//       </p>
//     </form>
//   );
// }

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../api/authApi";
import toast from "react-hot-toast";

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

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Extra safety: Check if rollNumber is positive
    if (parseInt(form.rollNumber) <= 0) {
      toast.error("Roll Number must be a positive number");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await registerUser(form);
      toast.success("Student registered successfully!");
      navigate("/");
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || "Registration failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full overflow-y-auto bg-slate-900 scroll-smooth">
      {/* Background Layer */}
      <div
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('../../assets/wallpaperforProject.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10 min-h-full w-full flex items-center justify-center p-4 py-10 md:p-12">
        <div className="w-full max-w-[650px] backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl rounded-[2.5rem] p-6 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Create Account
            </h1>
            <p className="text-white/50 text-sm mt-2">
              Join our student community
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Name & Email Fields */}
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[11px] font-bold text-white/60 uppercase tracking-widest ml-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-white/20"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[11px] font-bold text-white/60 uppercase tracking-widest ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-white/20"
                  placeholder="name@university.edu"
                />
              </div>

              {/* ROLL NUMBER FIELD (MODIFIED) */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-white/60 uppercase tracking-widest ml-1">
                  Roll Number
                </label>
                <input
                  type="number"
                  name="rollNumber"
                  required
                  min="1" // Prevents HTML validation for negative/zero
                  onKeyDown={(e) => {
                    // This blocks the "-", "+", and "e" keys entirely
                    if (
                      e.key === "-" ||
                      e.key === "+" ||
                      e.key === "e" ||
                      e.key === "E"
                    ) {
                      e.preventDefault();
                    }
                  }}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-white/20"
                  placeholder="e.g. 1025"
                />
              </div>

              {/* Semester Field */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-white/60 uppercase tracking-widest ml-1">
                  Semester
                </label>
                <div className="relative">
                  <select
                    name="semester"
                    required
                    onChange={handleChange}
                    className="w-full bg-slate-800 md:bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none"
                  >
                    <option value="">Select</option>
                    {[
                      "1st",
                      "2nd",
                      "3rd",
                      "4th",
                      "5th",
                      "6th",
                      "7th",
                      "8th",
                    ].map((s) => (
                      <option key={s} value={s} className="bg-slate-900">
                        {s} Semester
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M19 9l-7 7-7-7"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Department Field */}
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[11px] font-bold text-white/60 uppercase tracking-widest ml-1">
                  Department
                </label>
                <select
                  name="department"
                  required
                  onChange={handleChange}
                  className="w-full bg-slate-800 md:bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none"
                >
                  <option value="">Select Department</option>
                  {[
                    "Computer Science",
                    "Information Technology",
                    "Mathematics",
                    "Urdu",
                    "English",
                    "Physics",
                    "Chemistry",
                    "Botany",
                    "Islamiat",
                  ].map((d) => (
                    <option key={d} value={d} className="bg-slate-900">
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Password Fields */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-white/60 uppercase tracking-widest ml-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-white/20"
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-white/60 uppercase tracking-widest ml-1">
                  Confirm
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-white/20"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full bg-white text-black font-bold py-4 rounded-2xl hover:bg-blue-50 active:scale-[0.98] transition-all duration-200 shadow-xl mt-6 disabled:opacity-50 text-sm"
            >
              {loading ? "Creating Account..." : "Register Now"}
            </button>

            <p className="text-center text-white/50 text-sm mt-6">
              Already have an account?{" "}
              <Link to="/" className="text-white font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
