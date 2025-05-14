import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../../components/Dash/Sidebar/Sidebar";
import View_ratings_2 from "./Hr_rating_next";

const Hr_rating = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch employees assigned to the manager
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/employees",
          {
            withCredentials: true,
          }
        );
        const employees = response.data.filter((item) => item.roleId === 2);
        console.log("Employees under manager:", employees);
        setUsers(employees);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  const handleViewClick = (user) => {
    setSelectedUser(user);

  };

  const handleBack = () => {
    setSelectedUser(null);
    
  };

  return (
    <div className="flex min-h-screen bg-gray-200">
      <Sidebar />

      <div className="flex-1 p-6">
        {selectedUser ? (
          
          <View_ratings_2 user={selectedUser} onBack={handleBack} />        ) : (
          <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-8 mx-auto mt-20">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Rate Managers
            </h1>

            <div className="overflow-hidden rounded-xl border border-gray-200">
              <div className="max-h-96 overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Employee ID
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
                    {users.map((user) => (
                      <tr key={user.employeeNumber}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {user.employeeId}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {user.fullName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          <button
                            className="bg-black text-white px-4 py-2 rounded-lg"
                            onClick={() => handleViewClick(user)}
                          >
                            Rate Employee
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

export default Hr_rating;
