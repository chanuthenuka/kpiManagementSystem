import React from "react";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import logo from "../../../assets/Logo/logo.png";

const NavbarPos = () => {
  return (
    <nav
      className="flex items-center justify-between bg-gradient-to-r from-white to-black p-4 text-white shadow-lg fixed w-full top-0 z-50"
      role="navigation"
    >
      {/* Logo/Icon */}
      <div className="flex items-center gap-3 transition-transform hover:scale-105">
        <h1 className="text-2xl font-bold tracking-wide text-black">
          <img src={logo} alt="Company Logo" className="h-10" />
        </h1>
      </div>

      {/* Profile Section */}
      <div className="flex items-center gap-4 bg-black px-4 py-2 rounded-full transition-all">
        
        <span className="text-2xl font-medium">MetricHub</span>
      </div>
    </nav>
  );
};

export default NavbarPos;
