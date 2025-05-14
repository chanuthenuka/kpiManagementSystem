import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../../components/Dash/Sidebar/Sidebar";
import axios from "axios";

const Manager_Performance = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/manager-employees/getEmployeesByManagerId",
          { withCredentials: true }
        );
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="w-full sm:w-3/4 md:w-2/3 lg:w-4/5 p-8 m-6 bg-white rounded-3xl shadow-lg grid grid-rows-[auto_1fr] gap-8 mt-20">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Employees
        </h1>
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
                    Manager
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
                ) : employees.length > 0 ? (
                  employees.map((emp) => (
                    <tr key={emp.employeeId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {emp.employeeId}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {emp.employeeName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {emp.managerName}
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

export default Manager_Performance;
