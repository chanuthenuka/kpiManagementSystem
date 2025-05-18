import React, { useEffect, useState } from "react";
import axios from "axios";

const CompetencyRatingsForm = ({ selectedUser }) => {
  const [formData, setFormData] = useState({
    employeeId: "",
    competencyId: "",
    month: "",
    rating: "",
    ratedByEmployeeId: "",
    feedback: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [competencies, setCompetencies] = useState([]);
  const [selectedYear, setSelectedYear] = useState("2025"); // Default to current year

  const years = ["2020", "2021", "2022", "2023", "2024", "2025", "2026"];
  const loggedInId = localStorage.getItem("employeeId") || "";

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      ratedByEmployeeId: loggedInId,
      employeeId: selectedUser?.employeeId || "",
      month: `${selectedYear}-01`, // Initialize month with selected year
    }));
  }, [selectedUser, loggedInId, selectedYear]);

  // useEffect(() => {
  //   console.log("Selected user:", selectedUser);
  // }, [selectedUser]);

  useEffect(() => {
    const fetchCompetencies = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/competency?year=${selectedYear}`,
          {
            withCredentials: true,
          }
        );
        // Client-side filtering as a fallback
        const filteredCompetencies = response.data.filter(
          (c) => c.year === selectedYear || !selectedYear
        );
        setCompetencies(filteredCompetencies);
      } catch (error) {
        console.error("Error fetching competencies:", error);
        setError("Failed to fetch competencies");
        setCompetencies([]);
      }
    };

    fetchCompetencies();
  }, [selectedYear]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    if (!formData.competencyId || !formData.month || !formData.rating) {
      setError(
        "Please fill in all required fields (Competency, Month, Rating)"
      );
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/competency-ratings",
        formData,
        {
          withCredentials: true,
        }
      );

      setMessage("Competency rating saved successfully");
      setFormData({
        employeeId: selectedUser?.employeeId || "",
        competencyId: "",
        month: `${selectedYear}-01`,
        rating: "",
        ratedByEmployeeId: loggedInId,
        feedback: "",
      });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit rating");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Competency Rating</h2>
      <div className="border p-4 rounded">
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

        <div className="grid grid-cols-2 gap-4">
          {/* Hidden input to submit the employee ID */}
          <input type="hidden" name="employeeId" value={formData.employeeId} />

          {/* Visible input to show the employee name */}
          <input
            type="text"
            name="employeeDisplay"
            placeholder="Employee Name"
            value={selectedUser?.employeeName || ""}
            className="border p-2 rounded bg-gray-100 cursor-not-allowed"
            readOnly
          />

          <select
            name="competencyId"
            value={formData.competencyId}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Select Competency</option>
            {competencies.length > 0 ? (
              competencies.map((c) => (
                <option
                  key={c.competencyId}
                  value={c.competencyId}
                  className={
                    c.isSeniorManager === 1 ? "text-red-600 font-semibold" : ""
                  }
                >
                  {c.description} ({c.year})
                  {c.isSeniorManager === 1 ? " ⭐" : ""}
                </option>
              ))
            ) : (
              <option value="" disabled>
                No competencies available for {selectedYear || "selected year"}
              </option>
            )}
          </select>

          <select
            name="month"
            value={formData.month}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Select Month</option>
            {Array.from({ length: 12 }, (_, i) => {
              const month = `${selectedYear}-${String(i + 1).padStart(2, "0")}`;
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
            name="rating"
            placeholder="Rating"
            value={formData.rating}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          

          <textarea
            name="feedback"
            placeholder="Feedback"
            value={formData.feedback}
            onChange={handleChange}
            className="border p-2 rounded col-span-2"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="bg-black text-white px-4 py-2 rounded mt-4"
        >
          Submit Competency Rating
        </button>

        {message && <p className="text-green-600 mt-2">{message}</p>}
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default CompetencyRatingsForm;
