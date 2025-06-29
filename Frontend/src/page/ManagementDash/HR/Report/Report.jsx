import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../../../components/Dash/Sidebar/Sidebar";
import EmployeeKPIReport from "./EmployeeKpiReport";
import EmployeeCompetencyReport from "./EmployeeCompetencyReport"; // Import the new report

const ReportGeneration = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const deptResponse = await axios.get(
          "http://localhost:5000/api/department",
          {
            withCredentials: true,
          }
        );
        console.log("Departments from API:", deptResponse.data);
        setDepartments(deptResponse.data);
        if (deptResponse.data.length > 0) {
          setSelectedDepartmentId(deptResponse.data[0].departmentId);
        }
      } catch (error) {
        console.error("Failed to fetch departments:", error);
      }
    };

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

      if (filtered.length > 0) {
        setSelectedEmployeeId(filtered[0].employeeId);
      } else {
        setSelectedEmployeeId(null);
      }
    }
  }, [employees, selectedDepartmentId]);

  if (departments.length === 0 || employees.length === 0) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="w-full sm:w-3/4 md:w-2/3 lg:w-4/5 p-8 mt-20">
          <p>Loading data...</p>
        </div>
      </div>
    );
  }

  if (selectedDepartmentId && filteredEmployees.length === 0) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="w-full sm:w-3/4 md:w-2/3 lg:w-4/5 p-8 mt-20">
          <h2 className="text-2xl font-semibold mb-4">Selected Department</h2>
          <p className="text-red-500 font-medium">
            No employees found in this department.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="w-full sm:w-3/4 md:w-2/3 lg:w-4/5 p-8 mt-20 space-y-16">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex flex-wrap gap-8">
            {/* Department Selector */}
            <div className="mb-8 p-4 bg-white rounded-2xl shadow-lg w-64">
              <label
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
                  <option key={dept.departmentId} value={dept.departmentId}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Employee Selector */}
            <div className="mb-8 p-4 bg-white rounded-2xl shadow-lg w-64">
              <label
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
                {filteredEmployees.map((emp) => (
                  <option
                    key={emp.employeeId}
                    value={emp.employeeId}
                    className="text-black"
                  >
                    {emp.employeeNumber} - {emp.fullName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Report 1 - KPI Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Report 1 - KPI Summary
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <EmployeeKPIReport employeeId={selectedEmployeeId} />
          </div>
        </div>

        {/* Report 2 - Competency Ratings */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Report 2 - Competency Ratings
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <EmployeeCompetencyReport employeeId={selectedEmployeeId} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default ReportGeneration;
