import axios from "axios";
import React, { useEffect, useState } from "react";

const KPIRatingsForm = ({ selectedUser }) => {
  const [kpiRatings, setKpiRatings] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [kpiOptions, setKpiOptions] = useState([]);
  const [selectedYear, setSelectedYear] = useState("2025"); // Default to current year
  const [extraRating, setExtraRating] = useState("");

  const loggedInEmployeeId = localStorage.getItem("employeeId");
  const years = ["2020", "2021", "2022", "2023", "2024", "2025", "2026"];

  useEffect(() => {
    // Fetch KPIs based on selected year
    const fetchKpis = async () => {
      if (!selectedYear || !selectedUser?.departmentId) {
        setError("Please select a year and user with a valid department");
        console.log("selecteduserkpi", selectedUser);
        setKpiOptions([]);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/api/kpi/get-kra?year=${selectedYear}&departmentId=${selectedUser.departmentId}`,
          { withCredentials: true }
        );

        console.log("API Response:", response.data);
        setKpiOptions(response.data);
        setError(""); // Clear any previous errors
      } catch (err) {
        console.error(
          "Failed to fetch KPI data:",
          err.response?.data || err.message
        );
        setError(err.response?.data?.error || "Failed to fetch KPIs");
        setKpiOptions([]);
      }
    };

    fetchKpis();
  }, [selectedYear, selectedUser]);

  useEffect(() => {
    // Initialize ratings only if none exist
    if (kpiRatings.length === 0) {
      setKpiRatings([
        {
          employeeId: selectedUser?.employeeId || "",
          kpiId: "",
          target: "",
          tasks: "",
          month: `${selectedYear}-01`,
          rating: "",
          ratedByEmployeeId: loggedInEmployeeId || "",
          extraRating: "",
          feedback: "",
        },
      ]);
    }
  }, [selectedUser, loggedInEmployeeId, selectedYear]);

  const addRating = () => {
    setKpiRatings([
      ...kpiRatings,
      {
        employeeId: selectedUser?.employeeId || "",
        kpiId: "",
        target: "",
        tasks: "",
        month: `${selectedYear}-01`,
        rating: "",
        extraRating: "",
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

    // Validate inputs
    if (!selectedYear) {
      setError("Please select a year");
      return;
    }
    for (const rating of kpiRatings) {
      if (!rating.kpiId || !rating.month || !rating.rating) {
        setError("Please fill in all required fields (KPI, Month, Rating)");
        return;
      }
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/kpi-ratings",
        kpiRatings,
        { withCredentials: true }
      );

      if (response.status !== 200) {
        throw new Error(response.data.error || "Failed to submit ratings");
      }

      setMessage(response.data.message || "Ratings submitted successfully!");
      // Reset form
      setKpiRatings([
        {
          employeeId: selectedUser?.employeeId || "",
          kpiId: "",
          target: "",
          tasks: "",
          month: `${selectedYear}-01`,
          rating: "",
          ratedByEmployeeId: loggedInEmployeeId || "",
          extraRating: "",
          feedback: "",
        },
      ]);
    } catch (err) {
      setError(err.message || "Failed to submit ratings");
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">KPI Rating</h2>

      {/* Year Filter */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Select Year
        </label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="border p-2 rounded w-full max-w-xs"
        >
          <option value="">Select Year</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {kpiRatings.map((rating, index) => (
        <div key={index} className="border p-4 mb-4 rounded">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Employee Name"
              value={selectedUser?.employeeName || "Unknown"}
              readOnly
              className="border p-2 rounded bg-gray-100 cursor-not-allowed"
            />

            <select
              value={rating.kpiId}
              onChange={(e) => updateRating(index, "kpiId", e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">Select KPI</option>
              {kpiOptions.length > 0 ? (
                kpiOptions.map((item) => (
                  <option key={item.kpiId} value={item.kpiId}>
                    {item.kraName} - {item.kpiDescription} ({item.year})
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No KPIs available for {selectedYear || "selected year"}
                </option>
              )}
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
                const month = `${selectedYear}-${String(i + 1).padStart(
                  2,
                  "0"
                )}`;
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

export default KPIRatingsForm;
