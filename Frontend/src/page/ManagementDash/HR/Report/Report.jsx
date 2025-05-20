import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../../../components/Dash/Sidebar/Sidebar";
import KpiRatingDetails from "./KpiRatingDetails";
import EmployeeKPIReport from "./EmployeeKpiReport";

const ReportGeneration = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  const [departments, setDepartments] = useState([]); // NEW - to store department list
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null); // NEW - selected department

  const [filteredEmployees, setFilteredEmployees] = useState([]); // NEW - employees filtered by department

  useEffect(() => {
    // Fetch Departments
    const fetchDepartments = async () => {
      try {
        const deptResponse = await axios.get(
          "http://localhost:5000/api/department",
          {
            withCredentials: true,
          }
        );
        setDepartments(deptResponse.data);
        if (deptResponse.data.length > 0) {
          setSelectedDepartmentId(deptResponse.data[0].departmentId); // Set initial department
        }
      } catch (error) {
        console.error("Failed to fetch departments:", error);
      }
    };

    // Fetch Employees (your original code)
    const fetchEmployees = async () => {
      try {
        const empResponse = await axios.get(
          "http://localhost:5000/api/employees",
          {
            withCredentials: true,
          }
        );
        setEmployees(empResponse.data);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      }
    };

    fetchDepartments();
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (selectedDepartmentId) {
      const filtered = employees.filter(
        (emp) => String(emp.departmentId) === String(selectedDepartmentId)
      );
      setFilteredEmployees(filtered);

      // Set selected employee to first filtered employee or null if none
      if (filtered.length > 0) {
        setSelectedEmployeeId(filtered[0].employeeId);
      } else {
        setSelectedEmployeeId(null);
      }
    }
  }, [employees, selectedDepartmentId]);

  if (!selectedEmployeeId) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="w-full sm:w-3/4 md:w-2/3 lg:w-4/5 p-8 mt-20">
          <p>Loading employees...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="w-full sm:w-3/4 md:w-2/3 lg:w-4/5 p-8 mt-20 space-y-16">
        {/* Report 1 */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Report 1
          </h2>

          {/* Department Selector */}
          <div className="mb-8 p-4 bg-white rounded-2xl shadow-lg max-w-sm">
            <label
              htmlFor="department-select"
              className="block mb-2 font-semibold text-gray-700"
            >
              Select Department
            </label>
            <select
              id="department-select"
              className="border p-2 rounded w-full text-black"
              value={selectedDepartmentId || ""}
              onChange={(e) => setSelectedDepartmentId(e.target.value)}
            >
              {departments.map((dept) => (
                <option
                  key={dept.departmentId}
                  value={dept.departmentId}
                  className="text-black"
                >
                  {dept.departmentName}
                </option>
              ))}
            </select>
          </div>

          {/* Employee Selector */}
          <div className="mb-8 p-4 bg-white rounded-2xl shadow-lg max-w-sm">
            <label
              htmlFor="employee-select"
              className="block mb-2 font-semibold text-gray-700"
            >
              Select Employee
            </label>
            <select
              id="employee-select"
              className="border p-2 rounded w-full text-black"
              value={selectedEmployeeId}
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
            >
              {filteredEmployees.map(
                (
                  emp // <-- Change here: use filteredEmployees instead of employees
                ) => (
                  <option
                    key={emp.employeeId}
                    value={emp.employeeId}
                    className="text-black"
                  >
                    {emp.employeeId} - {emp.fullName}
                  </option>
                )
              )}
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <EmployeeKPIReport employeeId={selectedEmployeeId} />
          </div>
        </div>
        {/* Report 2 */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Report 2
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <KpiRatingDetails employeeId={selectedEmployeeId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportGeneration;
