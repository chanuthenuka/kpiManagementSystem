import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const storedPermissions = localStorage.getItem("permissions");
    if (storedPermissions) {
      setPermissions(JSON.parse(storedPermissions));
    }
  }, []);

  const [roleId, setRoleId] = useState(localStorage.getItem("roleId"));

  useEffect(() => {
    const interval = setInterval(() => {
      const storedRoleId = localStorage.getItem("roleId");
      if (storedRoleId !== roleId) {
        setRoleId(storedRoleId);
      }
    }, 500); // check every 0.5 seconds

    return () => clearInterval(interval);
  }, [roleId]);

  const hasPermission = (requiredPermission) => {
    return permissions.includes(requiredPermission);
  };

  const navItems = [
    {
      path: "/manager-emp",
      label: "Performance Ratings",
      permission: "Rate Employees",
    },
    {
      path: "/manage-emp",
      label: "Employee Management",
      permission: "Register Users",
    },
    { path: "/manage-kpi", 
      label: "Manage KPIs", 
      permission: "Manage KPIs" 
    },
    { path: "/manage-kra", 
      label: "Manage KRAS", 
      permission: "Manage Kra" 
    },
    {
      path: "/manage-Competenice",
      label: "Manage Competencies",
      permission: "Manage Competencies",
    },
    {
      path: "/manage-department",
      label: "Manage Department",
      permission: "department",
    },
    {
      path: "/hod-emp",
      label: "HOD Employee",
      permission: "HOD Employee View",
    },
    {
      path: "/hod-ratingApproval",
      label: "Rating Approvals",
      permission: "Approve Ratings",
    },

    {
      path: "/assign-Manager",
      label: "Assign Manager",
      permission: "Manage Users",
    },
    {
      path: "/view-rating",
      label: "View Ratings",
      permission: "View Ratings",
    },
    {
      path: "/emp-emp",
      label: "Employee",
      permission: "View Employee Performance",
    }, // general access
    // { path: "/on-rate", label: "On Ratings", permission: "Rate Trainees" },
    {
      path: "/hod-emp",
      label: "HOD Employee",
      permission: "HOD Employee View",
    },
    {
      path: "/rate-managers",
      label: "Rate Managers",
      permission: "Rate Managers",
    },
    {
      path: "/hod-ratingApproval",
      label: "HOD Rating Approvals",
      permission: "Approve KPI Changes HOD",
    },
    {
      path: "/view-all-ratings",
      label: "View All Ratings",
      permission: "View All Ratings",
    },
    {
      path: "/manager-emp",
      label: "HR Employee Rating",
      permission: "HR Rating",
    },
    {
      path: "/hod-kpichanges",
      label: "Request KPI Changes",
      permission: "Request KPI Changes",
    },

    {
      path: "/report",
      label: "Reports",
      permission: "Report Generation",
    },
  ];

  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  const handleLogoutConfirm = () => {
    setIsLogoutConfirmOpen(false);
    localStorage.removeItem("permissions");
    localStorage.removeItem("roleId");
    navigate("/login");
    alert("Admin logged out successfully!");
  };

  const roleBackgrounds = {
    1: "from-emerald-900 to-green-800", // Deep Emerald
    2: "from-neutral-900 to-gray-700", // Charcoal Gray
    3: "from-indigo-900 to-blue-800", // Royal Navy
    4: "from-purple-950 to-fuchsia-800", // Regal Purple
    5: "from-amber-950 to-yellow-800", // Golden Bronze
    6: "from-slate-900 to-zinc-800", // Obsidian Slate
  };

  return (
    <div
      className={`min-w-[280px] p-6 bg-gradient-to-b ${
        roleBackgrounds[roleId] || "from-black to-gray-900"
      } h-screen flex flex-col shadow-xl overflow-hidden`}
    >
      {" "}
      <ul className="list-none p-0 space-y-2 mt-20">
        {navItems
          .filter((item) => hasPermission(item.permission))
          .map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li
                key={item.path}
                className="transition-all duration-300 ease-out"
              >
                <a
                  href={item.path}
                  className={`px-4 py-3 rounded-lg w-full h-14 flex items-center relative ${
                    isActive
                      ? "bg-gray-800 text-white shadow-lg shadow-black/40"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-0 h-full w-1 bg-gray-600 rounded-r-md" />
                  )}
                  {item.label}
                </a>
              </li>
            );
          })}
      </ul>
      <div className="mt-auto space-y-3">
        <button
          onClick={() => setIsLogoutConfirmOpen(true)}
          className="w-full px-4 py-3 mb-24 bg-gray-800 text-white rounded-2xl hover:bg-gray-700 transition-all duration-300 focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 shadow-md hover:shadow-lg"
        >
          Log out
        </button>
      </div>
      {isLogoutConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-800">
            <h2 className="text-2xl font-extrabold text-white mb-8 text-center tracking-tight">
              Confirm Logout
            </h2>
            <p className="text-gray-400 mb-8 text-center font-medium">
              Are you sure you want to log out as Admin?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsLogoutConfirmOpen(false)}
                className="px-6 py-3 text-gray-400 hover:text-white font-medium rounded-2xl transition-all duration-300 hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-8 rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Confirm Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
