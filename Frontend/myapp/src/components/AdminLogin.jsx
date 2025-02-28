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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[#FF8DA1] via-[#FFC2BA] to-[#AD56C4]">
      <div className="w-full max-w-md p-8 bg-white shadow-2xl rounded-3xl dark:bg-gray-900">
        <h2 className="text-3xl font-extrabold text-center text-[#AD56C4] dark:text-white">Admin Login</h2>
        
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-3 mt-1 text-gray-800 bg-[#FF9CE9] border border-[#AD56C4] rounded-xl dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#AD56C4]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-3 mt-1 text-gray-800 bg-[#FFC2BA] border border-[#FF8DA1] rounded-xl dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#FF8DA1]"
            />
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 font-bold text-white bg-[#AD56C4] rounded-xl hover:bg-[#FF8DA1] transition duration-300 focus:outline-none focus:ring-4 focus:ring-[#FF9CE9]"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          <a href="#" className="text-[#AD56C4] hover:underline">Forgot password?</a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
