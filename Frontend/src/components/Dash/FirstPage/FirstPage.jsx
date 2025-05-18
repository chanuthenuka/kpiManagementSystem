import React from "react";
import logo from "../../../assets/logo/logo.png";
import Sidebar from "../../../components/Dash/Sidebar/Sidebar";

const FirstPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-200">
      {/* Sidebar on the left */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex items-center justify-center">
        <div className="relative text-center">
          {/* Logo Box - Positioned Behind */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10 bg-white px-4 py-2 rounded-lg w-30">
            <img src={logo} alt="logo" />
          </div>

          {/* MetricHub Text - Positioned in Front */}
          <div className="relative z-20 mt-6">
            <h1 className="text-9xl font-bold text-gray-900">
              Metric<span className="text-gray-900">Hub</span>
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstPage;
