import axios from "axios";
import React, { useEffect, useState } from "react";

const KPIRatingsFormManager = ({ selectedUser }) => {
  const [kpiRatings, setKpiRatings] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [kpiOptions, setKpiOptions] = useState([]);

  const loggedInEmployeeId = localStorage.getItem("employeeId");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/kpi/get-kra", { withCredentials: true })
      .then((res) => setKpiOptions(res.data))
      .catch((err) => console.error("Failed to fetch KPI data:", err));

    // Initialize with one empty rating
    setKpiRatings([
      {
        employeeId: selectedUser?.employeeId || "",
        kpiId: "",
        target: "",
        tasks: "",
        month: new Date().toISOString().slice(0, 7), // YYYY-MM
        rating: "",
        ratedByEmployeeId: loggedInEmployeeId || "",
        feedback: "",
      },
    ]);
  }, [selectedUser, loggedInEmployeeId]);

  const addRating = () => {
    setKpiRatings([
      ...kpiRatings,
      {
        employeeId: selectedUser?.employeeId || "",
        kpiId: "",
        target: "",
        tasks: "",
        month: "",
        rating: "",
        ratedByEmployeeId: loggedInEmployeeId || "",
        feedback: "",
      },
    ]);
  };

  const updateRating = (index, field, value) => {
    const updatedRatings = [...kpiRatings];
    updatedRatings[index][field] = value;
    setKpiRatings(updatedRatings);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/kpi-ratings",
        kpiRatings, // POST body
        { withCredentials: true } // Axios config
      );

      const data = response.data;
      console.log(data);
      if (!response.status === 200)
        throw new Error(data.error || "Failed to submit ratings");

      setMessage(data.message);
      // Reset form
      setKpiRatings([
        {
          employeeId: selectedUser?.employeeId || "",
          kpiId: "",
          target: "",
          tasks: "",
          month: new Date().toISOString().slice(0, 7),
          rating: "",
          ratedByEmployeeId: loggedInEmployeeId || "",
          feedback: "",
        },
      ]);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">KPI Ratings</h2>
      {kpiRatings.map((rating, index) => (
        <div key={index} className="border p-4 mb-4 rounded">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Employee Name"
              value={selectedUser?.fullName || ""}
              readOnly
              className="border p-2 rounded bg-gray-100 cursor-not-allowed"
            />

            <select
              value={rating.kpiId}
              onChange={(e) => updateRating(index, "kpiId", e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">Select KPI</option>
              {kpiOptions.map((item) => (
                <option key={item.kpiId} value={item.kpiId}>
                  {item.kraName} - {item.kpiDescription}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Target"
              value={rating.target}
              onChange={(e) => updateRating(index, "target", e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Tasks"
              value={rating.tasks}
              onChange={(e) => updateRating(index, "tasks", e.target.value)}
              className="border p-2 rounded"
            />
            <select
              name="month"
              value={rating.month}
              onChange={(e) => updateRating(index, "month", e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">Select Month</option>
              {Array.from({ length: 12 }, (_, i) => {
                const month = `2025-${String(i + 1).padStart(2, "0")}`;
                return (
                  <option key={month} value={month}>
                    {new Date(`${month}-01`).toLocaleString("default", {
                      month: "long",
                    })}
                  </option>
                );
              })}
            </select>

            <input
              type="number"
              placeholder="Rating"
              value={rating.rating}
              onChange={(e) => updateRating(index, "rating", e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Rated By (Your Employee ID)"
              value={rating.ratedByEmployeeId}
              readOnly
              className="border p-2 rounded bg-gray-100 cursor-not-allowed"
            />
            <textarea
              placeholder="Feedback"
              value={rating.feedback}
              onChange={(e) => updateRating(index, "feedback", e.target.value)}
              className="border p-2 rounded col-span-2"
            />
          </div>
        </div>
      ))}
      <div className="flex gap-2">
        <button
          onClick={addRating}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          + Add Another Rating
        </button>
        <button
          onClick={handleSubmit}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Submit KPI Ratings
        </button>
      </div>

      {message && <p className="text-green-600 mt-2">{message}</p>}
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
};

export default KPIRatingsFormManager;
