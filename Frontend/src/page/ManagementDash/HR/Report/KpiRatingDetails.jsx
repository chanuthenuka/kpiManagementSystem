import React, { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";

const KpiAndCompetencyRatingDetails = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [kpiRatings, setKpiRatings] = useState([]);
  const [competencyRatings, setCompetencyRatings] = useState([]);
  const [loading, setLoading] = useState(false);

  const getQuarter = (month) => {
    const m = month?.toLowerCase();
    if (["january", "february", "march"].includes(m)) return "Q1";
    if (["april", "may", "june"].includes(m)) return "Q2";
    if (["july", "august", "september"].includes(m)) return "Q3";
    if (["october", "november", "december"].includes(m)) return "Q4";
    return "Unknown";
  };

  const fetchRatings = async () => {
    if (!employeeId.trim()) {
      alert("Please enter a valid Employee ID");
      return;
    }

    setLoading(true);
    try {
      const [kpiRes, compRes] = await Promise.all([
        axios.get(
          `http://localhost:5000/api/kpi-ratings/employee/${employeeId}`,
          { withCredentials: true }
        ),
        axios.get(
          `http://localhost:5000/api/competency-ratings/employee/${employeeId}`,
          { withCredentials: true }
        ),
      ]);

      setKpiRatings(
        kpiRes.data.map((item) => ({
          ...item,
          quarter: getQuarter(item.month),
        }))
      );
      setCompetencyRatings(
        compRes.data.map((item) => ({
          ...item,
          quarter: getQuarter(item.month),
        }))
      );
    } catch (error) {
      console.error("Error fetching ratings:", error);
      alert("Failed to fetch ratings");
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    let y = 20; // Starting Y position

    // Title
    doc.setFontSize(18);
    doc.text("Employee Ratings Overview", 14, y);
    y += 10;

    // KPI Ratings Section
    doc.setFontSize(14);
    doc.text("KPI Ratings", 14, y);
    y += 10;

    if (kpiRatings.length > 0) {
      // Table Headers
      doc.setFontSize(10);
      const headers = [
        "Quarter",
        "Month",
        "KRA",
        "KPI",
        "Weight",
        "Target",
        "Tasks",
        "Rating",
        "Extra Rating",
        "Rated By",
        "Feedback",
      ];
      let x = 14;
      headers.forEach((header) => {
        doc.text(header, x, y);
        x += 20; // Adjust column width
      });
      y += 5;
      doc.line(14, y, 196, y); // Draw header line
      y += 5;

      // Table Rows
      kpiRatings.forEach((row) => {
        x = 14;
        doc.text(row.quarter || "", x, y);
        x += 20;
        doc.text(row.month || "", x, y);
        x += 20;
        doc.text((row.kraDescription || "").substring(0, 10), x, y);
        x += 20; // Truncate for brevity
        doc.text((row.kpiDescription || "").substring(0, 10), x, y);
        x += 20;
        doc.text(row.weitage?.toString() || "", x, y);
        x += 20;
        doc.text(row.target?.toString() || "", x, y);
        x += 20;
        doc.text((row.tasks || "").substring(0, 10), x, y);
        x += 20;
        doc.text(row.rating?.toString() || "", x, y);
        x += 20;
        doc.text(row.extraRating?.toString() || "", x, y);
        x += 20;
        doc.text(row.ratedByEmployee || "", x, y);
        x += 20;
        doc.text((row.feedback || "").substring(0, 10), x, y);
        y += 10;
      });
    } else {
      doc.setFontSize(12);
      doc.text("No KPI Ratings found.", 14, y);
      y += 10;
    }

    y += 10;

    // Competency Ratings Section
    doc.setFontSize(14);
    doc.text("Competency Ratings", 14, y);
    y += 10;

    if (competencyRatings.length > 0) {
      // Table Headers
      doc.setFontSize(10);
      const compHeaders = [
        "Quarter",
        "Month",
        "Competency",
        "Is Senior Manager",
        "Rating",
        "Rated By",
        "Status",
        "Feedback",
      ];
      let x = 14;
      compHeaders.forEach((header) => {
        doc.text(header, x, y);
        x += 24; // Adjust column width
      });
      y += 5;
      doc.line(14, y, 196, y); // Draw header line
      y += 5;

      // Table Rows
      competencyRatings.forEach((row) => {
        x = 14;
        doc.text(row.quarter || "", x, y);
        x += 24;
        doc.text(row.month || "", x, y);
        x += 24;
        doc.text((row.competencyDescription || "").substring(0, 10), x, y);
        x += 24;
        doc.text(row.isSeniorManager ? "Yes" : "No", x, y);
        x += 24;
        doc.text(row.rating?.toString() || "", x, y);
        x += 24;
        doc.text(row.ratedByEmployee || "", x, y);
        x += 24;
        doc.text(row.status || "", x, y);
        x += 24;
        doc.text((row.feedback || "").substring(0, 10), x, y);
        y += 10;
      });
    } else {
      doc.setFontSize(12);
      doc.text("No Competency Ratings found.", 14, y);
      y += 10;
    }

    doc.save(`Employee_${employeeId}_Ratings.pdf`);
  };

  // Styles for tables (for UI, unchanged)
  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "1rem",
  };

  const thStyle = {
    border: "1px solid #ccc",
    padding: "8px",
    backgroundColor: "#f2f2f2",
    textAlign: "left",
  };

  const tdStyle = {
    border: "1px solid #ccc",
    padding: "8px",
    textAlign: "left",
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h2 style={{ textAlign: "center" }}>Employee Ratings Overview</h2>

      <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <input
          type="text"
          placeholder="Enter Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          style={{ padding: "0.5rem", width: "200px", marginRight: "1rem" }}
        />
        <button
          onClick={fetchRatings}
          disabled={loading}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "black",
            color: "white",
            border: "none",
            cursor: "pointer",
            borderRadius: "4px",
            marginRight: "1rem",
          }}
        >
          {loading ? "Loading..." : "Get Ratings"}
        </button>

        <button
          onClick={generatePDF}
          disabled={loading || !employeeId.trim()}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            cursor: "pointer",
            borderRadius: "4px",
          }}
        >
          Download PDF
        </button>
      </div>

      {/* KPI Ratings Table */}
      <h3>KPI Ratings</h3>
      {kpiRatings.length > 0 ? (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Quarter</th>
              <th style={thStyle}>Month</th>
              <th style={thStyle}>KRA</th>
              <th style={thStyle}>KPI</th>
              <th style={thStyle}>Weight</th>
              <th style={thStyle}>Target</th>
              <th style={thStyle}>Tasks</th>
              <th style={thStyle}>Rating</th>
              <th style={thStyle}>Extra Rating</th>
              <th style={thStyle}>Rated By</th>
              <th style={thStyle}>Feedback</th>
            </tr>
          </thead>
          <tbody>
            {kpiRatings.map((row, idx) => (
              <tr key={idx}>
                <td style={tdStyle}>{row.quarter}</td>
                <td style={tdStyle}>{row.month}</td>
                <td style={tdStyle}>{row.kraDescription}</td>
                <td style={tdStyle}>{row.kpiDescription}</td>
                <td style={tdStyle}>{row.weitage}</td>
                <td style={tdStyle}>{row.target}</td>
                <td style={tdStyle}>{row.tasks}</td>
                <td style={tdStyle}>{row.rating}</td>
                <td style={tdStyle}>{row.extraRating}</td>
                <td style={tdStyle}>{row.ratedByEmployee}</td>
                <td style={tdStyle}>{row.feedback}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p>No KPI Ratings found.</p>
      )}

      {/* Competency Ratings Table */}
      <h3 style={{ marginTop: "2rem" }}>Competency Ratings</h3>
      {competencyRatings.length > 0 ? (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Quarter</th>
              <th style={thStyle}>Month</th>
              <th style={thStyle}>Competency</th>
              <th style={thStyle}>Is Senior Manager</th>
              <th style={thStyle}>Rating</th>
              <th style={thStyle}>Rated By</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Feedback</th>
            </tr>
          </thead>
          <tbody>
            {competencyRatings.map((row, idx) => (
              <tr key={idx}>
                <td style={tdStyle}>{row.quarter}</td>
                <td style={tdStyle}>{row.month}</td>
                <td style={tdStyle}>{row.competencyDescription}</td>
                <td style={tdStyle}>{row.isSeniorManager ? "Yes" : "No"}</td>
                <td style={tdStyle}>{row.rating}</td>
                <td style={tdStyle}>{row.ratedByEmployee}</td>
                <td style={tdStyle}>{row.status}</td>
                <td style={tdStyle}>{row.feedback}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p>No Competency Ratings found.</p>
      )}
    </div>
  );
};

export default KpiAndCompetencyRatingDetails;
