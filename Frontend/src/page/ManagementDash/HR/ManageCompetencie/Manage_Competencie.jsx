import React, { useState, useEffect } from "react";
import Sidebar from "../../../../components/Dash/Sidebar/Sidebar";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OrganizationalForm = () => {
  const [competency, setCompetency] = useState("");
  const [description, setDescription] = useState("");
  const [isSeniorManager, setIsSeniorManager] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");
  const [competencies, setCompetencies] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedCompetency, setSelectedCompetency] = useState(null);
  const [yearFilter, setYearFilter] = useState("all");

  useEffect(() => {
    fetchCompetencies();
  }, []);

  const fetchCompetencies = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/competency", {
        withCredentials: true,
      });
      setCompetencies(res.data);
    } catch (error) {
      console.error("Failed to fetch competencies:", error);
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/competency",
        {
          description,
          isSeniorManager,
          year: selectedYear,
        },
        { withCredentials: true }
      );

      console.log("Created:", response.data);
      toast.success("Competency saved successfully!");

      setCompetency("");
      setDescription("");
      setIsSeniorManager(false);
      setSelectedYear("");
      fetchCompetencies();
    } catch (error) {
      console.error("Error saving competency:", error);
      toast.error("Something went wrong!");
    }
  };

  const handleUpdate = async () => {
    if (!selectedCompetency) {
      toast.warn("Select exactly one competency to update.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/competency/${selectedCompetency.competencyId}`,
        {
          description,
          isSeniorManager,
          year: selectedYear,
        },
        {
          withCredentials: true,
        }
      );

      toast.success("Competency updated successfully!");
      setDescription("");
      setIsSeniorManager(false);
      setSelectedIds([]);
      setSelectedCompetency(null);
      setSelectedYear("");
      fetchCompetencies();
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update competency.");
    }
  };

  const handleDelete = async () => {
    try {
      await Promise.all(
        selectedIds.map((id) =>
          axios.delete(`http://localhost:5000/api/competency/${id}`, {
            withCredentials: true,
          })
        )
      );
      toast.success("Selected competencies deleted.");
      setSelectedIds([]);
      fetchCompetencies();
    } catch (err) {
      toast.error("Error deleting competencies.");
      console.error(err);
    }
  };

  const filteredCompetencies = competencies.filter((comp) => {
    const matchesSeniority =
      filter === "senior"
        ? comp.isSeniorManager === 1
        : filter === "non-senior"
        ? comp.isSeniorManager === 0
        : true;

    const matchesYear = yearFilter === "all" ? true : comp.year === yearFilter;

    return matchesSeniority && matchesYear;
  });

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6 m-4 bg-white rounded-3xl shadow-lg mt-20">
        <ToastContainer position="top-right" autoClose={3000} />

        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
          Manage Competencies
        </h1>

        {/* Filter Dropdown */}
        <div className="mb-6">
          <label
            htmlFor="filter"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Filter
          </label>
          <div className="relative">
            <select
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
            >
              <option value="all">All</option>
              <option value="senior">Senior Managers</option>
              <option value="non-senior">Non-Senior Managers</option>
            </select>
          </div>
        </div>

        {/* Competency Form */}
        <div className="mb-6 p-6 bg-white border border-gray-200 rounded-xl shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <input
              type="text"
              placeholder="Competency"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="flex items-center">
              <input
                type="checkbox"
                id="seniorManager"
                checked={isSeniorManager}
                onChange={(e) => setIsSeniorManager(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="seniorManager" className="text-gray-700">
                Senior Manager
              </label>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition"
            >
              Save
            </button>
            <button
              onClick={() => {
                setDescription("");
                setIsSeniorManager(false);
                setSelectedYear("");
                setSelectedIds([]);
                setSelectedCompetency(null);
              }}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
              onClick={handleUpdate}
            >
              Update
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
            >
              Delete
            </button>
          </div>
        </div>
        <div className="mb-6">
          <label
            htmlFor="yearFilter"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Filter by Year
          </label>
          <div className="relative">
            <select
              id="yearFilter"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
            >
              <option value="all">All Years</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-6 py-4"></th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Competency
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Only Senior Manager
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCompetencies.length > 0 ? (
              filteredCompetencies.map((comp) => (
                <tr key={comp.competencyId}>
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(comp.competencyId)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setSelectedIds((prev) => {
                          const newSelected = checked
                            ? [...prev, comp.competencyId]
                            : prev.filter((id) => id !== comp.competencyId);

                          if (checked && newSelected.length === 1) {
                            setSelectedCompetency(comp);
                            setDescription(comp.description);
                            setIsSeniorManager(!!comp.isSeniorManager);
                            setSelectedYear(comp.year); // Set the year field
                          } else if (!checked || newSelected.length !== 1) {
                            setSelectedCompetency(null);
                            setDescription("");
                            setIsSeniorManager(false);
                            setSelectedYear("");
                          }

                          return newSelected;
                        });
                      }}
                      className="accent-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {comp.description}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {comp.isSeniorManager ? "Yes" : "No"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  className="px-6 py-4 text-sm text-gray-500 text-center"
                >
                  No competencies found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrganizationalForm;