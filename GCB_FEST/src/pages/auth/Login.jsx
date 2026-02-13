import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = await login(form);
      toast.success("Login Successful");

      if (user.role === "admin") navigate("/admin/dashboard");
      else navigate("/student/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 w-full max-w-md mx-auto bg-white p-6 rounded shadow"
    >
      <h2 className="text-2xl font-bold text-center">Login</h2>

      <input
        type="email"
        name="email"
        placeholder="Email"
        className="w-full border p-2 rounded"
        onChange={handleChange}
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        className="w-full border p-2 rounded"
        onChange={handleChange}
        required
      />

      <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
        Login
      </button>

      <p className="text-center text-gray-500">
        Don't have an account?{" "}
        <Link to="/register" className="text-blue-600 hover:underline">
          Register
        </Link>
      </p>
    </form>
  );
}
