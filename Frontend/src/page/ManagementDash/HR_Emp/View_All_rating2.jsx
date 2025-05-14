import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PopUp_All_Ratings from "./PopUp_All_Ratings";
import axios from "axios";
import { useParams } from "react-router-dom";

const View_All_rating2 = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const { id } = useParams(); // This is employeeId
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState("");

  const [Cratings, setCRatings] = useState([]);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/kpi-ratings/employee/${id}`,
          {
            withCredentials: true,
          }
        );
        console.log("User data ", response.data); // Log the response data to see the structure
        setRatings(response.data);
        // Fetch employee data to get the user's name
        const employeesResponse = await axios.get(
          "http://localhost:5000/api/employees",
          {
            withCredentials: true,
          }
        );
        const employee = employeesResponse.data.find(
          (emp) => emp.employeeId === parseInt(id)
        );
        if (employee) {
          setUserName(employee.fullName); // Set the user's full name
        } else {
          setUserName("Unknown User"); // Fallback if no matching employee is found
        }
      } catch (err) {
        console.error("Failed to fetch KPI ratings", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [id]);

  const handleCellClick = (month) => {
    setSelectedMonth(month);

    // Find the rating object for the selected month
    const feedbackEntry = ratings.find(
      (r) => r.month === month && r.employeeId === parseInt(id)
    );

    setSelectedFeedback(feedbackEntry?.feedback || "No feedback available");
    setShowPopup(true);
  };

  useEffect(() => {
    const fetchCompetencyRatings = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/competency-ratings/employee/${id}`,
          { withCredentials: true }
        );
        setCRatings(response.data); // ✅ Corrected this line
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching competency ratings:", error);
      }
    };

    if (id) {
      fetchCompetencyRatings();
    }
  }, [id]); // ✅ Added dependency

  const groupedRatings = Cratings.reduce((acc, item) => {
    const key = item.competencyId;
    if (!acc[key]) {
      acc[key] = {
        competencyId: item.competencyId,
        competencyDescription: item.competencyDescription,
        isSeniorManager: item.isSeniorManager,
        Cratings: Array(12).fill(null), // 12 months
      };
    }
    acc[key].Cratings[item.month - 1] = item.Crating; // month is 1-indexed
    return acc;
  }, {});

  return (
    <div className="flex min-h-screen bg-gray-200">
      <div className="flex-1 p-6">
        <div className="w-full max-w-5xl bg-white rounded-lg shadow-md p-8 mx-auto mt-10">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-6">
            <button
              className="text-gray-600 hover:text-gray-800 mb-4"
              onClick={() => navigate(-1)} // This goes back to the previous page
            >
              ← Back
            </button>

            <h1 className="text-2xl font-bold text-gray-900">{userName}</h1>
            <div className="flex items-center gap-2">
              <select className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500">
                {["2021", "2022", "2023", "2024", "2025"].map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500">
                <option value="user">User Rating</option>
                <option value="manager">Manager Rating</option>
              </select>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-4">
            <button className="px-4 py-2 mr-2 rounded-lg bg-black text-white">
              Monthly Ratings
            </button>
            <button className="px-4 py-2 rounded-lg bg-gray-200 text-gray-900">
              Quarterly Ratings
            </button>
          </div>

          {/* KPI Ratings Table */}
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            KPI Ratings
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
              <thead className="bg-gray-300">
                <tr>
                  {[
                    "KRA",
                    "KPI",
                    "Target for monthly achievement",
                    "Specific tasks to be carried out",
                    "Weightage",
                    ...Array.from({ length: 12 }, (_, i) =>
                      new Date(0, i).toLocaleString("default", {
                        month: "long",
                      })
                    ),
                  ].map((header, idx) => (
                    <th
                      key={idx}
                      className="px-4 py-2 text-left text-sm font-semibold text-gray-900"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(() => {
                  // Group ratings by KPI
                  const grouped = {};

                  ratings.forEach((r) => {
                    const key = r.kpiId;
                    if (!grouped[key]) {
                      grouped[key] = {
                        kra: r.kraDescription,
                        kpi: r.kpiDescription,
                        target: r.target,
                        tasks: r.tasks,
                        weightage: r.weitage,
                        monthlyRatings: {},
                      };
                    }
                    grouped[key].monthlyRatings[r.month] = r.rating;
                  });

                  // Render table rows
                  return Object.values(grouped).map((entry, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {entry.kra}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {entry.kpi}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {entry.target}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {entry.tasks}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {entry.weightage}%
                      </td>
                      {Array.from({ length: 12 }, (_, i) => {
                        const month = new Date(0, i).toLocaleString("default", {
                          month: "long",
                        });
                        const rating = entry.monthlyRatings[month] ?? "-";
                        return (
                          <td
                            key={i}
                            className="px-4 py-2 text-sm text-gray-900 min-w-[100px] cursor-pointer hover:bg-gray-100"
                            onClick={() => handleCellClick(month)}
                          >
                            {rating}
                          </td>
                        );
                      })}
                    </tr>
                  ));
                })()}
              </tbody>
            </table>
          </div>

          {/* Competency Ratings Table */}
          <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">
            Competency Rating
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
              <thead className="bg-gray-300">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">
                    Competency
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">
                    Senior Manager
                  </th>
                  {Array.from({ length: 12 }, (_, i) => (
                    <th
                      key={i}
                      className="px-4 py-2 text-left text-sm font-semibold text-gray-900 min-w-[100px]"
                    >
                      {new Date(0, i).toLocaleString("default", {
                        month: "long",
                      })}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.values(groupedRatings).map((competency) => (
                  <tr key={competency.competencyId}>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {competency.competencyDescription}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {competency.isSeniorManager ? "Yes" : "No"}
                    </td>
                    {competency.Cratings.map((rating, i) => (
                      <td
                        key={i}
                        className="px-4 py-2 text-sm text-gray-900 min-w-[100px]"
                      >
                        {rating ?? "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                Ratings for {selectedMonth}
              </h3>
              <button
                onClick={() => setShowPopup(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                ✕
              </button>
            </div>
            <PopUp_All_Ratings feedback={selectedFeedback} />
          </div>
        </div>
      )}
    </div>
  );
};

export default View_All_rating2;
