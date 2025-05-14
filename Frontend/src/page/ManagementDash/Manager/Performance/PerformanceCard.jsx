import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../../../components/Dash/Sidebar/Sidebar";

const PerformanceCard = () => {
  const { employeeId } = useParams();
  const [kpiRatings, setKpiRatings] = useState([]);
  const [loadingKpi, setLoadingKpi] = useState(true); // Separate loading state for KPIs
  const [loadingRatings, setLoadingRatings] = useState(true); // Separate loading state for ratings
  const [loadingCompetency, setLoadingCompetency] = useState(true);
  const [competencyRatings, setCompetencyRatings] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(""); // State for selected month
  const [selectedYear, setSelectedYear] = useState(""); // State for selected year
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [kpi, setkpi] = useState([]);
  const [actualScore, setActualScore] = useState(0); // Only rated KPIs
  const [fullScore, setFullScore] = useState(0); // Includes 0 for unrated
  const [competency, setCompetency] = useState([]);
  const [isSeniorManager, setIsSeniorManager] = useState(0);
  const [actualComScore, setActualComScore] = useState(0); // Only rated competencies
  const [fullComScore, setFullComScore] = useState(0); // Includes 0 for unrated competencies

  // Define years and months
  const years = ["2020", "2021", "2022", "2023", "2024", "2025", "2026"];
  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  useEffect(() => {
    const fetchkpi = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/kpi/get-kpi-by-year`,
          {
            params: { year: selectedYear }, // Correct query parameter format
            withCredentials: true,
          }
        );
        setkpi(response.data);
        // console.log("fetchkpi", response.data);
      } catch (error) {
        console.error("Error fetching KPI data:", error);
      } finally {
        setLoadingKpi(false);
      }
    };

    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/employees/${employeeId}`,
          { withCredentials: true }
        );
        console.log("User data:", response.data);
        setIsSeniorManager(response.data.isManager);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchCompetency = async () => {
      try {
        console.log(selectedYear, isSeniorManager);
        const response = await axios.get(
          `http://localhost:5000/api/competency/${selectedYear}/${isSeniorManager}`,
          {
            withCredentials: true,
          }
        );

        setCompetency(response.data);

        console.log("fetchCompetency", response.data);
      } catch (error) {
        console.error("Error fetching Competency data:", error);
      } finally {
        setLoadingCompetency(false);
      }
    };

    const fetchRatings = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/kpi-ratings/employee/${employeeId}`,
          { withCredentials: true }
        );
        setKpiRatings(response.data);
        // console.log("KPI ratings:", response.data);
      } catch (error) {
        console.error("Error fetching KPI ratings:", error);
      } finally {
        setLoadingRatings(false);
      }
    };

    const fetchCompetencyRatings = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/competency-ratings/employee/${employeeId}`,
          { withCredentials: true }
        );
        setCompetencyRatings(response.data);
      } catch (error) {
        console.error("Error fetching competency ratings:", error);
      } finally {
        setLoadingCompetency(false);
      }
    };

    // Conditionally fetch KPIs only if a year is selected
    if (selectedYear) {
      fetchkpi();
    } else {
      setkpi([]);
      setLoadingKpi(false);
    }
    fetchUser();
    fetchRatings();
    fetchCompetencyRatings();
    fetchCompetency();
  }, [employeeId, selectedMonth, selectedYear]); // Added selectedYear to dependencies

  // Use the provided useEffect for score calculation
  useEffect(() => {
    if (!kpi.length || !kpiRatings.length) return;

    let actualScore = 0;
    let fullScore = 0;
    let actualWeightage = 0;

    const selectedPeriod = `${selectedYear}-${String(selectedMonth).padStart(
      2,
      "0"
    )}`;

    kpi.forEach((k) => {
      const ratingObj = kpiRatings.find(
        (r) => r.kpiId === k.kpiId && r.month === selectedPeriod
      );
      if (ratingObj && typeof ratingObj.rating === "number") {
        const w = ratingObj.weitage / 100;
        actualScore += w * ratingObj.rating;
        actualWeightage += w;
        // console.log("actualScore", actualScore);
        // console.log("actualWeightage", actualWeightage);
      }

      const w = ratingObj ? ratingObj.weitage / 100 : 0;
      const rating = ratingObj ? ratingObj.rating : 0;
      fullScore += w * rating;
    });

    const normalizedActual =
      actualWeightage > 0 ? ((actualScore / actualWeightage) * 80) / 100 : 0;

    const normalizedFull = fullScore;

    setActualScore(normalizedActual);
    setFullScore(normalizedFull);
  }, [kpi, kpiRatings, selectedMonth, selectedYear]);

  useEffect(() => {
    if (!competency.length || !competencyRatings.length) return;

    let actualScore = 0;
    let fullScore = 0;
    let actualWeightage = 0;

    const selectedPeriod = `${selectedYear}-${String(selectedMonth).padStart(
      2,
      "0"
    )}`;

    console.log("month", selectedPeriod);

    const totalCompetencyWeightage = 20; // competencies contribute 20% to total score
    const perCompetencyWeight =
      totalCompetencyWeightage / competency.length / 100; // e.g. 0.05
    console.log("per", perCompetencyWeight);

    console.log("comR", competencyRatings);
    console.log("com", competency);

    competency.forEach((c) => {
      const ratingObj = competencyRatings.find(
        (r) => r.competencyId === c.competencyId && r.month === selectedPeriod
      );

      if (ratingObj && typeof ratingObj.rating === "number") {
        const rating = Number(ratingObj.rating);
        actualScore += perCompetencyWeight * rating;
        actualWeightage += perCompetencyWeight;
      }

      console.log("ratingObj", ratingObj);

      const rating = ratingObj ? ratingObj.rating : 0;
      console.log("rating", rating);
      fullScore += perCompetencyWeight * rating; // unrated treated as 0
    });

    console.log("actual", actualScore);
    console.log("full", fullScore);

    const normalizedActual =
      actualWeightage > 0
        ? (actualScore / actualWeightage) * totalCompetencyWeightage
        : 0;

    const normalizedFull = fullScore; // already reflects % out of 20

    setActualComScore(Number(normalizedActual.toFixed(2)));
    setFullComScore(Number(normalizedFull.toFixed(2)));
  }, [competencyRatings, competency, selectedMonth, selectedYear]);

  // Filter ratings based on selectedMonth and selectedYear
  const filteredKpiRatings = kpiRatings.filter((item) => {
    const [year, month] = item.month.split("-");
    return (
      (!selectedYear || year === selectedYear) &&
      (!selectedMonth || month === selectedMonth)
    );
  });

  const filteredCompetencyRatings = competencyRatings.filter((item) => {
    const [year, month] = item.month.split("-");
    return (
      (!selectedYear || year === selectedYear) &&
      (!selectedMonth || month === selectedMonth)
    );
  });

  // Function to map months to quarters
  const getQuarter = (month) => {
    const monthNum = parseInt(month.split("-")[1], 10);
    if (monthNum >= 1 && monthNum <= 3) return "Q1";
    if (monthNum >= 4 && monthNum <= 6) return "Q2";
    if (monthNum >= 7 && monthNum <= 9) return "Q3";
    if (monthNum >= 10 && monthNum <= 12) return "Q4";
    return "";
  };

  // Aggregate KPI ratings by kpiId
  const aggregatedKpiRatings = kpiRatings.reduce((acc, item) => {
    const key = item.kpiId;
    if (!acc[key]) {
      acc[key] = {
        kpiId: item.kpiId,
        kraDescription: item.kraDescription,
        kpiDescription: item.kpiDescription,
        target: item.target,
        tasks: item.tasks,
        weightage: item.weightage || "2", // Default to 2% if not provided
        Q1: [],
        Q2: [],
        Q3: [],
        Q4: [],
        feedback: item.feedback || "No comment",
      };
    }
    const quarter = getQuarter(item.month);
    if (quarter) {
      acc[key][quarter].push(parseFloat(item.rating) || 0);
    }
    return acc;
  }, {});

  // Aggregate Competency ratings by competencyId
  const aggregatedCompetencyRatings = competencyRatings.reduce((acc, item) => {
    const key = item.competencyId;
    if (!acc[key]) {
      acc[key] = {
        competencyId: item.competencyId,
        competencyDescription: item.competencyDescription,
        weightage: item.weightage || "20", // Default to 20% if not provided
        Q1: [],
        Q2: [],
        Q3: [],
        Q4: [],
        feedback: item.feedback || "No comment",
      };
    }
    const quarter = getQuarter(item.month);
    if (quarter) {
      acc[key][quarter].push(parseFloat(item.rating) || 0);
    }
    return acc;
  }, {});

  // Calculate average rating for a quarter
  const calculateAverage = (ratings) =>
    ratings.length
      ? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1)
      : "-";

  // Handle opening and closing the modal
  const handleCheckQuarterly = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="w-full p-8 mt-20 space-y-10">
        <h1 className="text-4xl font-bold text-gray-800">
          Performance Ratings
        </h1>

        {/* Month and Year Filter */}
        <div className="mb-6 flex space-x-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Filter by Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="border p-2 rounded w-full max-w-xs"
            >
              <option value="">All Years</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Filter by Month
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border p-2 rounded w-full max-w-xs"
            >
              <option value="">All Months</option>
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* KPI Rating Table */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            KPI Rating
          </h2>
          {loadingRatings || loadingKpi ? (
            <p className="text-gray-500">Loading...</p>
          ) : filteredKpiRatings.length === 0 ? (
            <p className="text-gray-500">
              {selectedYear || selectedMonth
                ? `No KPI ratings found for ${selectedYear || "any year"} and ${
                    months.find((m) => m.value === selectedMonth)?.label ||
                    "any month"
                  }.`
                : "No KPI ratings found."}
            </p>
          ) : (
            <>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      KRA Name
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      KPI Name
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      Target
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      Task
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      Month
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      Rating
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      Weightage
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      Feedback
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredKpiRatings.map((item) => (
                    <tr key={item.kpiRatingId}>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {item.kraDescription}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {item.kpiDescription}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {item.target}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {item.tasks}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {item.month}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {item.rating}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {item.weitage}%
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {item.feedback || "No feedback provided"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Display Actual and Full Scores */}
              <div className="mt-4 flex space-x-8">
                <div>
                  <span className="text-sm font-semibold text-gray-700">
                    Actual Score:
                  </span>
                  <span className="text-sm text-gray-600 ml-2">
                    {actualScore.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-700">
                    Full Score:
                  </span>
                  <span className="text-sm text-gray-600 ml-2">
                    {fullScore.toFixed(2)}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Competency Rating Table */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Competency Rating
          </h2>
          {loadingCompetency ? (
            <p className="text-gray-500">Loading...</p>
          ) : filteredCompetencyRatings.length === 0 ? (
            <p className="text-gray-500">
              {selectedYear || selectedMonth
                ? `No competency ratings found for ${
                    selectedYear || "any year"
                  } and ${
                    months.find((m) => m.value === selectedMonth)?.label ||
                    "any month"
                  }.`
                : "No competency ratings found."}
            </p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                    Competency
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                    Month
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                    Weightage
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                    Feedback
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCompetencyRatings.map((item) => (
                  <tr key={item.competencyRatingId}>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {item.competencyDescription}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {item.rating}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {item.month}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {item.weitage}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {item.feedback || "No feedback provided"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {/* Display Actual and Full Scores */}
          <div className="mt-4 flex space-x-8">
            <div>
              <span className="text-sm font-semibold text-gray-700">
                Actual Score:
              </span>
              <span className="text-sm text-gray-600 ml-2">
                {actualComScore.toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-700">
                Full Score:
              </span>
              <span className="text-sm text-gray-600 ml-2">
                {fullComScore.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Check Quarterly Button */}
        <button
          onClick={handleCheckQuarterly}
          className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
        >
          Check Quarterly
        </button>

        {/* Modal for Quarterly Calculations */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-5xl p-6 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  Quarterly Performance Ratings
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-600 hover:text-gray-800 text-xl font-bold"
                >
                  ×
                </button>
              </div>

              {/* KPI Quarterly Ratings Table */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">
                  KPI Quarterly Ratings
                </h3>
                {loadingRatings ? (
                  <p className="text-gray-500">Loading...</p>
                ) : Object.values(aggregatedKpiRatings).length === 0 ? (
                  <p className="text-gray-500">No KPI ratings found.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                            KRA
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                            KPI
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                            Target
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                            Tasks
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                            Weightage
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 min-w-[100px]">
                            Q1
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 min-w-[100px]">
                            Q2
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 min-w-[100px]">
                            Q3
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 min-w-[100px]">
                            Q4
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 min-w-[100px]">
                            Mid-year
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 min-w-[100px]">
                            Year-end
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 min-w-[100px]">
                            Manager Comment
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {Object.values(aggregatedKpiRatings).map((item) => (
                          <tr key={item.kpiId}>
                            <td className="px-4 py-2 text-sm text-gray-600">
                              {item.kraDescription}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-600">
                              {item.kpiDescription}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-600">
                              {item.target}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-600">
                              {item.tasks}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-600">
                              {item.weightage ? `${item.weightage}%` : "N/A"}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-600 min-w-[100px]">
                              {calculateAverage(item.Q1)}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-600 min-w-[100px]">
                              {calculateAverage(item.Q2)}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-600 min-w-[100px]">
                              {calculateAverage(item.Q3)}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-600 min-w-[100px]">
                              {calculateAverage(item.Q4)}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-600 min-w-[100px]">
                              {calculateAverage([...item.Q1, ...item.Q2])}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-600 min-w-[100px]">
                              {calculateAverage([
                                ...item.Q1,
                                ...item.Q2,
                                ...item.Q3,
                                ...item.Q4,
                              ])}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-600 min-w-[100px]">
                              {item.feedback}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Competency Quarterly Ratings Table */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-700">
                  Competency Quarterly Ratings
                </h3>
                {loadingCompetency ? (
                  <p className="text-gray-500">Loading...</p>
                ) : Object.values(aggregatedCompetencyRatings).length === 0 ? (
                  <p className="text-gray-500">No competency ratings found.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                            Competency
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                            Weightage
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 min-w-[100px]">
                            Q1
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 min-w-[100px]">
                            Q2
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 min-w-[100px]">
                            Q3
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 min-w-[100px]">
                            Q4
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 min-w-[100px]">
                            Mid-year
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 min-w-[100px]">
                            Year-end
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 min-w-[100px]">
                            Manager Comment
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {Object.values(aggregatedCompetencyRatings).map(
                          (item) => (
                            <tr key={item.competencyId}>
                              <td className="px-4 py-2 text-sm text-gray-600">
                                {item.competencyDescription}
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-600">
                                {item.weightage ? `${item.weightage}%` : "N/A"}
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-600 min-w-[100px]">
                                {calculateAverage(item.Q1)}
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-600 min-w-[100px]">
                                {calculateAverage(item.Q2)}
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-600 min-w-[100px]">
                                {calculateAverage(item.Q3)}
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-600 min-w-[100px]">
                                {calculateAverage(item.Q4)}
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-600 min-w-[100px]">
                                {calculateAverage([...item.Q1, ...item.Q2])}
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-600 min-w-[100px]">
                                {calculateAverage([
                                  ...item.Q1,
                                  ...item.Q2,
                                  ...item.Q3,
                                  ...item.Q4,
                                ])}
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-600 min-w-[100px]">
                                {item.feedback}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceCard;
