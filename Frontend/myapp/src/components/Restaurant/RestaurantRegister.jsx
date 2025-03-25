import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import heroImage from "/src/assets/images/heroback.jpg";

export default function RestaurantRegister() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    restaurantName: "",
    location: "",
    restaurantNumber: "",
    ownerName: "",
    phoneNumber: "",
    address: "",
    email: "",
    password: "",
  });
  const [image, setImage] = useState(null);

  // Handle text input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async () => {
    const formDataWithImage = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataWithImage.append(key, formData[key]);
    });
    if (image) {
      formDataWithImage.append("restaurantImage", image);
    }
    
    try {
      const response = await fetch("http://localhost:3000/api/restaurants/register", {
        method: "POST",
        body: formDataWithImage, // Send as FormData
      });
  
      const data = await response.json();
      alert(data.message);
      navigate("/restaurant-login");
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };
  

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAD961] to-[#F76B1C] text-gray-900 flex flex-col items-center p-6">
      <div className="relative w-full h-56 flex flex-col justify-center items-center text-center text-white bg-[#8A4F7D] rounded-lg shadow-lg overflow-hidden">
        <img src={heroImage} alt="Restaurant" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="relative z-10 max-w-3xl p-6">
          <h1 className="text-5xl font-extrabold">Join Us & Grow Your Restaurant</h1>
          <p className="text-lg mt-2">Expand your business with our exclusive platform.</p>
        </div>
      </div>

      <h2 className="text-4xl font-bold text-[#8A4F7D] text-center mt-16">Restaurant Registration</h2>
      <p className="text-lg text-gray-800 text-center mt-2 max-w-xl">Register your restaurant today and unlock exclusive features.</p>

      <div className="bg-white text-gray-900 p-6 mt-10 rounded-xl shadow-2xl w-full max-w-2xl">
        {step === 1 && (
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-[#F76B1C]">Business Details</h3>
            <input className="w-full p-3 my-2 rounded border border-gray-300" name="restaurantName" placeholder="Restaurant Name" value={formData.restaurantName} onChange={handleChange} />
            <input className="w-full p-3 my-2 rounded border border-gray-300" name="location" placeholder="Location" value={formData.location} onChange={handleChange} />
            <input className="w-full p-3 my-2 rounded border border-gray-300" name="restaurantNumber" placeholder="Restaurant Number" value={formData.restaurantNumber} onChange={handleChange} />
            <label className="block mt-4 text-[#F76B1C] font-semibold">Upload Restaurant Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} className="w-full p-3 my-2 rounded border border-gray-300" />
            <button onClick={nextStep} className="w-full bg-[#8A4F7D] text-white p-3 rounded-lg font-bold">Next</button>
          </div>
        )}
        {step === 2 && (
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-[#F76B1C]">Owner Contact</h3>
            <input className="w-full p-3 my-2 rounded border border-gray-300" name="ownerName" placeholder="Owner Name" value={formData.ownerName} onChange={handleChange} />
            <input className="w-full p-3 my-2 rounded border border-gray-300" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} />
            <input className="w-full p-3 my-2 rounded border border-gray-300" name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
            <div className="flex justify-between mt-4">
              <button onClick={prevStep} className="bg-gray-400 text-white p-3 rounded-lg font-bold">Back</button>
              <button onClick={nextStep} className="bg-[#8A4F7D] text-white p-3 rounded-lg font-bold">Next</button>
            </div>
          </div>
        )}
        {step === 3 && (
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-[#F76B1C]">Login Details</h3>
            <input className="w-full p-3 my-2 rounded border border-gray-300" name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} />
            <input className="w-full p-3 my-2 rounded border border-gray-300" name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} />
            <div className="flex justify-between mt-4">
              <button onClick={prevStep} className="bg-gray-400 text-white p-3 rounded-lg font-bold">Back</button>
              <button onClick={handleSubmit} className="bg-[#F76B1C] text-white p-3 rounded-lg font-bold">Submit</button>
            </div>
          </div>
        )}
      </div>

      <p className="mt-6 text-lg text-gray-900">
        Already have an account?
        <button onClick={() => navigate("/restaurant-login")} className="text-[#8A4F7D] font-bold ml-1 hover:underline">
          Click here to Login
        </button>
      </p>
    </div>
  );
}
