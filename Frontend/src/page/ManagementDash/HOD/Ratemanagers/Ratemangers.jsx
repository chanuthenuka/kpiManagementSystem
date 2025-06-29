import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../../../components/Dash/Sidebar/Sidebar";
import View_ratings_2 from "../../HR/ViewRating/View_rating2";

const RateManagers = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const storedDeptId = localStorage.getItem("departmentId");
  const [selectedDept] = useState(storedDeptId);
  const [departments, setDepartments] = useState([]);

  // Fetch employees assigned to the manager
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/employees/managers",
          {
            withCredentials: true,
          }
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/department",
          { withCredentials: true }
        );
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchEmployees();
    fetchDepartments();
  }, []);

  const handleViewClick = (user) => {
    // Normalize the structure to match the expected format
    const normalizedUser = {
      ...user,
      employeeName: user.fullName, // add this field for consistency
    };
    setSelectedUser(normalizedUser);
  };

  const handleBack = () => {
    setSelectedUser(null);
  };

  const filteredUsers = selectedDept
    ? users.filter((user) => String(user.departmentId) === String(selectedDept))
    : users;

  return (
    <div className="flex min-h-screen bg-gray-200">
      <Sidebar />

      <div className="flex-1 p-6">
        {selectedUser ? (
          <View_ratings_2 user={selectedUser} onBack={handleBack} />
        ) : (
          <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-8 mx-auto mt-20">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Rate managers
            </h1>

            <div className="mb-4 flex gap-4 items-center">
              <label className="text-sm font-medium text-gray-700">
                Department:
              </label>
              <select
                className="border rounded px-3 py-1 text-sm"
                value={selectedDept}
                disabled
              >
                {departments.map((dept) => (
                  <option key={dept.departmentId} value={dept.departmentId}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200">
              <div className="max-h-96 overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Employee Number
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.employeeId}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {user.employeeNumber}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {user.fullName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          <button
                            className="bg-black text-white px-4 py-2 rounded-lg"
                            onClick={() => handleViewClick(user)}
                          >
                            Rate Manager
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {users.length === 0 && (
                  <div className="text-center p-4 text-gray-600">
                    No employees found.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RateManagers;
