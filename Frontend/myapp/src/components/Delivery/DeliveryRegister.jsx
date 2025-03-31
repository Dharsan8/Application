import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DeliveryRegister = () => {
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

      alert(response.data.message);
      navigate("/delivery-login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-[#8A4F7D] mb-6 text-center">Delivery Person Registration</h2>
        
        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A4F7D]"
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
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A4F7D]"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A4F7D]"
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
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A4F7D]"
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
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A4F7D]"
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
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A4F7D]"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1">Aadhar Card Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "aadhar")}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A4F7D]"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1">Driving License Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "license")}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A4F7D]"
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
              onClick={() => navigate("/delivery-login")}
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