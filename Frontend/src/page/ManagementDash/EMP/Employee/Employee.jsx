import React, { useState, useEffect } from "react";
import Sidebar from "../../../../components/Dash/Sidebar/Sidebar";
import axios from "axios";

const Employees = () => {
  const [year, setYear] = useState("2023");
  const [own, setOwn] = useState("Own");

  const [kpiRatings, setKpiRatings] = useState([]);
  const [competencyRatings, setCompetencyRatings] = useState([]);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const userId = localStorage.getItem("employeeId");

        if (!userId) {
          console.warn("No employeeId found in localStorage");
          return;
        }

        // Fetch KPI Ratings
        const kpiRes = await axios.get(
          `http://localhost:5000/api/kpi-ratings/employee/${userId}`,
          { withCredentials: true }
        );
        setKpiRatings(kpiRes.data);

        // Fetch Competency Ratings
        const compRes = await axios.get(
          `http://localhost:5000/api/competency-ratings/employee/${userId}`,
          { withCredentials: true }
        );
        setCompetencyRatings(compRes.data);
      } catch (error) {
        console.error("Error fetching ratings:", error);
      }
    };

    fetchRatings();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-200">
      <Sidebar />

      <div className="flex-1 p-6">
        <div className="w-full max-w-6xl bg-white rounded-lg shadow-md p-8 mx-auto mt-20">
          {/* Dropdowns */}
          <div className="flex space-x-4 mb-8">
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900"
            >
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
            </select>

            <select
              value={own}
              onChange={(e) => setOwn(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900"
            >
              <option value="Own">Own</option>
              <option value="Team">Team</option>
            </select>
          </div>

          {/* KPI Ratings Table */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              KPI Ratings
            </h2>
            <div className="overflow-hidden rounded-lg border border-gray-300 bg-white shadow-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-300">
                  <tr>
                    {["KRA", "KPI", "rating", "Weightage", "Month"].map(
                      (header, idx) => (
                        <th
                          key={idx}
                          className="px-6 py-3 text-left text-sm font-semibold text-gray-900 tracking-wide"
                        >
                          {header}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {kpiRatings.map((item) => (
                    <tr key={item.kpiRatingId}>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.kraDescription}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.kpiDescription}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.rating}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.weitage}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.month}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Competency Ratings Table */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Competency Ratings
            </h2>
            <div className="overflow-hidden rounded-lg border border-gray-300 bg-white shadow-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-300">
                  <tr>
                    {[
                      "Competency",
                      "Rating",
                      "Status",
                      "Month",
                      "Voted by",
                    ].map((header, idx) => (
                      <th
                        key={idx}
                        className="px-6 py-3 text-left text-sm font-semibold text-gray-900 tracking-wide"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {competencyRatings.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {item.competencyDescription}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {item.rating}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {item.status}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {item.month}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {item.ratedByEmployee}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Employees;
