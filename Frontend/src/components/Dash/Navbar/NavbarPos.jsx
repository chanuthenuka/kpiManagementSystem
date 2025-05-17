import React, { useState, useEffect } from "react";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import logo from "../../../assets/Logo/logo.png";

const roleBackgrounds = {
  "1": "from-emerald-900 to-green-800",      // Deep Emerald
  "2": "from-neutral-900 to-gray-700",       // Charcoal Gray
  "3": "from-indigo-900 to-blue-800",        // Royal Navy
  "4": "from-purple-950 to-fuchsia-800",     // Regal Purple
  "5": "from-amber-950 to-yellow-800",       // Golden Bronze
  "6": "from-slate-900 to-zinc-800",         // Obsidian Slate
};

const NavbarPos = () => {
  const [roleId, setRoleId] = useState(localStorage.getItem("roleId"));

  useEffect(() => {
    const interval = setInterval(() => {
      const storedRoleId = localStorage.getItem("roleId");
      if (storedRoleId !== roleId) {
        setRoleId(storedRoleId);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [roleId]);

  return (
    <nav
      className={`flex items-center justify-between bg-gradient-to-r ${
        roleBackgrounds[roleId] || "from-white to-black"
      } p-4 text-white shadow-lg fixed w-full top-0 z-50`}
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
