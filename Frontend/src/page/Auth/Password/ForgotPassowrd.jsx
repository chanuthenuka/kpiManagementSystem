import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting email:", email);
  };

  const handleBack = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-700 to-white p-4">
      <div className="bg-white/95 backdrop-blur-md p-6 sm:p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-xl relative">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 flex items-center space-x-2 bg-black text-white px-3 py-2 rounded-full font-medium transition-all duration-300"
        >
          <FaArrowLeft className="text-sm" />
          <span className="text-sm">Back to Login</span>
        </button>

        {/* Header */}
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mt-10">
          Forgot Password
        </h2>
        <h3 className="text-center text-gray-600 mt-3 sm:mt-4 text-base sm:text-lg max-w-md mx-auto">
          Enter your email to receive a verification code.
        </h3>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-10 sm:mt-12 space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-gray-700 font-medium">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300"
              placeholder="Enter your email"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-8 bg-black text-white py-3 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-black"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;