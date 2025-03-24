import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
        const { customer } = response.data;
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
    <div className="min-h-screen bg-gradient-to-br from-[#FAD961] to-[#F76B1C] text-gray-900 flex flex-col items-center p-6">
      <h2 className="text-4xl font-bold text-[#8A4F7D] text-center mt-16">{isLogin ? 'Login to Your Account' : 'Create a New Account'}</h2>
      <p className="text-lg text-gray-800 text-center mt-2 max-w-xl">{isLogin ? "Don't have an account?" : 'Already have an account?'} <span className="text-[#8A4F7D] cursor-pointer" onClick={() => setIsLogin(!isLogin)}>{isLogin ? 'Register here' : 'Login here'}</span></p>

      <div className="bg-white text-gray-900 p-8 mt-10 rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex mb-8">
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
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
                className="w-full p-3 mt-1 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F76B1C]"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full p-3 mt-1 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F76B1C]"
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
              className="w-full p-3 mt-1 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F76B1C]"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                required
                className="w-full p-3 mt-1 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F76B1C]"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full p-3 font-bold text-white bg-[#8A4F7D] rounded-lg hover:bg-[#F76B1C] transition duration-300 focus:outline-none focus:ring-2 focus:ring-[#F76B1C]"
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
