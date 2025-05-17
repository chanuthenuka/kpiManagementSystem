import React, { useEffect, useState } from "react";
import Sidebar from "../../../../components/Dash/Sidebar/Sidebar";
import axios from "axios";

const ManageEMPs = () => {
  const employmentStatuses = ["Active", "Inactive", "On Leave"];
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [filterDeptId, setFilterDeptId] = useState(""); // New state for department filter

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    fullname: "",
    email: "",
    contact: "",
    employeeNumber: "",
    Designation: "",
    employeeStatus: "",
    roleId: "",
    departmentId: "",
    isManager: false,
  });

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const departmentResponse = await axios.get(
          "http://localhost:5000/api/department",
          { withCredentials: true }
        );
        const roleResponse = await axios.get(
          "http://localhost:5000/api/roles",
          { withCredentials: true }
        );
        const employeeResponse = await axios.get(
          "http://localhost:5000/api/employees",
          { withCredentials: true }
        );

        setDepartments(departmentResponse.data);
        setRoles(roleResponse.data);
        setEmployees(employeeResponse.data);
      } catch (error) {
        console.error("Error fetching department or role data:", error);
      }
    };

    fetchDropdownData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    const payload = {
      ...formData,
      password: formData.contact,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/employees",
        payload,
        { withCredentials: true }
      );
      console.log("Employee created:", response.data);
      alert("Employee registered successfully!");

      // Refetch employees
      const employeeResponse = await axios.get(
        "http://localhost:5000/api/employees",
        { withCredentials: true }
      );
      setEmployees(employeeResponse.data);
    } catch (error) {
      console.error(
        "Registration error:",
        error.response?.data || error.message
      );
      alert("Failed to register employee.");
    }
  };

  const handleEdit = (employee) => {
    setSelectedEmployeeId(employee.employeeId);
    setFormData({
      firstname: employee.firstName || "",
      lastname: employee.lastName || "",
      fullname: employee.fullName || "",
      email: employee.email || "",
      contact: employee.contact || "",
      employeeNumber: employee.employeeNumber || "",
      Designation: employee.Designation || "",
      employeeStatus: employee.employeeStatus || "",
      departmentId: employee.departmentId || "",
      roleId: employee.roleId || "",
      isManager: employee.isManager || false,
    });
  };

  const handleUpdate = async () => {
    if (!selectedEmployeeId) {
      alert("No employee selected for update!");
      return;
    }

    const payload = {
      ...formData,
      password: formData.contact,
    };

    try {
      const response = await axios.put(
        `http://localhost:5000/api/employees/${selectedEmployeeId}`,
        payload,
        { withCredentials: true }
      );
      console.log("Employee updated:", response.data);
      alert("Employee updated successfully!");

      // Clear form and refetch employees
      setFormData({
        firstname: "",
        lastname: "",
        fullname: "",
        email: "",
        contact: "",
        employeeNumber: "",
        Designation: "",
        employeeStatus: "",
        roleId: "",
        departmentId: "",
        isManager: false,
      });
      setSelectedEmployeeId(null);

      const employeeResponse = await axios.get(
        "http://localhost:5000/api/employees",
        { withCredentials: true }
      );
      setEmployees(employeeResponse.data);
    } catch (error) {
      console.error("Update error:", error.response?.data || error.message);
      alert("Failed to update employee.");
    }
  };

  const handleDelete = async () => {
    if (!selectedEmployeeId) {
      alert("No employee selected for deletion!");
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/employees/${selectedEmployeeId}`,
        { withCredentials: true }
      );
      console.log("Employee deleted:", response.data);
      alert("Employee deleted successfully!");

      // Clear form and refetch employees
      setFormData({
        firstname: "",
        lastname: "",
        fullname: "",
        email: "",
        contact: "",
        employeeNumber: "",
        Designation: "",
        employeeStatus: "",
        roleId: "",
        departmentId: "",
        isManager: false,
      });
      setSelectedEmployeeId(null);
      setShowDeleteConfirm(false);

      const employeeResponse = await axios.get(
        "http://localhost:5000/api/employees",
        { withCredentials: true }
      );
      setEmployees(employeeResponse.data);
    } catch (error) {
      console.error("Delete error:", error.response?.data || error.message);
      alert("Failed to delete employee.");
      setShowDeleteConfirm(false);
    }
  };

  const confirmDelete = () => {
    if (!selectedEmployeeId) {
      alert("Please select an employee to delete!");
      return;
    }
    setShowDeleteConfirm(true);
  };

  // Filter employees based on selected department
  const filteredEmployees = filterDeptId
    ? employees.filter(
        (employee) => String(employee.departmentId) === String(filterDeptId)
      )
    : employees;

  //add a clear button
  const handleClear = () => {
    setFormData({
      firstname: "",
      lastname: "",
      fullname: "",
      email: "",
      contact: "",
      employeeNumber: "",
      Designation: "",
      employeeStatus: "",
      roleId: "",
      departmentId: "",
      isManager: false,
    });
    setSelectedEmployeeId(null);
    setFilterDeptId("");
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 p-6 pt-12">
        <div className="w-full max-w-7xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900">
              Employee Management
            </h1>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Section */}
            <div className="w-full md:w-2/3">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Personal Information */}
                <div className="bg-gray-50 p-6 rounded-xl shadow-inner border space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Personal Information
                  </h2>
                  <input
                    type="text"
                    placeholder="Employee ID"
                    name="employeeNumber"
                    value={formData.employeeNumber}
                    onChange={handleChange}
                    className="input-style"
                  />
                  <input
                    type="text"
                    placeholder="First Name"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    className="input-style"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    className="input-style"
                  />
                  <input
                    type="text"
                    placeholder="Full Name"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    className="input-style"
                  />
                </div>

                {/* Login Details */}
                <div className="bg-gray-50 p-6 rounded-xl shadow-inner border space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Login Details
                  </h2>
                  <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-style"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    className="input-style"
                  />
                </div>

                {/* Job Details */}
                <div className="bg-gray-50 p-6 rounded-xl shadow-inner border space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Job Details
                  </h2>
                  <select
                    name="departmentId"
                    className="input-style"
                    value={formData.departmentId}
                    onChange={handleChange}
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.departmentId} value={dept.departmentId}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                  <div className="flex items-center space-x-3 px-5 py-3 bg-white border border-gray-300 rounded-xl">
                    <input
                      type="checkbox"
                      name="isManager"
                      checked={formData.isManager}
                      onChange={handleChange}
                      className="h-5 w-5"
                    />
                    <label className="text-sm font-medium text-gray-900">
                      Senior Manager
                    </label>
                  </div>
                  <select
                    name="roleId"
                    value={formData.roleId}
                    onChange={handleChange}
                    className="input-style"
                  >
                    <option value="">Select Role</option>
                    {roles.map((role) => (
                      <option key={role.roleId} value={role.roleId}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Designation"
                    name="Designation"
                    value={formData.Designation}
                    onChange={handleChange}
                    className="input-style"
                  />
                  <select
                    name="employeeStatus"
                    value={formData.employeeStatus}
                    onChange={handleChange}
                    className="input-style"
                  >
                    <option value="" disabled>
                      Employment Status
                    </option>
                    {employmentStatuses.map((status, idx) => (
                      <option key={idx} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Right Section - Employee Table */}
            <div className="w-full md:w-1/3 space-y-6">
              {/* Department Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Department
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm text-sm text-gray-900"
                  value={filterDeptId}
                  onChange={(e) => setFilterDeptId(e.target.value)}
                >
                  <option value="">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept.departmentId} value={dept.departmentId}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="overflow-hidden rounded-xl border bg-white shadow-md max-h-[400px] overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">
                        Emp Number
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">
                        Department
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredEmployees.slice(0, 1000).map((employee) => {
                      const department = departments.find(
                        (dept) => dept.departmentId === employee.departmentId
                      );
                      return (
                        <tr
                          key={employee.employeeId}
                          className={`hover:bg-gray-50 ${
                            selectedEmployeeId === employee.employeeId
                              ? "bg-blue-50"
                              : ""
                          }`}
                          onClick={() => handleEdit(employee)}
                        >
                          <td className="px-4 py-3 text-sm font-medium">
                            {employee.employeeNumber}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium">
                            {employee.fullName}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium">
                            {department ? department.name : "Unknown"}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              className="text-sm text-blue-600 hover:underline"
                              onClick={() => handleEdit(employee)}
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="w-full flex space-x-4">
                <button
                  className="flex-1 py-2 px-4 bg-black text-white rounded-xl font-semibold shadow-md hover:bg-green-700 transition duration-300"
                  onClick={handleSubmit}
                >
                  Add
                </button>
                <button
                  className="flex-1 py-2 px-4 bg-black text-white rounded-xl font-semibold shadow-md hover:bg-blue-700 transition duration-300"
                  onClick={handleUpdate}
                  disabled={!selectedEmployeeId}
                >
                  Update
                </button>
                <button
                  className="flex-1 py-2 px-4 bg-black text-white rounded-xl font-semibold shadow-md hover:bg-red-700 transition duration-300"
                  onClick={confirmDelete}
                  disabled={!selectedEmployeeId}
                >
                  Delete
                </button>
                <button
                  className="py-2 px-4 bg-black text-white rounded-xl hover:bg-gray-300"
                  onClick={handleClear}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Delete Confirmation Popup */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 shadow-lg max-w-sm w-full">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Confirm Deletion
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Are you sure you want to delete this employee? This action
                  cannot be undone.
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    className="py-2 px-4 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="py-2 px-4 bg-red-600 text-white rounded-xl hover:bg-red-700"
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageEMPs;
