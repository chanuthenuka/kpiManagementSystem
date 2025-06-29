import React, { useState, useEffect } from "react";
import Sidebar from "../../../../components/Dash/Sidebar/Sidebar";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PendingRequestPopup from "./PendingRequestPopup.jsx";

const ManageKPIs = () => {
  const years = ["Year", "2026", "2025", "2024"];
  const [departments, setDepartments] = useState([]);
  const [kras, setKras] = useState([]);
  const [selectedKRA, setSelectedKRA] = useState("");
  const [kpiDescription, setKpiDescription] = useState("");
  const [weightage, setWeightage] = useState("");
  const [kpis, setKpis] = useState([]);
  const [selectedKPIs, setSelectedKPIs] = useState([]);
  const [editingKpiId, setEditingKpiId] = useState(null);
  const [selectedYear, setSelectedYear] = useState("");
  const [isPendingPopupOpen, setIsPendingPopupOpen] = useState(false);
  const [selectedDeptId, setSelectedDeptId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [prevWeightageSum, setPrevWeightageSum] = useState(0);

  // Filter KPIs based on selected department and year
  const filteredKPIs = kpis.filter((kpi) => {
    const matchesDept = selectedDeptId
      ? String(kpi.departmentId) === String(selectedDeptId)
      : true;
    const matchesYear =
      filterYear && filterYear !== "Year"
        ? String(kpi.year) === String(filterYear)
        : true;
    return matchesDept && matchesYear;
  });

  // Calculate total weightage and trigger alert if sum is 80
  useEffect(() => {
    const totalWeightage = filteredKPIs.reduce(
      (sum, kpi) => sum + Number(kpi.weightage || 0),
      0
    );
    if (totalWeightage === 80 && prevWeightageSum !== 80) {
      toast.info("Total weightage of KPIs has reached 80!", {
        position: "top-right",
        autoClose: 5000,
      });
    }
    setPrevWeightageSum(totalWeightage);
  }, [filteredKPIs, prevWeightageSum]);

  const handleSaveKPI = async () => {
    if (
      !selectedKRA ||
      !kpiDescription ||
      !weightage ||
      !departmentId ||
      !selectedYear
    ) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/kpi",
        {
          description: kpiDescription,
          weitage: weightage,
          kraId: selectedKRA,
          year: selectedYear,
          departmentId: departmentId,
        },
        { withCredentials: true }
      );

      const updatedKpis = await axios.get("http://localhost:5000/api/kpi", {
        withCredentials: true,
      });
      setKpis(updatedKpis.data);

      toast.success("Successfully saved KPI!");

      setSelectedKRA("");
      setKpiDescription("");
      setWeightage("");
    } catch (error) {
      console.error("Failed to save KPI:", error);
      toast.error("Failed to save KPI. Please try again.");
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedKPIs.length === 0) {
      toast.error("No KPI selected");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete selected KPIs?"
    );
    if (!confirmDelete) return;

    try {
      await Promise.all(
        selectedKPIs.map(async (id) => {
          await axios.delete(`http://localhost:5000/api/kpi/${id}`, {
            withCredentials: true,
          });
        })
      );

      setKpis((prevKpis) =>
        prevKpis.filter((kpi) => !selectedKPIs.includes(kpi.kpiId))
      );

      setSelectedKPIs([]);
      setSelectedKRA("");
      setKpiDescription("");
      setWeightage("");
      setEditingKpiId(null);
      setDepartmentId("");
      setSelectedYear("");
      toast.success("Selected KPIs deleted successfully");
    } catch (error) {
      console.error("Error deleting KPIs:", error);
      toast.error("Error deleting one or more KPIs.");
    }
  };

  const handleUpdateKPI = async () => {
    if (
      !editingKpiId ||
      !selectedKRA ||
      !kpiDescription ||
      !weightage ||
      !selectedYear
    ) {
      toast.error("Please select a KPI and fill all fields");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/kpi/${editingKpiId}`,
        {
          description: kpiDescription,
          weitage: weightage,
          kraId: selectedKRA,
          year: selectedYear,
          departmentId: departmentId,
        },
        { withCredentials: true }
      );

      const updatedKpis = await axios.get("http://localhost:5000/api/kpi", {
        withCredentials: true,
      });
      setKpis(updatedKpis.data);

      toast.success("KPI updated successfully!");

      setSelectedKRA("");
      setKpiDescription("");
      setWeightage("");
      setEditingKpiId(null);
      setSelectedKPIs([]);
      setDepartmentId("");
      setSelectedYear("");
    } catch (error) {
      console.error("Error updating KPI:", error);
      toast.error("Failed to update KPI");
    }
  };

  // Handle Select All checkbox
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedKPIs(filteredKPIs.map((kpi) => kpi.kpiId));
    } else {
      setSelectedKPIs([]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptRes, kraRes, KPIRes] = await Promise.all([
          axios.get("http://localhost:5000/api/department", {
            withCredentials: true,
          }),
          axios.get("http://localhost:5000/api/kra", {
            withCredentials: true,
          }),
          axios.get("http://localhost:5000/api/kpi", { 
            withCredentials: true 
          }),
        ]);
        setDepartments(deptRes.data);
        setKras(kraRes.data);
        setKpis(KPIRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex items-center justify-center p-6 m-8">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <ToastContainer position="top-right" autoClose={3000} />

          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Manage KPIs</h1>
            <button
              className="px-4 py-2 bg-black text-white rounded-xl font-semibold shadow-md hover:bg-gray-800 transition-all"
              onClick={() => setIsPendingPopupOpen(true)}
            >
              Pending Request
            </button>
          </div>

          {/* Department & Year & Filter */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm text-sm text-gray-900"
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.departmentId} value={dept.departmentId}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm text-sm text-gray-900"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* KPI Form */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                KRA
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm text-sm text-gray-900"
                value={selectedKRA}
                onChange={(e) => setSelectedKRA(e.target.value)}
              >
                {kras.filter((kra) => kra.year === selectedYear).length ===
                0 ? (
                  <option value="">No KRAs for the Selected Year</option>
                ) : (
                  <>
                    <option value="">Select KRA</option>
                    {kras
                      .filter((kra) => kra.year === selectedYear)
                      .map((kra) => (
                        <option key={kra.kraId} value={kra.kraId}>
                          {kra.description} ({kra.year})
                        </option>
                      ))}
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                KPI
              </label>
              <input
                type="text"
                placeholder="Enter KPI"
                value={kpiDescription}
                onChange={(e) => setKpiDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm text-sm text-gray-900"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Weightage
            </label>
            <input
              type="number"
              value={weightage}
              onChange={(e) => {
                const value = e.target.value;
                // Allow empty input for better UX when editing
                if (
                  value === "" ||
                  (/^\d+$/.test(value) && parseInt(value) <= 100)
                ) {
                  setWeightage(value);
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm text-sm text-gray-900"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 mb-6">
            {editingKpiId ? (
              <button
                onClick={handleUpdateKPI}
                className="px-6 py-2 bg-black text-white rounded-xl font-semibold shadow-md hover:bg-gray-800 transition-all duration-300 w-32"
              >
                Update
              </button>
            ) : (
              <button
                onClick={handleSaveKPI}
                className="px-6 py-2 bg-black text-white rounded-xl font-semibold shadow-md hover:bg-gray-800 transition-all duration-300 w-32"
              >
                Save
              </button>
            )}
            <button
              onClick={handleDeleteSelected}
              className="px-6 py-2 bg-black text-white rounded-xl font-semibold shadow-md hover:bg-red-700 transition-all duration-300 w-32"
            >
              Delete
            </button>
          </div>

          {/* KPI Table */}
          <div className="overflow-hidden rounded-xl border border-gray-300 bg-white shadow-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Department
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm text-sm text-gray-900"
                value={selectedDeptId}
                onChange={(e) => setSelectedDeptId(e.target.value)}
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept.departmentId} value={dept.departmentId}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Year
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm text-sm text-gray-900"
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
              >
                <option value="">All Years</option>
                {years
                  .filter((year) => year !== "Year")
                  .map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
              </select>
            </div>

            <div className="h-64 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-200 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-center">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-black"
                        onChange={handleSelectAll}
                        checked={
                          filteredKPIs.length > 0 &&
                          selectedKPIs.length === filteredKPIs.length
                        }
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      KRA
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      KPI
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Weightage
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Year
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredKPIs.length > 0 ? (
                    filteredKPIs.map((kpi) => {
                      const kra = kras.find((k) => k.kraId === kpi.kraId);
                      return (
                        <tr key={kpi.kpiId}>
                          <td className="px-4 py-4 text-center">
                            <input
                              type="checkbox"
                              checked={selectedKPIs.includes(kpi.kpiId)}
                              onChange={() => {
                                const isSelected = selectedKPIs.includes(
                                  kpi.kpiId
                                );
                                setSelectedKPIs((prev) =>
                                  isSelected
                                    ? prev.filter((id) => id !== kpi.kpiId)
                                    : [...prev, kpi.kpiId]
                                );
                                if (!isSelected) {
                                  setKpiDescription(kpi.description);
                                  setWeightage(kpi.weitage);
                                  setSelectedKRA(kpi.kraId);
                                  setEditingKpiId(kpi.kpiId);
                                  setDepartmentId(kpi.departmentId);
                                  setSelectedYear(kpi.year);
                                } else {
                                  setKpiDescription("");
                                  setWeightage("");
                                  setSelectedKRA("");
                                  setEditingKpiId(null);
                                  setDepartmentId("");
                                  setSelectedYear("");
                                }
                              }}
                              className="form-checkbox h-4 w-4 text-black"
                            />
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {kra ? kra.description : "Unknown"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {kpi.description}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {kpi.weitage}%
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {kpi.year}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        className="px-6 py-4 text-sm text-gray-500 italic text-center"
                        colSpan="5"
                      >
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {isPendingPopupOpen && (
        <PendingRequestPopup onClose={() => setIsPendingPopupOpen(false)} />
      )}
    </div>
  );
};

export default ManageKPIs;
