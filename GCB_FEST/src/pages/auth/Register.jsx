import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../api/authApi";
import toast from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student", // fixed role
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await registerUser(form);
      toast.success("Student registered successfully!");
      navigate("/"); // redirect to login
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 w-full max-w-md mx-auto bg-white p-6 rounded shadow"
    >
      <h2 className="text-2xl font-bold text-center">Register Student</h2>

      <input
        type="text"
        name="name"
        placeholder="Full Name"
        className="w-full border p-2 rounded"
        onChange={handleChange}
        required
      />

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

      <input type="hidden" name="role" value="student" />

      <button className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
        Register
      </button>
    </form>
  );
}
