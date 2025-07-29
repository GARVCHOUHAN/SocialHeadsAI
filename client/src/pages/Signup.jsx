

// --- frontend/src/pages/SignupPage.jsx ---
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const SignupPage = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/signup`, form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-4 text-white text-center">Create Account</h1>
        <form onSubmit={handleSignup} className="space-y-6">
            {error && <div className="text-red-400 text-center p-2 bg-red-500/10 rounded">{error}</div>}
            <input
              className="border border-gray-700 bg-gray-900 text-white p-3 w-full rounded-lg focus:ring-2 focus:ring-indigo-500"
              name="name" placeholder="Name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required
            />
            <input
              className="border border-gray-700 bg-gray-900 text-white p-3 w-full rounded-lg focus:ring-2 focus:ring-indigo-500"
              name="email" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required
            />
            <input
              className="border border-gray-700 bg-gray-900 text-white p-3 w-full rounded-lg focus:ring-2 focus:ring-indigo-500"
              name="password" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} required
            />
            <button type="submit" className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700">
              Sign Up
            </button>
        </form>
        <p className="text-center mt-4 text-gray-400">
            Already have an account? <Link to="/login" className="text-indigo-400 hover:underline">Log In</Link>
        </p>
      </div>
    </div>
  );
};
export default SignupPage;
