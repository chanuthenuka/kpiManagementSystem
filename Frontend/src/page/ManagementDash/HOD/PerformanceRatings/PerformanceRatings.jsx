import React, { useState } from "react";
import Sidebar from "../../../../components/Dash/Sidebar/Sidebar";

const View_rating = () => {
  const users = [
    { id: "USR001", name: "John Doe", type: "Admin", lastActive: "2025-03-04" },
    { id: "USR002", name: "Jane Smith", type: "Staff", lastActive: "2025-03-05" },
    { id: "USR003", name: "Alex Brown", type: "Manager", lastActive: "2025-03-03" },
    { id: "USR004", name: "Emily White", type: "Staff", lastActive: "2025-03-05" },
  ];

  // State for rating type per user modal
  const [ratingTypes, setRatingTypes] = useState(
    users.reduce((acc, user) => ({ ...acc, [user.id]: "user" }), {})
  );

  // Sample data for user ratings
  const userKpiRatings = [
    {
      kra: "Sales",
      kpi: "Revenue Growth",
      description: "Increase sales by 10%",
      weightage: "20%",
      ratings: {
        October: "85%",
        November: "90%",
        December: "95%",
      },
    },
  ];

  const userCompetencyRatings = [
    {
      competency: "Communication",
      description: "Ability to convey ideas clearly",
      August: "80%",
      September: "85%",
      October: "90%",
      November: "92%",
      December: "94%",
    },
  ];

  // Sample data for manager ratings
  const managerKpiRatings = [
    {
      kra: "Sales",
      kpi: "Revenue Growth",
      description: "Increase sales by 10%",
      weightage: "20%",
      ratings: {
        October: "82%",
        November: "88%",
        December: "93%",
      },
    },
  ];

  const managerCompetencyRatings = [
    {
      competency: "Communication",
      description: "Ability to convey ideas clearly",
      August: "78%",
      September: "83%",
      October: "88%",
      November: "90%",
      December: "92%",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="w-full sm:w-3/4 md:w-2/3 lg:w-4/5 p-8 m-6 bg-white rounded-3xl shadow-lg grid grid-rows-[auto_1fr] gap-8 mt-20">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Employees</h1>
        <div className="overflow-hidden rounded-xl shadow-md border border-gray-200">
          <div className="max-h-96 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">User ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => {
                  // Select data based on rating type for this user
                  const kpiRatings = ratingTypes[user.id] === "user" ? userKpiRatings : managerKpiRatings;
                  const competencyRatings = ratingTypes[user.id] === "user" ? userCompetencyRatings : managerCompetencyRatings;

                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{user.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <button
                          className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition"
                          onClick={() => {
                            document.getElementById(`userDetails-${user.id}`).classList.remove("hidden");
                          }}
                        >
                          View
                        </button>

                        {/* Modal */}
                        <div
                          id={`userDetails-${user.id}`}
                          className="hidden fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md z-[60]"
                        >
                          <div className="bg-white p-6 rounded-lg w-11/12 md:w-3/4 max-h-[80vh] overflow-y-auto shadow-xl relative">
                            <button
                              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-xl font-bold"
                              onClick={() =>
                                document.getElementById(`userDetails-${user.id}`).classList.add("hidden")
                              }
                            >
                              ✖
                            </button>
                            <h2 className="text-2xl font-bold mb-4">{user.name}'s Ratings</h2>
                            <div className="flex flex-col md:flex-row md:gap-4 mb-4">
                              {/* Year Filter */}
                              <div>
                                <label
                                  htmlFor={`yearFilter-${user.id}`}
                                  className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                  Filter by Year
                                </label>
                                <div className="relative">
                                  <select
                                    id={`yearFilter-${user.id}`}
                                    className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                                    defaultValue="2025"
                                  >
                                    <option value="2025">2025</option>
                                    <option value="2024">2024</option>
                                    <option value="2023">2023</option>
                                    <option value="2022">2022</option>
                                    <option value="2021">2021</option>
                                  </select>
                                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2"></div>
                                </div>
                              </div>
                              {/* Rating Type Filter */}
                              <div>
                                <label
                                  htmlFor={`ratingTypeFilter-${user.id}`}
                                  className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                  Rating Type
                                </label>
                                <div className="relative">
                                  <select
                                    id={`ratingTypeFilter-${user.id}`}
                                    className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                                    value={ratingTypes[user.id]}
                                    onChange={(e) =>
                                      setRatingTypes((prev) => ({
                                        ...prev,
                                        [user.id]: e.target.value,
                                      }))
                                    }
                                  >
                                    <option value="user">User Rating</option>
                                    <option value="manager">Manager Rating</option>
                                  </select>
                                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2"></div>
                                </div>
                              </div>
                            </div>
                            {/* KPI Ratings Table */}
                            <h3 className="text-lg font-semibold mt-6 mb-2">KPI Ratings</h3>
                            <div className="overflow-x-auto">
                              <table className="w-full border rounded-lg">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">KRA</th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">KPI</th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Description</th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Weightage</th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">October</th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">November</th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">December</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {kpiRatings.map((item, index) => (
                                    <tr key={index}>
                                      <td className="px-4 py-2">{item.kra}</td>
                                      <td className="px-4 py-2">{item.kpi}</td>
                                      <td className="px-4 py-2">{item.description}</td>
                                      <td className="px-4 py-2">{item.weightage}</td>
                                      <td className="px-4 py-2">{item.ratings.October}</td>
                                      <td className="px-4 py-2">{item.ratings.November}</td>
                                      <td className="px-4 py-2">{item.ratings.December}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            {/* Competency Ratings Table */}
                            <h3 className="text-lg font-semibold mt-6 mb-2">Competency Ratings</h3>
                            <div className="overflow-x-auto">
                              <table className="w-full border rounded-lg">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Competency</th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Description</th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">August</th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">September</th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">October</th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">November</th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">December</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {competencyRatings.map((item, index) => (
                                    <tr key={index}>
                                      <td className="px-4 py-2">{item.competency}</td>
                                      <td className="px-4 py-2">{item.description}</td>
                                      <td className="px-4 py-2">{item.August}</td>
                                      <td className="px-4 py-2">{item.September}</td>
                                      <td className="px-4 py-2">{item.October}</td>
                                      <td className="px-4 py-2">{item.November}</td>
                                      <td className="px-4 py-2">{item.December}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                        {/* End Modal */}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hidden {
          display: none !important;
        }
      `}</style>
    </div>
  );
};

export default View_rating;