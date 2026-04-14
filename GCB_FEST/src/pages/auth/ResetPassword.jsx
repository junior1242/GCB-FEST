import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resetPasswordApi } from "../../api/authApi";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    setLoading(true);
    try {
      await resetPasswordApi(token, { password: formData.password });
      toast.success("Password updated! Please login.");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Link expired or invalid");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-slate-900">
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: `url('../../assets/wallpaperforProject.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 w-full max-w-[420px] px-6">
        <div className="backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl rounded-[2.5rem] p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-2xl mb-4 border border-green-500/30">
              <svg
                className="w-8 h-8 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              New Password
            </h1>
            <p className="text-white/60 mt-2 text-sm">
              Please enter your new secure password below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* New Password */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-green-400 uppercase tracking-wider ml-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                  placeholder="••••••••"
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-green-400 uppercase tracking-wider ml-1">
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                placeholder="••••••••"
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
              />
            </div>

            <div className="flex items-center ml-1">
              <input
                type="checkbox"
                id="show"
                className="rounded border-white/20 bg-white/5 text-green-500 focus:ring-0"
                onChange={() => setShowPassword(!showPassword)}
              />
              <label
                htmlFor="show"
                className="ml-2 text-sm text-white/50 cursor-pointer"
              >
                Show Passwords
              </label>
            </div>

            <button
              disabled={loading}
              className="w-full bg-white text-black font-bold py-4 rounded-xl active:scale-[0.98] transition-all duration-200 shadow-lg disabled:opacity-50 mt-4"
            >
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
