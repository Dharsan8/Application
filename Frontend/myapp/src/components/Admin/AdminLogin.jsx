
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/admin/login", {
        email,
        password,
      });
      alert(response.data.message);
      localStorage.setItem("adminToken", response.data.token);
      navigate("/admin-dashboard");
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message || error.message);
      alert("Invalid credentials or server issue!");
    }
  };

  return (
<div className="min-h-screen bg-gradient-to-br from-[#FAD961] to-[#F76B1C] text-gray-900 flex flex-col items-center p-6">
  <h2 className="text-4xl font-bold text-[#8A4F7D] text-center mt-16">Admin Login</h2>
  <p className="text-lg text-gray-800 text-center mt-2 max-w-xl">
    Access your admin panel with secure credentials.
  </p>

  <div className="bg-white text-gray-900 p-8 mt-10 rounded-xl shadow-2xl w-full max-w-md">
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="w-full p-3 mt-1 text-gray-800 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F76B1C]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
          className="w-full p-3 mt-1 text-gray-800 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F76B1C]"
        />
      </div>

      <button
        type="submit"
        className="w-full p-3 font-bold text-white bg-[#8A4F7D] rounded-lg hover:bg-[#F76B1C] transition duration-300 focus:outline-none focus:ring-2 focus:ring-[#F76B1C]"
      >
        Login
      </button>
    </form>

    <div className="mt-4 text-center text-sm text-gray-600">
      <a href="#" className="text-[#8A4F7D] hover:underline">Forgot password?</a>
    </div>
  </div>
</div>
  );
};

export default AdminLogin;
