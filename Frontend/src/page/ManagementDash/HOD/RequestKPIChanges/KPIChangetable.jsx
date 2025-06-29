import { useEffect, useState } from "react";
import axios from "axios";

const KPIChangetable = ({ refresh }) => {
  const [requests, setRequests] = useState([]);
  const departmentId = localStorage.getItem("departmentId");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/approve-kpi/get-by-names",
          { withCredentials: true }
        );
        const filtered = response.data.filter(
          (item) => String(item.departmentId) === String(departmentId)
        );

        setRequests(filtered);
      } catch (error) {
        console.error("Failed to fetch KPI change requests:", error);
      }
    };

    fetchRequests();
  }, [refresh]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">KPI Change Requests</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b text-left">Department</th>
              <th className="py-2 px-4 border-b text-left">KRA</th>
              <th className="py-2 px-4 border-b text-left">KPI</th>
              <th className="py-2 px-4 border-b text-left">Weightage</th>
              <th className="py-2 px-4 border-b text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{item.departmentName}</td>
                <td className="py-2 px-4 border-b">{item.kraDescription}</td>
                <td className="py-2 px-4 border-b">{item.kpi}</td>
                <td className="py-2 px-4 border-b">{item.weightage}</td>
                <td className="py-2 px-4 border-b">{item.status}</td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No KPI change requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KPIChangetable;
