import React from "react";

const PopUp_All_Ratings = ({ feedback }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">
        User Ratings Feedback
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
          <thead className="bg-gray-300">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">
                Feedback
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-4 py-2 text-sm text-gray-900">
                <input
                  type="text"
                  className="w-full px-2 py-1 border rounded"
                  placeholder="Enter feedback"
                  value={feedback || ""}
                  readOnly // Optional: make it read-only unless you want editing
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex justify-end mt-4"></div>
    </div>
  );
};

export default PopUp_All_Ratings;
