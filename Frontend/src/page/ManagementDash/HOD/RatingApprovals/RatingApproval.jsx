import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../../../components/Dash/Sidebar/Sidebar";

const RatingApprovals = () => {
  const [ratings, setRatings] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [newRatings, setNewRatings] = useState({}); // Track rating changes
  const [newFeedbacks, setNewFeedbacks] = useState({}); // Track feedback changes
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [selectedManager, setSelectedManager] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const storedDeptId = localStorage.getItem("departmentId");
  const [selectedDept] = useState(storedDeptId);

  // Fetch ratings with departmentId filter
  const fetchRatings = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/kpi-ratings/employee/ratings${
          selectedDept ? `?departmentId=${selectedDept}` : ""
        }`,
        { withCredentials: true }
      );
      setRatings(response.data);
    } catch (error) {
      console.error("Error fetching ratings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, [selectedDept]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/department",
          {
            withCredentials: true,
          }
        );
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []); // fetch departments once at mount

  // Handle selection of ratings
  const handleSelectRating = (ratingId) => {
    setSelectedRatings((prevSelected) =>
      prevSelected.includes(ratingId)
        ? prevSelected.filter((id) => id !== ratingId)
        : [...prevSelected, ratingId]
    );
  };

  // Handle rating change
  const handleRatingChange = (ratingId, newRating) => {
    setNewRatings((prevRatings) => ({
      ...prevRatings,
      [ratingId]: newRating,
    }));
  };

  // Handle feedback change
  const handleFeedbackChange = (ratingId, newFeedback) => {
    setNewFeedbacks((prevFeedbacks) => ({
      ...prevFeedbacks,
      [ratingId]: newFeedback,
    }));
  };

  // Handle approval or rejection of selected ratings
  const handleApproval = async (status) => {
    try {
      const updates = selectedRatings.map((ratingId) => ({
        ratingId,
        rating:
          newRatings[ratingId] ||
          ratings.find((r) => r.kpiRatingId === ratingId).rating,
        feedback:
          newFeedbacks[ratingId] ||
          ratings.find((r) => r.kpiRatingId === ratingId).feedback,
        status: status.toLowerCase(),
      }));

      for (const update of updates) {
        const { ratingId, rating, feedback, status } = update;
        await axios.put(
          `http://localhost:5000/api/kpi-ratings/${ratingId}`,
          { rating, feedback, status },
          { withCredentials: true }
        );
      }

      // Clear selected ratings and refresh the list
      setSelectedRatings([]);
      setSelectAll(false);
      setIsLoading(true);
      await fetchRatings(); // Re-fetch ratings with current department filter
    } catch (error) {
      console.error("Error updating ratings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRatings([]);
    } else {
      setSelectedRatings(filteredRatings.map((rating) => rating.kpiRatingId));
    }
    setSelectAll(!selectAll);
  };

  const filteredRatings = ratings.filter((rating) => {
    const matchesManager = selectedManager
      ? rating.ratedByEmployee === selectedManager
      : true;
    const matchesEmployee = selectedEmployee
      ? rating.fullName === selectedEmployee
      : true;
    return matchesManager && matchesEmployee;
  });

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto mt-16">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Rating Approvals
        </h1>

        {/* Pending Approvals Section */}
        <section className="bg-white p-6 rounded-lg shadow mb-10">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">Pending Approvals</h2>
            <div className="mb-4 flex gap-4 items-center">
              <label className="text-sm font-medium text-gray-700">
                Manager:
              </label>
              <select
                className="border rounded px-3 py-1 text-sm"
                value={selectedManager}
                onChange={(e) => setSelectedManager(e.target.value)}
              >
                <option value="">All</option>
                {[...new Set(ratings.map((r) => r.ratedByEmployee))].map(
                  (manager) => (
                    <option key={manager} value={manager}>
                      {manager}
                    </option>
                  )
                )}
              </select>

              <label className="text-sm font-medium text-gray-700">
                Employee:
              </label>
              <select
                className="border rounded px-3 py-1 text-sm"
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
              >
                <option value="">All</option>
                {[...new Set(ratings.map((r) => r.fullName))].map((emp) => (
                  <option key={emp} value={emp}>
                    {emp}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <table className="w-full text-sm text-left border rounded overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-3 py-2">Employee</th>
                <th className="px-3 py-2">KRA</th>
                <th className="px-3 py-2">KPI</th>
                <th className="px-3 py-2">Month</th>
                <th className="px-3 py-2">Rating</th>
                <th className="px-3 py-2">Feedback</th>
                <th className="px-3 py-2">Manager</th>
                <th className="px-3 py-2">New Rating</th>
                <th className="px-3 py-2">New Feedback</th>
                <th className="px-3 py-2">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="w-4 h-4"
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="9" className="text-center px-3 py-2">
                    Loading...
                  </td>
                </tr>
              ) : ratings.length > 0 ? (
                filteredRatings.map((rating) => (
                  <tr key={rating.kpiRatingId} className="border-b">
                    <td className="px-3 py-2">{rating.fullName}</td>
                    <td className="px-3 py-2">{rating.kraDescription}</td>
                    <td className="px-3 py-2">{rating.kpiDescription}</td>
                    <td className="px-3 py-2">{rating.month}</td>
                    <td className="px-3 py-2">{rating.rating}</td>
                    <td className="px-3 py-2">{rating.feedback}</td>
                    <td className="px-3 py-2">{rating.ratedByEmployee}</td>
                    <td className="px-3 py-2">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          className="w-full border rounded px-2 py-1 text-xs"
                          value={
                            newRatings[rating.kpiRatingId] ?? rating.rating
                          }
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d{0,3}$/.test(value)) {
                              const intVal = parseInt(value, 10);
                              if (
                                value === "" ||
                                (Number.isInteger(intVal) &&
                                  intVal >= 0 &&
                                  intVal <= 100)
                              ) {
                                handleRatingChange(rating.kpiRatingId, value);
                              }
                            }
                          }}
                        />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        className="w-full border rounded px-2 py-1 text-xs"
                        value={
                          newFeedbacks[rating.kpiRatingId] ?? rating.feedback
                        }
                        onChange={(e) =>
                          handleFeedbackChange(
                            rating.kpiRatingId,
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="checkbox"
                        className="w-4 h-4"
                        checked={selectedRatings.includes(rating.kpiRatingId)}
                        onChange={() => handleSelectRating(rating.kpiRatingId)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center px-3 py-2">
                    No pending ratings for the selected department.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex gap-4 mt-4 justify-end">
            <button
              onClick={() => handleApproval("Approve")}
              className="px-4 py-2 rounded bg-black text-white hover:bg-green-700"
              disabled={isLoading}
            >
              Approve
            </button>
            <button
              onClick={() => handleApproval("Reject")}
              className="px-4 py-2 rounded bg-black text-white hover:bg-red-700"
              disabled={isLoading}
            >
              Reject
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default RatingApprovals;
