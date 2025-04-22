import React, { useState } from "react";
import DeliveryRegister from "./DeliveryRegister";
import DeliveryLogin from "./DeliveryLogin";
import deliveryImg from "../../assets/images/delivery_manBac.png"
import locationImg from "../../assets/images/locationImg.png"

const DeliveryAuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => 
    setIsLogin((prev) => !prev);



  return (
    <div className="relative min-h-screen bg-gray-100 flex items-center justify-center p-4 overflow-hidden">
<div className="absolute left-8 top-16 z-10 max-w-sm text-[#222] space-y-6">
  {/* Headline */}
  <div className="text-3xl font-extrabold leading-tight tracking-tight text-[#8A4F7D] drop-shadow-md">
  Log In. Gear Up. 
  <br /> Go Places.
  </div>

  {/* Highlight Box */}
  <div className="relative p-4 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border-l-4 border-[#8A4F7D]">
    <div className="text-lg font-semibold text-[#333]">
      Join the movement of modern delivery partners.
    </div>
    <div className="mt-1 text-sm text-gray-600 leading-relaxed">
      Be your own boss, set your schedule, and ride with purpose. 
      Our platform empowers everyday heroes with real earnings and flexible freedom.
    </div>
    <div className="absolute -top-4 -left-4 bg-[#8A4F7D] text-white px-3 py-1 text-xs rounded-full shadow-md">
      🚴‍♂️ Partner Life
    </div>
  </div>

  {/* Decorative tagline */}
  <div className="text-xs text-gray-500 italic pl-2 border-l-2 border-[#8A4F7D]/60">
  Every Hustle Needs a Road. This One’s Yours.
  </div>
</div>


      {/* Zigzag path with location icons */}
      <div className="absolute inset-0 z-0 pointer-events-none">
      <svg
  className="w-full h-full absolute"
  viewBox="0 0 1000 800"
  preserveAspectRatio="none"
>
  <path
    id="deliveryPath"
    d="M 50 740
       C 200 600, 300 600, 400 500 
       S 600 300, 700 300 
       S 900 200, 999 120"
    fill="none"
    stroke="#8A4F7D"
    strokeWidth="4"
    strokeDasharray="12 6"
  />

<g transform="translate(0, -60)">
    <image
      href={deliveryImg}
      width="60"
      height="60"
    >
      <animateMotion
        dur="10s"
        repeatCount="indefinite"
        rotate="auto"
      >
        <mpath href="#deliveryPath" />
      </animateMotion>
    </image>
  </g>
</svg>

        {/* Start location icon */}
        <img
  src={locationImg}
  alt="Start Location"
  className="absolute left-[32px] bottom-[32px] w-8 h-8"
/>

        {/* End location icon */}
        <img
  src={locationImg}
  alt="End Location"
  className="absolute right-[2px] top-[72px] w-8 h-8"
/>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-lg w-full max-w-md z-10">
        <div className="flex justify-center mb-4">
          <button
            onClick={() => setIsLogin(true)}
            className={`px-4 py-1 rounded-l-lg text-sm font-semibold ${
              isLogin
                ? "bg-[#8A4F7D] text-white cursor-default"
                : "bg-gray-200 text-[#8A4F7D] hover:bg-gray-300"
            }`}
            disabled={isLogin}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`px-4 py-1 rounded-r-lg text-sm font-semibold ${
              !isLogin
                ? "bg-[#8A4F7D] text-white cursor-default"
                : "bg-gray-200 text-[#8A4F7D] hover:bg-gray-300"
            }`}
            disabled={!isLogin}
          >
            Register
          </button>
        </div>
        {isLogin 
    ? <DeliveryLogin embedded onToggle={toggleForm} /> 
    : <DeliveryRegister embedded onToggle={toggleForm} />
  }
      </div>

    </div>
  );
};

export default DeliveryAuthPage;