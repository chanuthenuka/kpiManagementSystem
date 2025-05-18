import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../../components/Dash/Sidebar/Sidebar";

const View_All_ratings = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState("All");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/employees", {
          withCredentials: true,
        });
        setEmployees(res.data);
        setFilteredEmployees(res.data);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/department", {
          withCredentials: true,
        });
        setDepartments(res.data);
      } catch (error) {
        console.error("Failed to fetch departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    if (selectedDept === "All") {
      setFilteredEmployees(employees);
    } else {
      setFilteredEmployees(
        employees.filter((emp) => emp.departmentId === parseInt(selectedDept))
      );
    }
  }, [selectedDept, employees]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="w-full sm:w-3/4 md:w-2/3 lg:w-4/5 p-8 m-6 bg-white rounded-3xl shadow-lg grid grid-rows-[auto_1fr] gap-8 mt-20">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Employees
          </h1>

          {/* Department Filter */}
          <select
            className="ml-4 p-2 border border-gray-300 rounded-lg shadow-sm"
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
          >
            <option value="All">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.departmentId} value={dept.departmentId}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-hidden rounded-xl shadow-md border border-gray-200">
          <div className="max-h-96 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Employee ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Employee Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-sm text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : filteredEmployees.length > 0 ? (
                  filteredEmployees.map((emp) => (
                    <tr key={emp.employeeId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {emp.employeeId}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {emp.fullName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <button
                          onClick={() =>
                            navigate(`/view_rating_card/${emp.employeeId}`)
                          }
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Performance
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-sm text-gray-500">
                      No employees found
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

export default View_All_ratings;