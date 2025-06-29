import React, { useEffect, useState } from "react";
import axios from "axios";
 
const PendingRequestPopup = ({ onClose }) => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/approve-kpi",
          {
            withCredentials: true,
          }
        );

        // Filter only pending records
        const pendingOnly = response.data.filter(
          (item) => item.status?.toLowerCase() === "pending"
        );

        setPendingRequests(pendingOnly);
        console.log("Filtered pending", pendingOnly);
      } catch (err) {
        console.error("Failed to fetch data", err);
        setError("Failed to load pending requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingRequests();
  }, []);

  const handleAction = async (index, action) => {
    const request = pendingRequests[index];

    if (!request.approveKpiId) {
      console.error("approveKpiId is missing:", request);
      alert("Cannot process request: Missing approveKpiId.");
      return;
    }

    try {
      if (action === "Accepted") {
        // Update status to "Accept" for accepted requests
        const url = `http://localhost:5000/api/approve-kpi/${request.approveKpiId}`;
        console.log("PUT URL:", url);
        const response = await axios.put(
          url,
          { status: "Accept" },
          { withCredentials: true }
        );

        if (response.status === 200) {
          // Save the accepted KPI to the KPI table
          try {
            await axios.post(
              "http://localhost:5000/api/kpi",
              {
                description: request.kpi,
                departmentId: request.departmentId,
                weitage: request.weightage,
                kraId: request.kraId,
              },
              { withCredentials: true }
            );
            alert("KPI saved successfully");
          } catch (err) {
            console.error("Error saving KPI to table:", err);
            alert("Failed to save KPI to the database.");
            return;
          }
        } else {
          alert("Failed to update status.");
          return;
        }
      } else if (action === "Rejected") {
        // Soft delete the request for rejected requests
        const url = `http://localhost:5000/api/approve-kpi/${request.approveKpiId}`;
        console.log("PUT URL:", url);
        const response = await axios.put(
          url,
          { status: "Rejected" },
          { withCredentials: true }
        );
        if (response.status !== 200) {
          alert("Failed to reject request.");
          return;
        }
      }

      // Remove the item from the list after successful action
      setPendingRequests((prev) => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.error(`Error ${action === "Accepted" ? "updating status" : "rejecting request"}:`, err);
      console.log("Server Response:", err.response?.data);
      alert(
        `An error occurred while ${action === "Accepted" ? "updating the status" : "rejecting the request"}: ` +
          (err.response?.data?.error || "Unknown error")
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Pending Requests</h1>
          <button
            onClick={onClose}
            className="text-blue-600 hover:underline flex items-center"
          >
            <span className="mr-1">←</span> Back
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-300 bg-white shadow-md">
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-6 text-center text-sm text-gray-500">
                Loading...
              </div>
            ) : error ? (
              <div className="p-6 text-center text-sm text-red-500">{error}</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-300 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 tracking-wide">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 tracking-wide">
                      KRA
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 tracking-wide">
                      KPI
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 tracking-wide">
                      Weightage
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 tracking-wide">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pendingRequests.length > 0 ? (
                    pendingRequests.map((item, index) => (
                      <tr
                        key={item.approveKpiId || index}
                        className="hover:bg-gray-50 transition-all duration-300"
                      >
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {item.description}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {item.kpi}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {item.weightage}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="flex space-x-2">
                            <button
                              className="px-4 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
                              onClick={() => handleAction(index, "Accepted")}
                            >
                              Accept
                            </button>
                            <button
                              className="px-4 py-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-sm"
                              onClick={() => handleAction(index, "Rejected")}
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No pending requests
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingRequestPopup;