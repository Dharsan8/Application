import React from 'react';
import { useNavigate } from 'react-router-dom';
//import heroImage from '../assets/images/heroback.jpg';
import heroImage from "/src/assets/images/heroback.jpg";


export default function RestaurantRegister() {
  const navigate = useNavigate();
  const [step, setStep] = React.useState(1);
  const [formData, setFormData] = React.useState({
    restaurantName: "",
    location: "",
    restaurantNumber: "",
    ownerName: "",
    phoneNumber: "",
    address: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/restaurants/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      alert(data.message);
      alert(" Please wait for admin approval.");
      navigate('/restaurant-login'); // Redirect to login page after successful registration
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
            <input className="w-full p-3 my-2 rounded border border-gray-300" name="restaurantName" placeholder="Restaurant Name" onChange={handleChange} />
            <input className="w-full p-3 my-2 rounded border border-gray-300" name="location" placeholder="Location" onChange={handleChange} />
            <input className="w-full p-3 my-2 rounded border border-gray-300" name="restaurantNumber" placeholder="Restaurant Number" onChange={handleChange} />
            <button onClick={nextStep} className="w-full bg-[#8A4F7D] text-white p-3 rounded-lg font-bold">Next</button>
          </div>
        )}
        {step === 2 && (
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-[#F76B1C]">Owner Contact</h3>
            <input className="w-full p-3 my-2 rounded border border-gray-300" name="ownerName" placeholder="Owner Name" onChange={handleChange} />
            <input className="w-full p-3 my-2 rounded border border-gray-300" name="phoneNumber" placeholder="Phone Number" onChange={handleChange} />
            <input className="w-full p-3 my-2 rounded border border-gray-300" name="address" placeholder="Address" onChange={handleChange} />
            <div className="flex justify-between mt-4">
              <button onClick={prevStep} className="bg-gray-400 text-white p-3 rounded-lg font-bold">Back</button>
              <button onClick={nextStep} className="bg-[#8A4F7D] text-white p-3 rounded-lg font-bold">Next</button>
            </div>
          </div>
        )}
        {step === 3 && (
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-[#F76B1C]">Login Details</h3>
            <input className="w-full p-3 my-2 rounded border border-gray-300" name="email" type="email" placeholder="Email" onChange={handleChange} />
            <input className="w-full p-3 my-2 rounded border border-gray-300" name="password" type="password" placeholder="Password" onChange={handleChange} />
            <div className="flex justify-between mt-4">
              <button onClick={prevStep} className="bg-gray-400 text-white p-3 rounded-lg font-bold">Back</button>
              <button onClick={handleSubmit} className="bg-[#F76B1C] text-white p-3 rounded-lg font-bold">Submit</button>
            </div>
          </div>
        )}
      </div>
      
      <p className="mt-6 text-lg text-gray-900">Already have an account? 
        <button onClick={() => navigate('/restaurant-login')} className="text-[#8A4F7D] font-bold ml-1 hover:underline">Click here to Login</button>
      </p>
    </div>

    
  );
}

// import React from 'react';
// import heroImage from '../assets/images/heroback.jpg';

// export default function RestaurantRegister() {
//   const [step, setStep] = React.useState(1);
//   const [formData, setFormData] = React.useState({
//     restaurantName: "",
//     location: "",
//     restaurantNumber: "",
//     ownerName: "",
//     phoneNumber: "",
//     address: "",
//     email: "",
//     password: ""
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async () => {
//     try {
//       const response = await fetch('http://localhost:3000/api/restaurants/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData)
//       });
//       const data = await response.json();
//       alert(data.message);
//     } catch (error) {
//       console.error("Error submitting form", error);
//     }
//   };
//   const nextStep = () => setStep(step + 1);
//   const prevStep = () => setStep(step - 1);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#FAD961] to-[#F76B1C] text-gray-900 flex flex-col items-center p-6">
//       {/* Hero title*/}
//       <div className="relative w-full h-56 flex flex-col justify-center items-center text-center text-white bg-[#8A4F7D] rounded-lg shadow-lg overflow-hidden">
//         <img src={heroImage} alt="Restaurant" className="absolute inset-0 w-full h-full object-cover opacity-30" />
//         <div className="relative z-10 max-w-3xl p-6">
//           <h1 className="text-5xl font-extrabold">Join Us & Grow Your Restaurant</h1>
//           <p className="text-lg mt-2">Expand your business with our exclusive platform. More customers, more revenue, more success.</p>
//         </div>
//       </div>
      
//       {/* Register Title */}
//       <h2 className="text-4xl font-bold text-[#8A4F7D] text-center mt-16">Restaurant Registration</h2>
//       <p className="text-lg text-gray-800 text-center mt-2 max-w-xl">Register your restaurant today and unlock exclusive features to enhance your business growth.</p>
      
//       {/* Form  */}
//       <div className="bg-white text-gray-900 p-6 mt-10 rounded-xl shadow-2xl w-full max-w-2xl transition-all duration-500 border border-gray-300 flex flex-col">
//         {step === 1 && (
//           <div className="animate-fade-in">
//             <h3 className="text-2xl font-semibold mb-4 text-[#F76B1C]">Business Details</h3>
//             <input className="w-full p-3 my-2 rounded border border-gray-300" name="restaurantName" placeholder="Restaurant Name" onChange={handleChange} />
//             <input className="w-full p-3 my-2 rounded border border-gray-300" name="location" placeholder="Location" onChange={handleChange} />
//             <input className="w-full p-3 my-2 rounded border border-gray-300" name="restaurantNumber" placeholder="Restaurant Number" onChange={handleChange} />
//             <button onClick={nextStep} className="w-full bg-[#8A4F7D] hover:bg-[#6A3B5B] text-white p-3 rounded-lg font-bold transition-all">Next</button>
//           </div>
//         )}
//         {step === 2 && (
//           <div className="animate-slide-in">
//             <h3 className="text-2xl font-semibold mb-4 text-[#F76B1C]">Owner Contact</h3>
//             <input className="w-full p-3 my-2 rounded border border-gray-300" name="ownerName" placeholder="Owner Name" onChange={handleChange} />
//             <input className="w-full p-3 my-2 rounded border border-gray-300" name="phoneNumber" placeholder="Phone Number" onChange={handleChange} />
//             <input className="w-full p-3 my-2 rounded border border-gray-300" name="address" placeholder="Address" onChange={handleChange} />
//             <div className="flex justify-between mt-4">
//               <button onClick={prevStep} className="bg-gray-400 hover:bg-gray-500 text-white p-3 rounded-lg font-bold transition-all">Back</button>
//               <button onClick={nextStep} className="bg-[#8A4F7D] hover:bg-[#6A3B5B] text-white p-3 rounded-lg font-bold transition-all">Next</button>
//             </div>
//           </div>
//         )}
//         {step === 3 && (
//           <div className="animate-fade-in-up">
//             <h3 className="text-2xl font-semibold mb-4 text-[#F76B1C]">Login Details</h3>
//             <input className="w-full p-3 my-2 rounded border border-gray-300" name="email" type="email" placeholder="Email" onChange={handleChange} />
//             <input className="w-full p-3 my-2 rounded border border-gray-300" name="password" type="password" placeholder="Password" onChange={handleChange} />
//             <div className="flex justify-between mt-4">
//               <button onClick={prevStep} className="bg-gray-400 hover:bg-gray-500 text-white p-3 rounded-lg font-bold transition-all">Back</button>
//               <button onClick={handleSubmit} className="bg-[#F76B1C] hover:bg-[#D45A14] text-white p-3 rounded-lg font-bold transition-all">Submit</button>
//             </div>
//           </div>
//         )}
//       </div>
      
//       {/* Why u chhose us Section */}
//       <div className="mt-16 text-center max-w-6xl">
//         <h2 className="text-5xl font-bold text-[#8A4F7D]">Why You Choose Us?</h2>
//         <p className="text-xl text-gray-800 mt-6">We provide all the tools you need to succeed in the restaurant industry.</p>
//       </div>
//       <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl">
//         {['Boost Visibility', 'Smart Analytics', 'Menu Management', 'Marketing Support'].map((title, index) => (
//           <div key={index} className="bg-gradient-to-br from-[#F76B1C] to-[#8A4F7D] text-white p-6 rounded-lg shadow-xl hover:scale-105 transition-transform">
//             <h3 className="text-2xl font-bold">{title}</h3>
//             <p className="mt-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


















