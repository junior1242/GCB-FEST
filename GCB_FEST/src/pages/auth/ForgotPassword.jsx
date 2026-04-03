import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { forgotPasswordApi } from "../../api/authApi"; // Ensure this path matches your project structure
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    rollNumber: "",
    newPassword: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await forgotPasswordApi(form);
      console.log("API Response:", res);
      const successMsg =
        res?.data?.message || res?.message || "Password updated successfully!";

      toast.success(successMsg);
      navigate("/");
    } catch (err) {
      console.error("API Error:", err);

      const errorMsg =
        err.response?.data?.message || err.message || "Something went wrong";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center overflow-hidden bg-slate-900">
      {/* Background Image - Same as Login */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('../../assets/wallpaperforProject.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 w-full max-w-[400px] px-4 py-6 max-h-screen overflow-y-auto">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-[2rem] p-6 md:p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-xl mb-3 border border-white/20">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1V7a2 2 0 012-2h4a2 2 0 012 2v2h4a2 2 0 012 2z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Reset Password
            </h1>
            <p className="text-white/50 text-sm">
              Verify your identity to proceed
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-white/70 ml-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/10 transition-all text-sm"
                placeholder="name@example.com"
              />
            </div>

            {/* Roll Number Field */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-white/70 ml-1">
                Roll Number / Admin ID
              </label>
              <input
                type="text"
                name="rollNumber"
                required
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/10 transition-all text-sm"
                placeholder="Enter your ID"
              />
            </div>

            {/* New Password Field */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-white/70 ml-1">
                New Password
              </label>
              <div className="relative flex items-center group">
                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  required
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/10 transition-all text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-white/30 hover:text-white"
                >
                  {showPassword ? (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-blue-50 active:scale-[0.98] transition-all duration-200 shadow-lg mt-2 disabled:opacity-50 text-sm"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>

            <p className="text-center text-white/50 text-sm">
              Remembered?{" "}
              <Link
                to="/login"
                className="text-white font-bold hover:underline"
              >
                Back to Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
