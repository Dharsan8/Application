import React, { useState } from "react";
import axios from "axios";

const Login = ({ onLoginSuccess, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignUp) {
      try {
        await axios.post("http://localhost:3000/api/customer/register", {
          name,
          email,
          password,
          phone,
        });
        alert("Signup Successful! You can now log in.");
        setIsSignUp(false);
      } catch (error) {
        alert(error.response?.data?.message || "Signup failed. Try again.");
      }
    } else {
      try {
        const res = await axios.post("http://localhost:3000/api/customer/login", {
          email,
          password,
        });
        localStorage.setItem("token", res.data.token);
        alert("Login successful!");
        onLoginSuccess(res.data.user);
      } catch (error) {
        alert(error.response?.data?.message || "Invalid credentials");
      }
    }
  };

  return (
    <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
      <h2 className="text-3xl font-semibold mb-6 text-teal-500 text-center">
        {isSignUp ? "Sign Up" : "Login"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignUp && (
          <>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-white">Name</label>
              <input
                type="text"
                value={name}
                placeholder="Enter your name"
                className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-800"
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-white">Phone</label>
              <input
                type="text"
                value={phone}
                placeholder="Enter your phone"
                className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-800"
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </>
        )}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-white">Email</label>
          <input
            type="email"
            value={email}
            placeholder="Enter your email"
            className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-800"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-white">Password</label>
          <input
            type="password"
            value={password}
            placeholder="Enter your password"
            className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-800"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full p-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition duration-300 font-semibold"
        >
          {isSignUp ? "Sign Up" : "Login"}
        </button>
      </form>
      <div className="mt-4 text-center">
        <p
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-teal-500 cursor-pointer"
        >
          {isSignUp
            ? "Already have an account? Login"
            : "Don't have an account? Sign Up"}
        </p>
        <button onClick={onClose} className="mt-2 text-gray-300 cursor-pointer">
          Close
        </button>
      </div>
    </div>
  );
};

export default Login;
