import React, { useState, useEffect } from "react";
import Sidebar from "../../../../components/Dash/Sidebar/Sidebar";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManageKRAs = () => {
  const [description, setDescription] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [filterYear, setFilterYear] = useState("All Years"); // New state for filter
  const [kraList, setKraList] = useState([]);
  const [selectedKraIds, setSelectedKraIds] = useState([]);
  const [editingKraId, setEditingKraId] = useState(null);

  const years = [
    "Year",
    "2020",
    "2021",
    "2022",
    "2023",
    "2024",
    "2025",
    "2026",
  ];

  const filterYears = ["All Years", ...years.filter((year) => year !== "Year")]; // Options for filter dropdown

  useEffect(() => {
    fetchKRAs();
  }, []);

  const fetchKRAs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/kra", {
        withCredentials: true,
      });
      setKraList(response.data);
    } catch (err) {
      console.error("Failed to fetch KRAs", err);
      toast.error("Could not load KRAs");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/kra",
        {
          description,
          year: selectedYear,
        },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setKraList([...kraList, response.data]);
        resetForm();
        toast.success("KRA saved successfully!");
      }
    } catch (err) {
      console.error("Save failed", err);
      toast.error("Something went wrong!");
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(
        selectedKraIds.map((id) =>
          axios.delete(`http://localhost:5000/api/kra/${id}`, {
            withCredentials: true,
          })
        )
      );
      toast.success("Selected KRAs deleted");
      setSelectedKraIds([]);
      fetchKRAs();
      resetForm();
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Error deleting KRAs");
    }
  };

  const handleAddNew = async () => {
    if (!editingKraId) {
      toast.warn("Please select a single KRA to update.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/kra/${editingKraId}`,
        {
          description,
          year: selectedYear,
        },
        { withCredentials: true }
      );
      if (response.status === 200) {
        toast.success("KRA updated successfully!");
        setSelectedKraIds([]);
        setEditingKraId(null);
        resetForm();
        fetchKRAs();
      } else {
        toast.error("Failed to update KRA.");
      }
    } catch (err) {
      console.error("Update failed", err);
      toast.error("Something went wrong while updating.");
    }
  };

  const resetForm = () => {
    setDescription("");
    setSelectedYear("");
    setEditingKraId(null);
  };

  const handleCheckboxChange = (id) => {
    const isSelected = selectedKraIds.includes(id);
    let newSelected = isSelected
      ? selectedKraIds.filter((kraId) => kraId !== id)
      : [...selectedKraIds, id];

    setSelectedKraIds(newSelected);

    if (!isSelected && newSelected.length === 1) {
      const selectedKRA = kraList.find((item) => item.kraId === id);
      if (selectedKRA) {
        setDescription(selectedKRA.description || "");
        setSelectedYear(selectedKRA.year || "");
        setEditingKraId(selectedKRA.kraId);
      }
    } else {
      setDescription("");
      setSelectedYear("");
      setEditingKraId(null);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const filteredList = kraList.filter(
        (item) => filterYear === "All Years" || item.year === filterYear
      );
      setSelectedKraIds(filteredList.map((item) => item.kraId));
    } else {
      setSelectedKraIds([]);
    }
  };

  // Filter the KRA list based on selected filterYear
  const filteredKraList =
    filterYear === "All Years"
      ? kraList
      : kraList.filter((item) => item.year === filterYear);

  return (
    <div className="flex min-h-screen bg-gray-200">
      <Sidebar />
      <div className="flex-1 flex items-center justify-center p-6">
        <ToastContainer position="top-right" autoClose={3000} />

        <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Manage KRA
          </h1>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="KRA"
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900 placeholder-gray-400 transition-all duration-300"
              />

              <select
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900 transition-all duration-300"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              {/* Filter by Year Dropdown */}
              <select
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900 transition-all duration-300"
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
              >
                {filterYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex space-x-4 justify-center">
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-black text-white rounded-lg font-semibold shadow-md hover:bg-gray-800 transition-all duration-300"
              >
                Save
              </button>

              <button
                onClick={handleDeleteSelected}
                className="px-6 py-2 bg-black text-white rounded-lg font-semibold shadow-md hover:bg-red-700 transition-all duration-300"
              >
                Delete
              </button>

              <button
                onClick={handleAddNew}
                className="px-6 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-200 transition-all duration-300"
              >
                Update
              </button>
            </div>

            {/* Table */}
            <div className="mt-6 overflow-hidden rounded-lg border border-gray-300 bg-white shadow-md">
              <div className="max-h-64 overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-300 sticky top-0">
                    <tr>
                      <th className="px-6 py-3 text-center">
                        <input
                          type="checkbox"
                          className="form-checkbox h-4 w-4 text-blue-600"
                          onChange={handleSelectAll}
                          checked={
                            filteredKraList.length > 0 &&
                            selectedKraIds.length === filteredKraList.length
                          }
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 tracking-wide">
                        KRA
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 tracking-wide">
                        Year
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredKraList.length > 0 ? (
                      filteredKraList.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 text-center">
                            <input
                              type="checkbox"
                              className="form-checkbox h-4 w-4 text-blue-600"
                              checked={selectedKraIds.includes(item.kraId)}
                              onChange={() => handleCheckboxChange(item.kraId)}
                            />
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {item.description || "-"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {item.year || "-"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="3"
                          className="px-6 py-4 text-center text-sm text-gray-500"
                        >
                          No KRAs to display
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageKRAs;
