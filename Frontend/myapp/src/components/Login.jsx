import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import biryaniImg from "../assets/images/biryaniImg.png"
import iceImg from "../assets/images/iceImg.png"
import juiceImg from "../assets/images/juiceImg.png"
import pizzaImg from "../assets/images/pizzaImg.png"

const foodImages = [
  { src: biryaniImg, delay: "2s" },
  { src: iceImg, delay: "4s"},
  { src: juiceImg, delay: "6s", },
  { src: pizzaImg, delay: "8s", },
];

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin ? 'http://localhost:3000/api/customer/login' : 'http://localhost:3000/api/customer/register';
    const data = isLogin ? { email, password } : { name, email, password, phone };


    try {
      const response = await axios.post(url, data);

      if (isLogin) {
        const { customer,token } = response.data;
        localStorage.setItem('userId', customer.id);
        localStorage.setItem('username', customer.name);
        localStorage.setItem('token', token);

        console.log(localStorage.getItem('userId'));
        alert("Login Successful");
        navigate(`/user/${customer.name}`);
      } else {
        alert("Registration Successful. Please Login.");
        setIsLogin(true);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'An error occurred');
    }

  };

  return (
<div className="relative min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-[#FFECD2] to-[#FCB69F]">


  {/* 📱 Mobile with animation */}
  <div className="hidden md:flex justify-center items-center w-1/2 relative bg-[#8A4F7D]">
    <div className="relative w-[220px] h-[440px] bg-black rounded-[2rem] p-4 overflow-hidden shadow-2xl">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-34 h-2 bg-gray-700 rounded-full mt-2"></div>

      {/* 🍕 Animated Food Drops */}
      <div className="absolute w-[100px] h-full flex flex-col items-center justify-start">
        {foodImages.map((item, idx) => (
          <FoodDrop key={idx} img={item.src} delay={item.delay}  />
        ))}
      </div>
      <div className="absolute bottom-4 text-white text-sm text-center font-semibold px-2">
            “Deliciousness Delivered Right to Your Door”
      </div>
    </div>
  </div>
  

      {/* Form */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 bg-white">
        <h2 className="text-4xl font-bold text-[#8A4F7D] text-center">{isLogin ? 'Customer Login' : 'Customer Registration'}</h2>
        <p className="text-lg text-gray-800 text-center mt-2 max-w-xl">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{" "}
          <span
            className="text-[#8A4F7D] font-semibold cursor-pointer"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Register here' : 'Login here'}
          </span>
        </p>

        <div className="bg-white text-gray-900 p-8 mt-8 rounded-xl shadow-2xl w-full max-w-md">
          <div className="flex mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 p-3 font-bold rounded-l-lg ${isLogin ? 'bg-[#8A4F7D] text-white' : 'bg-gray-200'}`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 p-3 font-bold rounded-r-lg ${!isLogin ? 'bg-[#8A4F7D] text-white' : 'bg-gray-200'}`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                  className="w-full p-3 mt-1 bg-gray-100 border border-gray-300 rounded-lg"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full p-3 mt-1 bg-gray-100 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full p-3 mt-1 bg-gray-100 border border-gray-300 rounded-lg"
              />
            </div>
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium">Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  required
                  className="w-full p-3 mt-1 bg-gray-100 border border-gray-300 rounded-lg"
                />
              </div>
            )}
            <button
              type="submit"
              className="w-full p-3 font-bold text-white bg-[#8A4F7D] rounded-lg hover:bg-[#F76B1C] transition duration-300"
            >
              {isLogin ? 'Login' : 'Register'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const FoodDrop = ({ img, delay }) => {
  return (
    <img
      src={img}
      alt="food"
      className="absolute top-[-60px] w-15 h-15 object-contain animate-fall"
      style={{
        left: "50%",
        transform: "translateX(-50%)",
        animationDelay: delay,
        animationIterationCount: "infinite",
        animationDuration: "8s",
      }}
    />
  );
};

export default Login;
