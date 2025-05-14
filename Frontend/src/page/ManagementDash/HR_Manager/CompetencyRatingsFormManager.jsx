import React, { useEffect, useState } from "react";
import axios from "axios";

const CompetencyRatingsFormManager = ({ selectedUser }) => {
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

  useEffect(() => {
    const loggedInId = localStorage.getItem("employeeId") || "";

    setFormData((prev) => ({
      ...prev,
      ratedByEmployeeId: loggedInId,
      employeeId: selectedUser?.employeeId || "",
    }));
  }, [selectedUser]);

  useEffect(() => {
    console.log("Selected user:", selectedUser);
  }, [selectedUser]);

  useEffect(() => {
    const fetchCompetencies = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/competency",
          {
            withCredentials: true,
          }
        );
        setCompetencies(response.data);
      } catch (error) {
        console.error("Error fetching competencies:", error);
      }
    };
    fetchCompetencies();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/competency-ratings",
        formData,
        {
          withCredentials: true,
        }
      );

      setMessage("Competency rating saved successfully");
      setFormData((prev) => ({
        ...prev,
        competencyId: "",
        month: "",
        rating: "",
        feedback: "",
      }));
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit rating");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Competency Rating</h2>
      <div className="border p-4 rounded">
        <div className="grid grid-cols-2 gap-4">
          {/* Hidden input to submit the employee ID */}
          <input type="hidden" name="employeeId" value={formData.employeeId} />

          {/* Visible input to show the employee name */}
          <input
            type="text"
            name="employeeDisplay"
            placeholder="Employee Name"
            value={selectedUser?.fullName || ""}
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
            {competencies.map((c) => (
              <option key={c.competencyId} value={c.competencyId}>
                {c.description}
              </option>
            ))}
          </select>

          <select
            name="month"
            value={formData.month}
            onChange={handleChange}
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
            name="rating"
            placeholder="Rating"
            value={formData.rating}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            type="text"
            name="ratedByEmployeeId"
            placeholder="Rated By"
            value={formData.ratedByEmployeeId}
            className="border p-2 rounded bg-gray-100 cursor-not-allowed"
            readOnly
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

export default CompetencyRatingsFormManager;
