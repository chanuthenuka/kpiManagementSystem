import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../../../components/Dash/Sidebar/Sidebar";

const KPIQuarterly = ({ handleRatingClick }) => {
  const { employeeId } = useParams(); // employeeId
  const [kpiRatings, setKpiRatings] = useState([]);
  const [competencyRatings, setCompetencyRatings] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [employeeDepartmentId, setEmployeeDepartmentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingCompetency, setLoadingCompetency] = useState(true);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(""); // Default to no month filter
  const [selectedDepartment, setSelectedDepartment] = useState(""); // Default to no department filter

  // Generate month options for 2020–2026
  const years = ["2020", "2021", "2022", "2023", "2024", "2025", "2026"];
  const monthOptions = years.flatMap((year) =>
    Array.from({ length: 12 }, (_, i) => {
      const month = `${year}-${String(i + 1).padStart(2, "0")}`;
      return {
        value: month,
        label: `${new Date(`${month}-01`).toLocaleString("default", {
          month: "long",
        })} ${year}`,
      };
    })
  );

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/kpi-ratings/employee/${employeeId}`,
          { withCredentials: true }
        );
        setKpiRatings(response.data);
      } catch (error) {
        console.error("Error fetching KPI ratings:", error);
      } finally {
        setLoading(false);
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

    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/departments`,
          { withCredentials: true }
        );
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      } finally {
        setLoadingDepartments(false);
      }
    };

    const fetchEmployeeDepartment = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/employees/${employeeId}`,
          { withCredentials: true }
        );
        setEmployeeDepartmentId(response.data.departmentId);
      } catch (error) {
        console.error("Error fetching employee department:", error);
      }
    };

    fetchRatings();
    fetchCompetencyRatings();
    fetchDepartments();
    fetchEmployeeDepartment();
  }, [employeeId]);

  // Map months to quarters
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
        weitage: item.weitage,
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
        weitage: item.weitage || "20", // Placeholder if weitage is not provided
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

  // Filter ratings based on selectedMonth and selectedDepartment
  const filteredKpiRatings = Object.values(aggregatedKpiRatings).filter((item) => {
    const matchesMonth = selectedMonth
      ? getQuarter(item.month) === getQuarter(selectedMonth)
      : true;
    const matchesDepartment = selectedDepartment
      ? employeeDepartmentId === selectedDepartment
      : true;
    return matchesMonth && matchesDepartment;
  });

  const filteredCompetencyRatings = Object.values(
    aggregatedCompetencyRatings
  ).filter((item) => {
    const matchesMonth = selectedMonth
      ? getQuarter(item.month) === getQuarter(selectedMonth)
      : true;
    const matchesDepartment = selectedDepartment
      ? employeeDepartmentId === selectedDepartment
      : true;
    return matchesMonth && matchesDepartment;
  });

  // Calculate average rating for a quarter
  const calculateAverage = (ratings) =>
    ratings.length
      ? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1)
      : "-";

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="w-full p-8 mt-20 space-y-10">
        <h1 className="text-4xl font-bold text-gray-800">
          Quarterly Performance Ratings
        </h1>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Filter by Month
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border p-2 rounded w-full max-w-xs"
            >
              <option value="">Show All Months</option>
              {monthOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Filter by Department
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="border p-2 rounded w-full max-w-xs"
              disabled={loadingDepartments}
            >
              <option value="">Show All Departments</option>
              {departments.map((dept) => (
                <option key={dept.departmentId} value={dept.departmentId}>
                  {dept.departmentName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* KPI Quarterly Ratings Table */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            KPI Quarterly Ratings
          </h2>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : filteredKpiRatings.length === 0 ? (
            <p className="text-gray-500">
              {selectedMonth || selectedDepartment
                ? `No KPI ratings found for ${
                    selectedDepartment
                      ? departments.find(
                          (dept) => dept.departmentId === selectedDepartment
                        )?.departmentName || "selected department"
                      : ""
                  }${
                    selectedMonth && selectedDepartment ? " in " : ""
                  }${
                    selectedMonth
                      ? monthOptions.find((opt) => opt.value === selectedMonth)
                          ?.label || selectedMonth
                      : ""
                  }.`
                : "No KPI ratings found."}
            </p>
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
                    {[
                      "Q1",
                      "Q2",
                      "Q3",
                      "Q4",
                      "Mid-year",
                      "Year-end",
                      "Manager Comment",
                    ].map((period) => (
                      <th
                        key={period}
                        className="px-4 py-2 text-left text-sm font-semibold text-gray-700 min-w-[100px]"
                      >
                        {period} {period !== "Manager Comment" ? "%" : ""}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredKpiRatings.map((item, index) => (
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
                        {item.weitage ? `${item.weitage}%` : "N/A"}
                      </td>
                      {[
                        "Q1",
                        "Q2",
                        "Q3",
                        "Q4",
                        "Mid-year",
                        "Year-end",
                        "Manager Comment",
                      ].map((period) => (
                        <td
                          key={period}
                          className="px-4 py-2 text-sm text-gray-600 min-w-[100px] cursor-pointer hover:bg-gray-100"
                          onClick={() =>
                            handleRatingClick(
                              item.kpiId,
                              period,
                              "kpi",
                              index
                            )
                          }
                        >
                          {period === "Mid-year"
                            ? calculateAverage([...item.Q1, ...item.Q2])
                            : period === "Year-end"
                            ? calculateAverage([
                                ...item.Q1,
                                ...item.Q2,
                                ...item.Q3,
                                ...item.Q4,
                              ])
                            : period === "Manager Comment"
                            ? item.feedback
                            : calculateAverage(item[period])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Competency Quarterly Ratings Table */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Competency Quarterly Ratings
          </h2>
          {loadingCompetency ? (
            <p className="text-gray-500">Loading...</p>
          ) : filteredCompetencyRatings.length === 0 ? (
            <p className="text-gray-500">
              {selectedMonth || selectedDepartment
                ? `No competency ratings found for ${
                    selectedDepartment
                      ? departments.find(
                          (dept) => dept.departmentId === selectedDepartment
                        )?.departmentName || "selected department"
                      : ""
                  }${
                    selectedMonth && selectedDepartment ? " in " : ""
                  }${
                    selectedMonth
                      ? monthOptions.find((opt) => opt.value === selectedMonth)
                          ?.label || selectedMonth
                      : ""
                  }.`
                : "No competency ratings found."}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      Competency
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      Description
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      Weightage
                    </th>
                    {[
                      "Q1",
                      "Q2",
                      "Q3",
                      "Q4",
                      "Mid-year",
                      "Year-end",
                      "Manager Comment",
                    ].map((period) => (
                      <th
                        key={period}
                        className="px-4 py-2 text-left text-sm font-semibold text-gray-700 min-w-[100px]"
                      >
                        {period} {period !== "Manager Comment" ? "%" : ""}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCompetencyRatings.map((item, index) => (
                    <tr key={item.competencyId}>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {item.competencyDescription}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {item.competencyDescription}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {item.weitage ? `${item.weitage}%` : "N/A"}
                      </td>
                      {[
                        "Q1",
                        "Q2",
                        "Q3",
                        "Q4",
                        "Mid-year",
                        "Year-end",
                        "Manager Comment",
                      ].map((period) => (
                        <td
                          key={period}
                          className="px-4 py-2 text-sm text-gray-600 min-w-[100px] cursor-pointer hover:bg-gray-100"
                          onClick={() =>
                            handleRatingClick(
                              item.competencyId,
                              period,
                              "competency",
                              index
                            )
                          }
                        >
                          {period === "Mid-year"
                            ? calculateAverage([...item.Q1, ...item.Q2])
                            : period === "Year-end"
                            ? calculateAverage([
                                ...item.Q1,
                                ...item.Q2,
                                ...item.Q3,
                                ...item.Q4,
                              ])
                            : period === "Manager Comment"
                            ? item.feedback
                            : calculateAverage(item[period])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KPIQuarterly;