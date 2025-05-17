import React, { useState } from "react";
import Sidebar from "../../../../components/Dash/Sidebar/Sidebar";

const HodRatingApprovals = () => {
  const [ratingList, setRatingList] = useState([
    {
      employeeId: "EMP001",
      name: "John Doe",
      kra: "Sales Growth",
      kpi: "Revenue Increase",
      rating: "85%",
      feedback: "Good performance",
      status: "pending",
      updatedRating: "",
      updatedFeedback: "", // New field for updated feedback
      manager: "Michael Scott",
    },
    // ... (other initial data remains the same, just add updatedFeedback: "" to each object)
    {
      employeeId: "EMP007",
      name: "Tom Harris",
      kra: "Client Satisfaction",
      kpi: "Feedback Score",
      rating: "70%",
      feedback: "Needs to improve client relations",
      status: "rejected",
      updatedRating: "",
      updatedFeedback: "", // Add this to all items
      manager: "Pam Beesly",
    },
  ]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [historyManagerFilter, setHistoryManagerFilter] = useState("all");
  const [pendingNameFilter, setPendingNameFilter] = useState("");
  const [historyNameFilter, setHistoryNameFilter] = useState("");
  const [pendingManagerFilter, setPendingManagerFilter] = useState("all");
  const [selectedHistoryItems, setSelectedHistoryItems] = useState([]);

  const managers = ["all", ...new Set(ratingList.map((item) => item.manager))];

  const handleCheckboxChange = (index) => {
    setSelectedItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleHistoryCheckboxChange = (index) => {
    setSelectedHistoryItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleApprove = () => {
    const updatedList = [...ratingList];
    selectedItems.forEach((index) => {
      updatedList[index].status = "approved";
    });
    setRatingList(updatedList);
    setSelectedItems([]);
  };

  const handleReject = () => {
    const updatedList = [...ratingList];
    selectedItems.forEach((index) => {
      const item = updatedList[index];
      item.status = "rejected";
      // Apply updated rating and feedback if provided
      if (item.updatedRating) item.rating = item.updatedRating;
      if (item.updatedFeedback) item.feedback = item.updatedFeedback;
      item.updatedRating = ""; // Clear after rejection
      item.updatedFeedback = ""; // Clear after rejection
    });
    setRatingList(updatedList);
    setSelectedItems([]);
  };

  const handleReset = () => {
    const updatedList = [...ratingList];
    selectedHistoryItems.forEach((index) => {
      const actualIndex = ratingList.findIndex(
        (item, idx) => historyRatings[idx] === item
      );
      updatedList[actualIndex].status = "pending";
    });
    setRatingList(updatedList);
    setSelectedHistoryItems([]);
  };

  const handleRatingChange = (index, field, value) => {
    const updatedList = [...ratingList];
    updatedList[index][field] = value;
    setRatingList(updatedList);
  };

  const pendingRatings = ratingList.filter(
    (item) =>
      item.status === "pending" &&
      item.name.toLowerCase().includes(pendingNameFilter.toLowerCase()) &&
      (pendingManagerFilter === "all" || item.manager === pendingManagerFilter)
  );

  const historyRatings = ratingList.filter(
    (item) =>
      item.status !== "pending" &&
      (historyManagerFilter === "all" ||
        item.manager === historyManagerFilter) &&
      item.name.toLowerCase().includes(historyNameFilter.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-200">
      <Sidebar />
      <div className="flex-1 p-4 sm:p-6 overflow-hidden">
        <div className="w-full max-w-7xl bg-white rounded-lg shadow-md p-4 sm:p-6 md:p-8 mx-auto mt-10 sm:mt-20 max-h-[85vh] sm:max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-left">
              Rating Approvals
            </h1>
          </div>

          {/* Pending Ratings Table */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Pending Approvals
            </h2>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <input
                type="text"
                placeholder="Filter by name..."
                value={pendingNameFilter}
                onChange={(e) => setPendingNameFilter(e.target.value)}
                className="w-full sm:w-48 px-3 py-1.5 sm:px-4 sm:py-2 border rounded-lg bg-gray-100 text-gray-900 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              <select
                value={pendingManagerFilter}
                onChange={(e) => setPendingManagerFilter(e.target.value)}
                className="w-full sm:w-48 px-3 py-1.5 sm:px-4 sm:py-2 border rounded-lg bg-gray-100 text-gray-900 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                {managers.map((manager) => (
                  <option key={manager} value={manager}>
                    {manager === "all" ? "All Managers" : manager}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="overflow-x-auto rounded-lg border border-gray-300 bg-white shadow-md mb-6 sm:mb-8">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-300 sticky top-0">
                <tr>
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-900 tracking-wide whitespace-nowrap">
                    Name
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-900 tracking-wide whitespace-nowrap">
                    KRA
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-900 tracking-wide whitespace-nowrap">
                    KPI
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-900 tracking-wide whitespace-nowrap">
                    Rating
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-900 tracking-wide whitespace-nowrap">
                    Feedback
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-900 tracking-wide whitespace-nowrap">
                    Manager
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-center text-xs sm:text-sm font-semibold text-gray-900 tracking-wide whitespace-nowrap">
                    Approve/Reject
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-900 tracking-wide whitespace-nowrap">
                    New Rating
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-900 tracking-wide whitespace-nowrap">
                    New Feedback
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pendingRatings.length > 0 ? (
                  pendingRatings.map((item, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-all duration-300"
                    >
                      <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                        {item.kra}
                      </td>
                      <td className="px-4 py-3 sm:px-6 sm-py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                        {item.kpi}
                      </td>
                      <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                        {item.rating}
                      </td>
                      <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                        {item.feedback}
                      </td>
                      <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                        {item.manager}
                      </td>
                      <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 flex justify-center items-center">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(index)}
                          style={{ width: "1.25rem", height: "1.25rem" }}
                          onChange={() => handleCheckboxChange(index)}
                        />
                      </td>
                      <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                        <input
                          type="text"
                          value={item.updatedRating}
                          onChange={(e) =>
                            handleRatingChange(
                              index,
                              "updatedRating",
                              e.target.value
                            )
                          }
                          placeholder="New Rating"
                          className="w-full px-2 py-1 border rounded-lg bg-gray-100 text-gray-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
                        />
                      </td>
                      <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                        <input
                          type="text"
                          value={item.updatedFeedback}
                          onChange={(e) =>
                            handleRatingChange(
                              index,
                              "updatedFeedback",
                              e.target.value
                            )
                          }
                          placeholder="New Feedback"
                          className="w-full px-2 py-1 border rounded-lg bg-gray-100 text-gray-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="9"
                      className="px-4 py-6 sm:px-6 sm:py-8 text-center text-xs sm:text-sm text-gray-500"
                    >
                      No pending ratings
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Approve/Reject Buttons */}
          {pendingRatings.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-4 mb-6 sm:mb-8">
              <button
                onClick={handleApprove}
                disabled={selectedItems.length === 0}
                className={`w-full sm:w-auto px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-sm sm:text-base ${
                  selectedItems.length === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gray-500 text-white hover:bg-gray-600"
                }`}
              >
                Approve
              </button>
              <button
                onClick={handleReject}
                disabled={selectedItems.length === 0}
                className={`w-full sm:w-auto px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-sm sm:text-base ${
                  selectedItems.length === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gray-500 text-white hover:bg-gray-600"
                }`}
              >
                Reject
              </button>
            </div>
          )}

          

          <div className="overflow-x-auto rounded-lg border border-gray-300 bg-white shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-300 sticky top-0">
                <tr>
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-900 tracking-wide whitespace-nowrap">
                    Select
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-900 tracking-wide whitespace-nowrap">
                    Name
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-900 tracking-wide whitespace-nowrap">
                    KRA
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-900 tracking-wide whitespace-nowrap">
                    KPI
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-900 tracking-wide whitespace-nowrap">
                    Rating
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-900 tracking-wide whitespace-nowrap">
                    Feedback
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-900 tracking-wide whitespace-nowrap">
                    Manager
                  </th>
                  <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-900 tracking-wide whitespace-nowrap">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {historyRatings.length > 0 ? (
                  historyRatings.map((item, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-all duration-300"
                    >
                      <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={selectedHistoryItems.includes(index)}
                          style={{ width: "1.25rem", height: "1.25rem" }}
                          onChange={() => handleHistoryCheckboxChange(index)}
                        />
                      </td>
                      <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                        {item.kra}
                      </td>
                      <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                        {item.kpi}
                      </td>
                      <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                        {item.rating}
                      </td>
                      <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                        {item.feedback}
                      </td>
                      <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                        {item.manager}
                      </td>
                      <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            item.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-4 py-3 sm:px-6 sm:py-4 text-center text-xs sm:text-sm text-gray-500"
                    >
                      No history available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {historyRatings.length > 0 && (
            <div className="flex justify-end mt-4">
              <button
                onClick={handleReset}
                disabled={selectedHistoryItems.length === 0}
                className={`w-full sm:w-auto px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-sm sm:text-base ${
                  selectedHistoryItems.length === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Reset Selected to Pending
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HodRatingApprovals;
