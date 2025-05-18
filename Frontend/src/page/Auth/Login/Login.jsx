import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // to redirect after login
import axios from "axios"; // Make sure to install axios using npm or yarn

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(
      "http://localhost:5000/api/employees/login",
      { email, password },
      { withCredentials: true }
    );

    if (res.data?.data) {
      console.log("Login success:");
      const { permissions, employeeId, roleId, roleName } = res.data.data;

      // Store all necessary data in localStorage
      localStorage.setItem("permissions", JSON.stringify(permissions));
      localStorage.setItem("employeeId", employeeId);
      localStorage.setItem("email", email);
      localStorage.setItem("roleId", roleId);
      localStorage.setItem("roleName", roleName);

      navigate("/first-page");
    }
  } catch (err) {
    console.error("Login error:", err);
    if (err.response?.data?.message) {
      setErrorMsg(err.response.data.message);
    } else {
      setErrorMsg("Something went wrong. Please try again.");
    }
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-700 to-white pt-16 md:pt-20">
      <div className="bg-white/95 backdrop-blur-md p-6 sm:p-8 md:p-10 rounded-3xl w-full max-w-md sm:max-w-lg md:max-w-xl transition-all duration-300 mx-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-black">
          Welcome Back
        </h2>
        <h3 className="text-center text-gray-600 mt-2 sm:mt-3 text-base sm:text-lg">
          Login to your account
        </h3>

        {errorMsg && (
          <div className="mt-4 text-red-600 text-sm text-center">
            {errorMsg}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-10 sm:mt-12 md:mt-14 flex flex-col items-center justify-center space-y-5 sm:space-y-6"
        >
          <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 sm:px-5 sm:py-4 bg-blue-50/50 border-2 border-gray rounded-2xl focus:outline-none focus:border-black focus:ring-2 focus:ring-blue-200 transition-all duration-300 peer placeholder-transparent"
              placeholder="Email"
            />
            <label className="absolute left-4 sm:left-5 -top-2 text-xs sm:text-sm text-black transition-all duration-300 bg-white px-1 sm:px-2">
              Email Address
            </label>
          </div>

          <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 sm:px-5 sm:py-4 bg-blue-50/50 border-2 border-blue-100 rounded-2xl focus:outline-none focus:border-black focus:ring-2 focus:ring-blue-200 transition-all duration-300 peer placeholder-transparent"
              placeholder="Password"
            />
            <label className="absolute left-4 sm:left-5 -top-2 text-xs sm:text-sm text-black transition-all duration-300 bg-white px-1 sm:px-2">
              Password
            </label>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center w-full max-w-xs sm:max-w-sm md:max-w-md space-y-3 sm:space-y-0">
            <label className="flex items-center text-gray-600 hover:text-black cursor-pointer transition-colors duration-300">
              <input
                type="checkbox"
                className="mr-2 rounded border-blue-200 text-black focus:ring-black"
              />
              <span className="text-sm sm:text-base">Remember me</span>
            </label>
            <a
              href="/fgtpassword"
              className="text-black text-sm hover:text-black-800 transition-colors duration-300"
            >
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full max-w-xs sm:max-w-sm md:max-w-md mt-10 sm:mt-6 bg-black text-white py-3 sm:py-4 rounded-2xl hover:bg-black-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-lg hover:shadow-blue-500/50"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
