import React, { useState, useEffect } from "react";
import Sidebar from "../../../../components/Dash/Sidebar/Sidebar";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AssignManager = () => {
  const [employees, setEmployees] = useState([]);
  const [managers, setManagers] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedManager, setSelectedManager] = useState("");
  const [data, setData] = useState([]);
  const [userRoleId, setUserRoleId] = useState(null);

  useEffect(() => {
    // Retrieve roleId from localStorage
    const roleId = localStorage.getItem("roleId");
    if (roleId) {
      setUserRoleId(parseInt(roleId, 10)); // Convert to number
    } else {
      console.warn("No roleId found in localStorage");
      setUserRoleId(0); // Fallback to default behavior
      toast.error("User role not found. Using default settings.");
    }
  }, []);

  useEffect(() => {
  const fetchEmployees = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/employees", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch employees");

      const result = await res.json();

      let employeeRoleId = 1; // Default
      let managerRoleId = 2; // Default

      if (userRoleId === 6) {
        employeeRoleId = 4;
        managerRoleId = 5;
      } else if (userRoleId === 3) {
        employeeRoleId = 1;
        managerRoleId = 2;
      }

      const filteredEmployees = result.filter(
        (emp) => emp.roleId === employeeRoleId
      );
      const filteredManagers = result.filter(
        (emp) => emp.roleId === managerRoleId
      );

      setEmployees(filteredEmployees);
      setManagers(filteredManagers);
    } catch (err) {
      console.error("Error fetching employees:", err);
      toast.error("Failed to fetch employees");
    }
  };

  if (userRoleId !== null) {
    fetchEmployees();
  }
}, [userRoleId]);


  const fetchAssignments = async () => {
  try {
    const res = await axios.get(
      "http://localhost:5000/api/manager-employees/getEmployeesByManagerId",
      { withCredentials: true }
    );
    setData(res.data);
  } catch (err) {
    console.error("Error fetching manager-employee data:", err);
    toast.error("Failed to fetch manager-employee data");
  }
};

useEffect(() => {
  fetchAssignments();
}, []);


  const handleClearSelection = () => {
    setSelectedEmployees([]);
    setSelectedManager("");
  };

  const handleEmployeeCheckbox = (employeeId) => {
    if (selectedEmployees.includes(employeeId)) {
      setSelectedEmployees(selectedEmployees.filter((id) => id !== employeeId));
    } else {
      setSelectedEmployees([...selectedEmployees, employeeId]);
    }
  };

  const handleRemove = async (managerId, employeeId) => {
  try {
    const res = await fetch("http://localhost:5000/api/manager-employees", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",  // Include cookies if your backend uses session auth
      body: JSON.stringify({ managerId, employeeId }),
    });

    if (!res.ok) throw new Error("Failed to delete assignment");

    const data = await res.json();
    console.log("Delete success:", data);
    toast.success("Assignment removed");
    fetchAssignments(); // Refresh the table after deletion
  } catch (err) {
    console.error("Delete failed:", err);
    toast.error("Failed to remove assignment");
  }
};


  const handleAssign = async () => {
  if (!selectedManager || selectedEmployees.length === 0) {
    toast.warn("Please select both a manager and at least one employee");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/manager-employees", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        managerId: selectedManager,
        employeeIds: selectedEmployees,
      }),
    });

    if (!res.ok) throw new Error("Failed to assign employees");

    const data = await res.json();
    toast.success("Employees assigned successfully");

    fetchAssignments(); // Refresh list
    handleClearSelection(); // Reset form
  } catch (err) {
    console.error("Error assigning employees:", err);
    toast.error("Assignment failed");
  }
};


  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      <Sidebar />
      <div className="flex-1 p-6 md:p-10">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center md:text-left font-sans">
            Assign Managers
          </h1>

          {/* Side-by-Side Layout */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Bulk Assignment Form */}
            <div className="flex-1 bg-gray-50 rounded-xl p-6 shadow-sm">
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Search Employees
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search employees..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white text-gray-800 placeholder-gray-400 transition-all duration-300"
                  />
                  <svg
                    className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>

                <div className="overflow-x-auto mt-4">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                    <thead>
                      <tr className="bg-gray-100 border-b">
                        <th className="py-3 px-4 text-left text-gray-600 font-semibold">
                          Name
                        </th>
                        <th className="py-3 px-4 text-center text-gray-600 font-semibold">
                          Select
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.length > 0 ? (
                        employees.map((emp, index) => (
                          <tr
                            key={emp.employeeId}
                            className={`border-b ${
                              index % 2 === 0 ? "bg-gray-50" : "bg-white"
                            } hover:bg-gray-100 transition-colors`}
                          >
                            <td className="py-3 px-4 text-gray-700">
                              {emp.fullName}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <input
                                type="checkbox"
                                className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                checked={selectedEmployees.includes(
                                  emp.employeeId
                                )}
                                onChange={() =>
                                  handleEmployeeCheckbox(emp.employeeId)
                                }
                              />
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="2"
                            className="py-3 px-4 text-center text-gray-500"
                          >
                            No employees available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="manager"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Select Manager
                  </label>
                  <select
                    id="manager"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white text-gray-800 transition-all duration-300"
                    value={selectedManager}
                    onChange={(e) => setSelectedManager(e.target.value)}
                  >
                    <option value="">Choose a Manager</option>
                    {managers.length > 0 ? (
                      managers.map((manager) => (
                        <option
                          key={manager.employeeId}
                          value={manager.employeeId}
                        >
                          {manager.fullName}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        No managers available
                      </option>
                    )}
                  </select>
                </div>
                <div className="flex gap-4">
                  <button
                    className="flex-1 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                    onClick={handleAssign}
                  >
                    Assign Selected
                  </button>
                  <button
                    className="flex-1 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                    onClick={handleClearSelection}
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            </div>

            {/* All Employees Table */}
            <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Employee Assignments
              </h2>
              <div className="overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-gray-100 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">
                        Employee
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">
                        Manager
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.length > 0 ? (
                      data.map((item, index) => (
                        <tr
                          key={item.employeeId || index}
                          className={
                            index % 2 === 0
                              ? "bg-white hover:bg-blue-50"
                              : "bg-gray-50 hover:bg-blue-50"
                          }
                        >
                          <td className="px-4 py-3 text-sm text-gray-800 font-medium">
                            {item.employeeName || "Unknown"}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-800">
                            {item.managerName || "Not Assigned"}
                          </td>
                          <td className="px-4 py-3 text-sm flex space-x-2">
                            <button
                              onClick={() => handleRemove(item.managerId, item.employeeId) }
                              className="text-red-500 hover:text-red-700" >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="3"
                          className="px-4 py-3 text-center text-gray-500"
                        >
                          No assignments available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignManager;
