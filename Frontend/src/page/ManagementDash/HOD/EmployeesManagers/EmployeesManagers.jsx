import React, { useState } from "react";
import Sidebar from "../../../../components/Dash/Sidebar/Sidebar";

const ManageEmployer = () => {
  // State for managers and their respective employees
  const [managers] = useState([
    {
      id: "MGR001",
      name: "Manager 1",
      employees: [
        {
          employeeId: "EMP001",
          name: "John Doe",
          kra: "Sales Growth",
          kpi: "Revenue Increase",
          rating: "85%",
          feedback: "Good performance",
          status: "pending",
          updatedRating: "",
        },
        {
          employeeId: "EMP002",
          name: "Jane Smith",
          kra: "Customer Retention",
          kpi: "Retention Rate",
          rating: "90%",
          feedback: "Excellent work",
          status: "pending",
          updatedRating: "",
        },
      ],
    },
    {
      id: "MGR002",
      name: "Manager 2",
      employees: [
        {
          employeeId: "EMP003",
          name: "Alex Brown",
          kra: "Operational Efficiency",
          kpi: "Process Time",
          rating: "78%",
          feedback: "Needs improvement",
          status: "pending",
          updatedRating: "",
        },
      ],
    },
  ]);

  const [selectedManager, setSelectedManager] = useState(managers[0].id); // Default to first manager
  const [selectedItems, setSelectedItems] = useState([]);
  const [employeeList, setEmployeeList] = useState(managers[0].employees); // Default employees of first manager

  // Handle manager dropdown change
  const handleManagerChange = (e) => {
    const managerId = e.target.value;
    setSelectedManager(managerId);
    const selectedManagerData = managers.find((mgr) => mgr.id === managerId);
    setEmployeeList(selectedManagerData.employees);
    setSelectedItems([]); // Reset selected items when manager changes
  };

  // Handle checkbox selection
  const handleCheckboxChange = (index) => {
    setSelectedItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // Handle Approve/Reject for selected employees
  const handleApprove = () => {
    const updatedList = [...employeeList];
    selectedItems.forEach((index) => {
      updatedList[index].status = "approved";
    });
    setEmployeeList(updatedList);
    setSelectedItems([]);
  };

  const handleReject = () => {
    const updatedList = [...employeeList];
    selectedItems.forEach((index) => {
      updatedList[index].status = "rejected";
    });
    setEmployeeList(updatedList);
    setSelectedItems([]);
  };

  // Handle rating updates
  const handleRatingChange = (index, value) => {
    const updatedList = [...employeeList];
    updatedList[index].updatedRating = value;
    setEmployeeList(updatedList);
  };

  // Filter pending employees
  const pendingEmployees = employeeList.filter((item) => item.status === "pending");

  return (
    <div className="flex min-h-screen bg-gray-200">
      <Sidebar />

      <div className="flex-1 p-6">
        <div className="w-full max-w-6xl bg-white rounded-lg shadow-md p-8 mx-auto mt-20">
          {/* Header Section */}
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-left">
            Manage Employer
          </h1>

          {/* Manager Dropdown */}
          <div className="mb-6">
            <label htmlFor="manager" className="block text-sm font-medium text-gray-700 mb-2">
              Select Manager
            </label>
            <select
              id="manager"
              value={selectedManager}
              onChange={handleManagerChange}
              className="w-full max-w-xs p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              {managers.map((manager) => (
                <option key={manager.id} value={manager.id}>
                  {manager.name}
                </option>
              ))}
            </select>
          </div>

          {/* Table Section */}
          <div className="overflow-hidden rounded-lg border border-gray-300 bg-white shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-300">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 tracking-wide">
                    Employee ID
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 tracking-wide">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 tracking-wide">
                    KRA
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 tracking-wide">
                    KPI
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 tracking-wide">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 tracking-wide">
                    Feedback
                  </th>
                  
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pendingEmployees.length > 0 ? (
                  pendingEmployees.map((item, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-all duration-300"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.employeeId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.kra}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.kpi}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.rating}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.feedback}
                      </td>
                     
                      
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                      No pending employees for this manager
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default ManageEmployer;