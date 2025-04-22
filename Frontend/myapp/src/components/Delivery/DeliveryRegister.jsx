import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const DeliveryRegister = ({ embedded = false, onToggle}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    city: "",
    password: "",
  });
  const [aadharImage, setAadharImage] = useState(null);
  const [drivingLicenseImage, setDrivingLicenseImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (type === "aadhar") {
      setAadharImage(file);
    } else {
      setDrivingLicenseImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("location", formData.location);
      data.append("city", formData.city);
      data.append("password", formData.password);
      data.append("aadharImage", aadharImage);
      data.append("drivingLicenseImage", drivingLicenseImage);

      const response = await axios.post("http://localhost:3000/api/delivery/register", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-xs w-full bg-gradient-to-r from-[#8A4F7D] to-[#4B244A] shadow-lg rounded-xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 p-4 text-white`}
        >
          <div className="flex-1 w-0">
            <p className="text-sm font-semibold">🎉 Registration Successful</p>
            <p className="mt-1 text-sm">{response.data.message || "You're all set!"}</p>
          </div>
        </div>
      ), { duration: 6000 });
    
      if (onToggle) onToggle();
    } catch (err) {
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-xs w-full bg-gradient-to-r from-red-500 to-red-700 shadow-lg rounded-xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 p-4 text-white`}
        >
          <div className="flex-1 w-0">
            <p className="text-sm font-semibold">❌ Registration Failed</p>
            <p className="mt-1 text-sm">{err.response?.data?.message || "Something went wrong"}</p>
          </div>
        </div>
      ), { duration: 6000 });
    } finally {
      setLoading(false);
    }
  };

  return (
<div className={embedded ? "" : "min-h-screen bg-gray-100 flex items-center justify-center p-4"}>
<div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-[#8A4F7D] mb-6 text-center">Create Your Delivery Profile</h2>
        
        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[#8A4F7D]"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
               className="w-full px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[#8A4F7D]"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
                className="w-full px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[#8A4F7D]"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
                className="w-full px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[#8A4F7D]"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
               className="w-full px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[#8A4F7D]"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
               className="w-full px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[#8A4F7D]"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1">Aadhar Card Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "aadhar")}
                className="w-full px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[#8A4F7D]"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1">Driving License Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "license")}
               className="w-full px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[#8A4F7D]"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#8A4F7D] text-white py-2 rounded-lg hover:bg-[#7F5539] transition duration-300 disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Already registered?{" "}
            <button
              onClick={onToggle}
              className="text-[#8A4F7D] hover:underline"
            >
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeliveryRegister;