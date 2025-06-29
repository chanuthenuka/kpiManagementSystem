import React, { useState, useEffect } from "react";
import Sidebar from "../../../../components/Dash/Sidebar/Sidebar";
import axios from "axios";
import KPIChangetable from "./KPIChangetable";

const RequestKPIChanges = () => {
  const [kras, setKras] = useState([]);
  const [selectedKRA, setSelectedKRA] = useState("");
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(() => {
    return localStorage.getItem("departmentId") || "";
  });

  const [selectedYear, setSelectedYear] = useState("");

  const [weightage, setWeightage] = useState("");
  const [kpi, setKpi] = useState("");
  const [action, setAction] = useState("");

  const [refreshTable, setRefreshTable] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch KRAs
        const kraResponse = await axios.get("http://localhost:5000/api/kra", {
          withCredentials: true,
        });
        setKras(kraResponse.data);

        // Fetch Departments
        const deptResponse = await axios.get(
          "http://localhost:5000/api/department",
          {
            withCredentials: true,
          }
        );
        setDepartments(deptResponse.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const handleRequestChanges = async () => {
    if (!selectedKRA || !weightage || !kpi || !action) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/approve-kpi",
        {
          status: "Pending",
          weightage,
          kraId: selectedKRA,
          kpi,
          departmentId: selectedDepartment,
        },
        {
          withCredentials: true,
        }
      );
      alert("KPI change request submitted successfully.");
      // Optionally reset form
      setRefreshTable((prev) => !prev);
      setSelectedKRA("");
      setWeightage("");
      setKpi("");
      setSelectedDepartment("");
      setAction("");
    } catch (error) {
      console.error("Error requesting KPI change:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-200">
      <Sidebar />

      <div className="flex-1 p-6">
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-8 mx-auto mt-20">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-left">
            Request KPI Changes
          </h1>

          <div className="space-y-6 mb-6">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Add/Remove
                </label>
                <select
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900"
                >
                  <option value="">Select</option>
                  <option value="Add">Add</option>
                  <option value="Remove">Remove</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900"
                >
                  <option value="">Select Year</option>
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  KRA
                </label>
                <select
                  value={selectedKRA}
                  onChange={(e) => setSelectedKRA(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900"
                >
                  <option value="">
                    Select a KRA
                  </option>
                  {kras
                    .filter(
                      (kra) =>
                        !selectedYear || kra.year?.toString() === selectedYear
                    )
                    .map((kra) => (
                      <option key={kra.kraId} value={kra.kraId}>
                        {kra.description}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  value={selectedDepartment}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900"
                  disabled
                >
                  {departments.map((dept) => (
                    <option key={dept.departmentId} value={dept.departmentId}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weightage
                </label>
                <input
                  type="text"
                  value={weightage}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d{0,3}$/.test(value)) {
                      const intVal = parseInt(value, 10);
                      if (
                        value === "" ||
                        (Number.isInteger(intVal) &&
                          intVal >= 0 &&
                          intVal <= 100)
                      ) {
                        setWeightage(value);
                    }
                  }}}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900 placeholder-gray-400"
                  placeholder="Weightage"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  KPI
                </label>
                <input
                  type="text"
                  value={kpi}
                  onChange={(e) => setKpi(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900 placeholder-gray-400"
                  placeholder="KPI"
                />
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleRequestChanges}
                className="px-6 py-2 bg-black text-white rounded-lg font-semibold shadow-md hover:bg-gray-800 transition-all duration-300"
              >
                Request Changes
              </button>
            </div>
          </div>
          <KPIChangetable refresh={refreshTable} />
        </div>
      </div>
    </div>
  );
};

export default RequestKPIChanges;
