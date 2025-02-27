import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    cuisine: "",
    role: "user",
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/register", user);
      alert("Registration successful!");
    } catch (error) {
      alert("Registration failed!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleRegister} className="flex flex-col space-y-3">
        <input
          type="text"
          placeholder="Name"
          className="p-2 border rounded"
          onChange={(e) => setUser({ ...user, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="p-2 border rounded"
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="p-2 border rounded"
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          required
        />
        <select
          onChange={(e) => setUser({ ...user, role: e.target.value })}
          className="p-2 border rounded"
          required
        >
          <option value="User">User</option>
          <option value="Restaurant">Restaurant</option>
        </select>

        {/* Show extra fields only if the role is "restaurant" */}
        {user.role === "restaurant" && (
          <>
            <input
              type="text"
              placeholder="Phone"
              className="p-2 border rounded"
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Address"
              className="p-2 border rounded"
              onChange={(e) => setUser({ ...user, address: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Cuisine Type"
              className="p-2 border rounded"
              onChange={(e) => setUser({ ...user, cuisine: e.target.value })}
              required
            />
          </>
        )}

        <button type="submit" className="bg-green-500 text-white p-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
