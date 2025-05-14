import React, { useState } from "react";
import Sidebar from "../../../../components/Dash/Sidebar/Sidebar";

const OnRatings = () => {
  const [selectedYear, setSelectedYear] = useState("2023");
  const [activeTab, setActiveTab] = useState("monthly"); // 'monthly' or 'quarterly'
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);
  const [selectedMonthOrQuarter, setSelectedMonthOrQuarter] = useState("");
  const [selectedType, setSelectedType] = useState(""); // 'kpi' or 'competency'
  const [ratingValue, setRatingValue] = useState("");
  const [feedbackValue, setFeedbackValue] = useState("");

  // All months of the year
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Sample data initialized with useState
  const [kpiData, setKpiData] = useState([
    {
      kra: "Sales",
      kpi: "Revenue Growth",
      targetAchievement: "Increase sales by 10%",
      tasks: "Target key clients",
      weightage: "20%",
      ratings: {
        "January": "80%", "February": "82%", "March": "85%",
        "April": "87%", "May": "88%", "June": "89%",
        "July": "90%", "August": "91%", "September": "92%",
        "October": "85%", "November": "90%", "December": "95%"
      },
      feedback: {}
    }
  ]);

  const [competencyData, setCompetencyData] = useState([
    {
      competency: "Communication",
      description: "Ability to convey ideas clearly",
      weightage: "15%",
      ratings: {
        "January": "88%", "February": "89%", "March": "90%",
        "April": "91%", "May": "92%", "June": "93%",
        "July": "94%", "August": "95%", "September": "96%",
        "October": "90%", "November": "92%", "December": "94%"
      },
      feedback: {}
    }
  ]);

  const [quarterlyKpiData, setQuarterlyKpiData] = useState([
    {
      kra: "Sales",
      kpi: "Revenue Growth",
      targetAchievement: "Increase sales by 10%",
      tasks: "Target key clients",
      weightage: "20%",
      q1Achievement: "5%", q2Achievement: "5%", q3Achievement: "5%", q4Achievement: "5%",
      midYear: "5%", yearEnd: "5%",
      managerComment: "Consistent performance"
    }
  ]);

  const [quarterlyCompetencyData, setQuarterlyCompetencyData] = useState([
    {
      competency: "Communication",
      description: "Ability to convey ideas clearly",
      weightage: "15%",
      q1Achievement: "3%", q2Achievement: "3%", q3Achievement: "3%", q4Achievement: "3%",
      midYear: "3%", yearEnd: "3%",
      managerComment: "Good communication skills"
    }
  ]);

  // Handle rating click to open popup
  const handleRatingClick = (rating, monthOrQuarter, type, dataIndex) => {
    setSelectedRating({ rating, dataIndex });
    setSelectedMonthOrQuarter(monthOrQuarter);
    setSelectedType(type);
    setRatingValue(rating || "");
    setFeedbackValue(
      type === "kpi"
        ? (activeTab === "monthly"
            ? kpiData[dataIndex].feedback[monthOrQuarter] || ""
            : quarterlyKpiData[dataIndex].managerComment || "")
        : (activeTab === "monthly"
            ? competencyData[dataIndex].feedback[monthOrQuarter] || ""
            : quarterlyCompetencyData[dataIndex].managerComment || "")
    );
    setIsPopupOpen(true);
  };

  // Handle popup save
  const handleSaveRating = () => {
    if (selectedType === "kpi") {
      if (activeTab === "monthly") {
        const updatedKpiData = [...kpiData];
        updatedKpiData[selectedRating.dataIndex].ratings[selectedMonthOrQuarter] = ratingValue;
        updatedKpiData[selectedRating.dataIndex].feedback[selectedMonthOrQuarter] = feedbackValue;
        setKpiData(updatedKpiData);
      } else {
        const updatedQuarterlyKpiData = [...quarterlyKpiData];
        if (selectedMonthOrQuarter === "Q1") updatedQuarterlyKpiData[selectedRating.dataIndex].q1Achievement = ratingValue;
        if (selectedMonthOrQuarter === "Q2") updatedQuarterlyKpiData[selectedRating.dataIndex].q2Achievement = ratingValue;
        if (selectedMonthOrQuarter === "Q3") updatedQuarterlyKpiData[selectedRating.dataIndex].q3Achievement = ratingValue;
        if (selectedMonthOrQuarter === "Q4") updatedQuarterlyKpiData[selectedRating.dataIndex].q4Achievement = ratingValue;
        if (selectedMonthOrQuarter === "Mid-year") updatedQuarterlyKpiData[selectedRating.dataIndex].midYear = ratingValue;
        if (selectedMonthOrQuarter === "Year-end") updatedQuarterlyKpiData[selectedRating.dataIndex].yearEnd = ratingValue;
        updatedQuarterlyKpiData[selectedRating.dataIndex].managerComment = feedbackValue;
        setQuarterlyKpiData(updatedQuarterlyKpiData);
      }
    } else if (selectedType === "competency") {
      if (activeTab === "monthly") {
        const updatedCompetencyData = [...competencyData];
        updatedCompetencyData[selectedRating.dataIndex].ratings[selectedMonthOrQuarter] = ratingValue;
        updatedCompetencyData[selectedRating.dataIndex].feedback[selectedMonthOrQuarter] = feedbackValue;
        setCompetencyData(updatedCompetencyData);
      } else {
        const updatedQuarterlyCompetencyData = [...quarterlyCompetencyData];
        if (selectedMonthOrQuarter === "Q1") updatedQuarterlyCompetencyData[selectedRating.dataIndex].q1Achievement = ratingValue;
        if (selectedMonthOrQuarter === "Q2") updatedQuarterlyCompetencyData[selectedRating.dataIndex].q2Achievement = ratingValue;
        if (selectedMonthOrQuarter === "Q3") updatedQuarterlyCompetencyData[selectedRating.dataIndex].q3Achievement = ratingValue;
        if (selectedMonthOrQuarter === "Q4") updatedQuarterlyCompetencyData[selectedRating.dataIndex].q4Achievement = ratingValue;
        if (selectedMonthOrQuarter === "Mid-year") updatedQuarterlyCompetencyData[selectedRating.dataIndex].midYear = ratingValue;
        if (selectedMonthOrQuarter === "Year-end") updatedQuarterlyCompetencyData[selectedRating.dataIndex].yearEnd = ratingValue;
        updatedQuarterlyCompetencyData[selectedRating.dataIndex].managerComment = feedbackValue;
        setQuarterlyCompetencyData(updatedQuarterlyCompetencyData);
      }
    }
    setIsPopupOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-200">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="w-full max-w-5xl bg-white rounded-lg shadow-md p-8 mx-auto mt-10">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Performance Ratings
            </h1>
            <div className="flex items-center gap-2">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <option value="2021">2021</option>
                <option value="2022">2022</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
              </select>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-4">
            <button
              className={`px-4 py-2 mr-2 rounded-lg ${activeTab === "monthly" ? "bg-black text-white" : "bg-gray-200 text-gray-900"}`}
              onClick={() => setActiveTab("monthly")}
            >
              Monthly Ratings
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${activeTab === "quarterly" ? "bg-black text-white" : "bg-gray-200 text-gray-900"}`}
              onClick={() => setActiveTab("quarterly")}
            >
              Quarterly Ratings
            </button>
          </div>

          {/* Conditional Rendering Based on Tab */}
          {activeTab === "monthly" ? (
            <>
              {/* KPI Ratings Table */}
              <h2 className="text-xl font-semibold text-gray-900 mb-4">KPI Ratings</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
                  <thead className="bg-gray-300">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">KRA</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">KPI</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Target for monthly achievement</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Specific tasks to be carried out</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Weightage</th>
                      {months.map((month) => (
                        <th
                          key={month}
                          className="px-4 py-2 text-left text-sm font-semibold text-gray-900 min-w-[100px]"
                        >
                          {month}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {kpiData.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm text-gray-900">{item.kra}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{item.kpi}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{item.targetAchievement}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{item.tasks}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{item.weightage}</td>
                        {months.map((month) => (
                          <td
                            key={month}
                            className="px-4 py-2 text-sm text-gray-900 min-w-[100px] cursor-pointer hover:bg-gray-100"
                            onClick={() => handleRatingClick(item.ratings[month], month, "kpi", index)}
                          >
                            {item.ratings[month] || "-"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Competency Ratings Table */}
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">Competency Ratings</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
                  <thead className="bg-gray-300">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Competency</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Description</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Weightage</th>
                      {months.map((month) => (
                        <th
                          key={month}
                          className="px-4 py-2 text-left text-sm font-semibold text-gray-900 min-w-[100px]"
                        >
                          {month}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {competencyData.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm text-gray-900">{item.competency}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{item.description}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{item.weightage}</td>
                        {months.map((month) => (
                          <td
                            key={month}
                            className="px-4 py-2 text-sm text-gray-900 min-w-[100px] cursor-pointer hover:bg-gray-100"
                            onClick={() => handleRatingClick(item.ratings[month], month, "competency", index)}
                          >
                            {item.ratings[month] || "-"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <>
              {/* KPI Quarterly Ratings Table */}
              <h2 className="text-xl font-semibold text-gray-900 mb-4">KPI Quarterly Ratings</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
                  <thead className="bg-gray-700 text-white">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-semibold">KRA</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold">KPI</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold">Target for quarterly achievement</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold">Specific tasks to be carried out</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold">Weightage</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold min-w-[100px]">Q1 %</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold min-w-[100px]">Q2 %</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold min-w-[100px]">Q3 %</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold min-w-[100px]">Q4 %</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold min-w-[100px]">Mid-year %</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold min-w-[100px]">Year-end %</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold min-w-[150px]">Manager Comment</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {quarterlyKpiData.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm text-gray-900">{item.kra}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{item.kpi}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{item.targetAchievement}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{item.tasks}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{item.weightage}</td>
                        <td
                          className="px-4 py-2 text-sm text-gray-900 min-w-[100px] cursor-pointer hover:bg-gray-100"
                          onClick={() => handleRatingClick(item.q1Achievement, "Q1", "kpi", index)}
                        >
                          {item.q1Achievement || "-"}
                        </td>
                        <td
                          className="px-4 py-2 text-sm text-gray-900 min-w-[100px] cursor-pointer hover:bg-gray-100"
                          onClick={() => handleRatingClick(item.q2Achievement, "Q2", "kpi", index)}
                        >
                          {item.q2Achievement || "-"}
                        </td>
                        <td
                          className="px-4 py-2 text-sm text-gray-900 min-w-[100px] cursor-pointer hover:bg-gray-100"
                          onClick={() => handleRatingClick(item.q3Achievement, "Q3", "kpi", index)}
                        >
                          {item.q3Achievement || "-"}
                        </td>
                        <td
                          className="px-4 py-2 text-sm text-gray-900 min-w-[100px] cursor-pointer hover:bg-gray-100"
                          onClick={() => handleRatingClick(item.q4Achievement, "Q4", "kpi", index)}
                        >
                          {item.q4Achievement || "-"}
                        </td>
                        <td
                          className="px-4 py-2 text-sm text-gray-900 min-w-[100px] cursor-pointer hover:bg-gray-100"
                          onClick={() => handleRatingClick(item.midYear, "Mid-year", "kpi", index)}
                        >
                          {item.midYear || "-"}
                        </td>
                        <td
                          className="px-4 py-2 text-sm text-gray-900 min-w-[100px] cursor-pointer hover:bg-gray-100"
                          onClick={() => handleRatingClick(item.yearEnd, "Year-end", "kpi", index)}
                        >
                          {item.yearEnd || "-"}
                        </td>
                        <td
                          className="px-4 py-2 text-sm text-gray-900 min-w-[150px] cursor-pointer hover:bg-gray-100"
                          onClick={() => handleRatingClick(item.managerComment, "Manager Comment", "kpi", index)}
                        >
                          {item.managerComment || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Competency Quarterly Ratings Table */}
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">Competency Quarterly Ratings</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
                  <thead className="bg-gray-700 text-white">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-semibold">Competency</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold">Description</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold">Weightage</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold min-w-[100px]">Q1 %</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold min-w-[100px]">Q2 %</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold min-w-[100px]">Q3 %</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold min-w-[100px]">Q4 %</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold min-w-[100px]">Mid-year %</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold min-w-[100px]">Year-end %</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold min-w-[150px]">Manager Comment</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {quarterlyCompetencyData.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm text-gray-900">{item.competency}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{item.description}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{item.weightage}</td>
                        <td
                          className="px-4 py-2 text-sm text-gray-900 min-w-[100px] cursor-pointer hover:bg-gray-100"
                          onClick={() => handleRatingClick(item.q1Achievement, "Q1", "competency", index)}
                        >
                          {item.q1Achievement || "-"}
                        </td>
                        <td
                          className="px-4 py-2 text-sm text-gray-900 min-w-[100px] cursor-pointer hover:bg-gray-100"
                          onClick={() => handleRatingClick(item.q2Achievement, "Q2", "competency", index)}
                        >
                          {item.q2Achievement || "-"}
                        </td>
                        <td
                          className="px-4 py-2 text-sm text-gray-900 min-w-[100px] cursor-pointer hover:bg-gray-100"
                          onClick={() => handleRatingClick(item.q3Achievement, "Q3", "competency", index)}
                        >
                          {item.q3Achievement || "-"}
                        </td>
                        <td
                          className="px-4 py-2 text-sm text-gray-900 min-w-[100px] cursor-pointer hover:bg-gray-100"
                          onClick={() => handleRatingClick(item.q4Achievement, "Q4", "competency", index)}
                        >
                          {item.q4Achievement || "-"}
                        </td>
                        <td
                          className="px-4 py-2 text-sm text-gray-900 min-w-[100px] cursor-pointer hover:bg-gray-100"
                          onClick={() => handleRatingClick(item.midYear, "Mid-year", "competency", index)}
                        >
                          {item.midYear || "-"}
                        </td>
                        <td
                          className="px-4 py-2 text-sm text-gray-900 min-w-[100px] cursor-pointer hover:bg-gray-100"
                          onClick={() => handleRatingClick(item.yearEnd, "Year-end", "competency", index)}
                        >
                          {item.yearEnd || "-"}
                        </td>
                        <td
                          className="px-4 py-2 text-sm text-gray-900 min-w-[150px] cursor-pointer hover:bg-gray-100"
                          onClick={() => handleRatingClick(item.managerComment, "Manager Comment", "competency", index)}
                        >
                          {item.managerComment || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Popup for Editing Rating and Feedback */}
          {isPopupOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md z-[70]">
              <div className="bg-white p-6 rounded-lg w-3/4 max-h-[80vh] overflow-y-auto shadow-xl relative">
                <div className="flex items-center justify-between mb-6">
                  <button
                    className="text-gray-600 hover:text-gray-800"
                    onClick={() => setIsPopupOpen(false)}
                  >
                    ← Back
                  </button>
                  <h2 className="text-xl font-bold text-gray-900">
                    Edit Rating - {selectedMonthOrQuarter} ({selectedYear})
                  </h2>
                  <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-black text-white rounded-lg">
                      {selectedMonthOrQuarter}
                    </button>
                  </div>
                </div>

                {/* Conditional Table Based on Selected Type */}
                {selectedType === "kpi" ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">KPI Rating</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
                        <thead className="bg-gray-300">
                          <tr>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">KRA</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">KPI</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Target</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Tasks</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Weightage</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Rating</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Feedback</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-4 py-2 text-sm text-gray-900">
                              {kpiData[selectedRating.dataIndex].kra}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900">
                              {kpiData[selectedRating.dataIndex].kpi}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900">
                              {kpiData[selectedRating.dataIndex].targetAchievement}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900">
                              {kpiData[selectedRating.dataIndex].tasks}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900">
                              {kpiData[selectedRating.dataIndex].weightage}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900">
                              <input
                                type="text"
                                className="w-full px-2 py-1 border rounded"
                                value={ratingValue}
                                onChange={(e) => setRatingValue(e.target.value)}
                              />
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900">
                              <input
                                type="text"
                                className="w-full px-2 py-1 border rounded"
                                value={feedbackValue}
                                onChange={(e) => setFeedbackValue(e.target.value)}
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Competency Rating</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
                        <thead className="bg-gray-300">
                          <tr>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Competency</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Description</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Weightage</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Rating</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Feedback</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-4 py-2 text-sm text-gray-900">
                              {competencyData[selectedRating.dataIndex].competency}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900">
                              {competencyData[selectedRating.dataIndex].description}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900">
                              {competencyData[selectedRating.dataIndex].weightage}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900">
                              <input
                                type="text"
                                className="w-full px-2 py-1 border rounded"
                                value={ratingValue}
                                onChange={(e) => setRatingValue(e.target.value)}
                              />
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900">
                              <input
                                type="text"
                                className="w-full px-2 py-1 border rounded"
                                value={feedbackValue}
                                onChange={(e) => setFeedbackValue(e.target.value)}
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </>
                )}

                <div className="flex justify-end mt-4 space-x-2">
                  <button
                    className="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400"
                    onClick={() => setIsPopupOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                    onClick={handleSaveRating}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnRatings;