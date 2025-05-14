import React, { useEffect, useState } from "react";
import Sidebar from "../../../../components/Dash/Sidebar/Sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const ManageDepartment = () => {
  const [departments, setDepartments] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editDepartmentId, setEditDepartmentId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDept, setNewDept] = useState("");

  const handleAddOrUpdateDepartment = async () => {
    if (!newDept.trim()) {
      toast.error("Department name cannot be empty!");
      return;
    }

    if (editIndex !== null && editDepartmentId !== null) {
      try {
        await axios.put(
          `http://localhost:5000/api/department/${editDepartmentId}`,
          { name: newDept.trim() },
          { withCredentials: true }
        );

        const updatedDepartments = [...departments];
        updatedDepartments[editIndex].name = newDept.trim();
        setDepartments(updatedDepartments);
        toast.success("Department updated successfully!");
        handleCloseModal();
      } catch (error) {
        console.error("Error updating department:", error);
        toast.error("Failed to update department. Please try again.");
      }
    } else {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/department",
          { name: newDept.trim() },
          { withCredentials: true }
        );

        setDepartments([...departments, response.data]);
        toast.success("Department added successfully!");
        handleCloseModal();
      } catch (error) {
        console.error("Error adding department:", error);
        toast.error("Failed to add department. Please try again.");
      }
    }
  };

  const handleDeleteDepartment = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this department? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/department/${id}`, {
        withCredentials: true,
      });

      setDepartments((prev) =>
        prev.filter((dept) => dept.departmentId !== id)
      );
      toast.success("Department deleted successfully!");
    } catch (error) {
      console.error("Error deleting department:", error);
      toast.error("Error deleting department. Try again.");
    }
  };

  const handleEditDepartment = (index) => {
    setEditIndex(index);
    setEditDepartmentId(departments[index].departmentId);
    setNewDept(departments[index].name);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewDept("");
    setEditIndex(null);
    setEditDepartmentId(null);
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/department", {
          withCredentials: true,
        });
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex items-center justify-center p-6 m-8">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl">
          <ToastContainer position="top-right" autoClose={3000} />
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Manage Departments
            </h1>
          </div>

          {/* Add Button */}
          <button
            onClick={() => {
              setIsModalOpen(true);
              setNewDept("");
              setEditIndex(null);
              setEditDepartmentId(null);
            }}
            className="mb-6 px-6 py-2 bg-black text-white rounded-lg font-semibold shadow-md hover:bg-gray-800"
          >
            Add Department
          </button>

          {/* Department Table */}
          <div className="overflow-hidden rounded-xl border border-gray-300 bg-white shadow-md">
            <div className="max-h-96 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-200 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Department Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {departments.map((dept, index) => (
                    <tr
                      key={dept.departmentId}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {dept.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 flex space-x-4">
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => handleEditDepartment(index)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() =>
                            handleDeleteDepartment(dept.departmentId)
                          }
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editIndex !== null ? "Edit Department" : "Add New Department"}
            </h2>
            <input
              type="text"
              value={newDept}
              onChange={(e) => setNewDept(e.target.value)}
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-black focus:border-black text-sm"
              placeholder="Enter department name"
            />
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-black text-white rounded-lg font-semibold hover:bg-gray-800"
                onClick={handleAddOrUpdateDepartment}
              >
                {editIndex !== null ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDepartment;