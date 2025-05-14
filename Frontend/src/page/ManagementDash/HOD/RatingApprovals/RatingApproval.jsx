import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../../../components/Dash/Sidebar/Sidebar";

const RatingApprovals = () => {
  const [ratings, setRatings] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [newRatings, setNewRatings] = useState({}); // Track rating changes
  const [newFeedbacks, setNewFeedbacks] = useState({}); // Track feedback changes

  // Fetch ratings data on component mount
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/kpi-ratings/employee/ratings",
          { withCredentials: true }
        );
        setRatings(response.data);
      } catch (error) {
        console.error("Error fetching ratings:", error);
      }
    };

    fetchRatings();
  }, []);

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
          ratings.find((r) => r.kpiRatingId === ratingId).rating, // Use new rating or fallback to original
        feedback:
          newFeedbacks[ratingId] ||
          ratings.find((r) => r.kpiRatingId === ratingId).feedback, // Use new feedback or fallback
        status: status.toLowerCase(), // Ensure lowercase for backend compatibility
      }));

      // Send the approval or rejection updates
      for (const update of updates) {
        const { ratingId, rating, feedback, status } = update;

        const response = await axios.put(
          `http://localhost:5000/api/kpi-ratings/${ratingId}`,
          {
            rating,
            feedback,
            status,
          },
          { withCredentials: true }
        );

        console.log(response.data);
      }

      // Update UI: Clear selected ratings and refresh the list
      setSelectedRatings([]);
      const response = await axios.get(
        "http://localhost:5000/api/kpi-ratings/employee/ratings",
        { withCredentials: true }
      );
      setRatings(response.data);
    } catch (error) {
      console.error("Error updating ratings:", error);
    }
  };

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
          </div>

          <table className="w-full text-sm text-left border rounded overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-3 py-2">Select</th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">KRA</th>
                <th className="px-3 py-2">KPI</th>
                <th className="px-3 py-2">Rating</th>
                <th className="px-3 py-2">Feedback</th>
                <th className="px-3 py-2">Manager</th>
                <th className="px-3 py-2">New Rating</th>
                <th className="px-3 py-2">New Feedback</th>
              </tr>
            </thead>
            <tbody>
              {ratings.length > 0 ? (
                ratings.map((rating) => (
                  <tr key={rating.kpiRatingId} className="border-b">
                    <td className="px-3 py-2">
                      <input
                        type="checkbox"
                        className="w-4 h-4"
                        onChange={() => handleSelectRating(rating.kpiRatingId)}
                      />
                    </td>
                    <td className="px-3 py-2">{rating.employeeName}</td>
                    <td className="px-3 py-2">{rating.kraDescription}</td>
                    <td className="px-3 py-2">{rating.kpiDescription}</td>
                    <td className="px-3 py-2">{rating.rating}</td>
                    <td className="px-3 py-2">{rating.feedback}</td>
                    <td className="px-3 py-2">{rating.ratedByEmployee}</td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        className="w-full border rounded px-2 py-1 text-xs"
                        value={newRatings[rating.kpiRatingId] ?? rating.rating} // Controlled input
                        onChange={(e) =>
                          handleRatingChange(rating.kpiRatingId, e.target.value)
                        }
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        className="w-full border rounded px-2 py-1 text-xs"
                        value={
                          newFeedbacks[rating.kpiRatingId] ?? rating.feedback
                        } // Controlled input
                        onChange={(e) =>
                          handleFeedbackChange(
                            rating.kpiRatingId,
                            e.target.value
                          )
                        }
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center px-3 py-2">
                    No pending ratings.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex gap-4 mt-4 justify-end">
            <button
              onClick={() => handleApproval("Approve")}
              className="px-4 py-2 rounded bg-black text-white hover:bg-green-700"
            >
              Approve
            </button>
            <button
              onClick={() => handleApproval("Reject")}
              className="px-4 py-2 rounded bg-black text-white hover:bg-red-700"
            >
              Reject
            </button>
          </div>
        </section>

        {/* History Section */}
      </main>
    </div>
  );
};

export default RatingApprovals;
