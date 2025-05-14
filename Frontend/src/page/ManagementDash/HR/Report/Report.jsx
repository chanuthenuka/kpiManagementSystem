import React, { useState } from "react";
import Sidebar from "../../../../components/Dash/Sidebar/Sidebar";
import { motion, AnimatePresence } from "framer-motion";

const ReportGeneration = () => {
  const [selectedOption, setSelectedOption] = useState("Report Generation");
  const [formData, setFormData] = useState({
    reportType: "",
    timePeriod: "",
    department: "",
    employeeId: "",
  });

  // Form fields configuration (scalable array)
  const formFields = [
    {
      label: "Report Type",
      id: "reportType",
      options: [
        { value: "", label: "Select Report Type", disabled: true },
        { value: "sales", label: "Sales Report" },
        { value: "inventory", label: "Inventory Report" },
        { value: "customer", label: "Customer Report" },
      ],
    },
    {
      label: "Time Period",
      id: "timePeriod",
      options: [
        { value: "", label: "Select Time Period", disabled: true },
        { value: "daily", label: "Daily" },
        { value: "weekly", label: "Weekly" },
        { value: "monthly", label: "Monthly" },
      ],
    },
    {
      label: "Department",
      id: "department",
      options: [
        { value: "", label: "Select Department", disabled: true },
        { value: "dept1", label: "Department 01" },
        { value: "dept2", label: "Department 02" },
        { value: "dept3", label: "Department 03" },
      ],
    },
    {
      label: "Employee ID",
      id: "employeeId",
      options: [
        { value: "", label: "Select Employee ID", disabled: true },
        { value: "emp001", label: "EMP001" },
        { value: "emp002", label: "EMP002" },
        { value: "emp003", label: "EMP003" },
      ],
    },
  ];

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  const contentVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: 20, transition: { duration: 0.2 } },
  };

  const inputVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.1 } },
    focus: {
      scale: 1.02,
      borderColor: "#4A90E2",
      transition: { duration: 0.2 },
    },
  };

  // Reusable FormField Component (Nested within the file)
  const FormField = ({
    label,
    id,
    value,
    onChange,
    options,
    type = "select",
  }) => (
    <motion.div
      variants={inputVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      <label
        htmlFor={id}
        className="block text-lg text-gray-900 font-medium mb-2"
        aria-label={`${label} selection`}
      >
        {label}
      </label>
      {type === "select" ? (
        <motion.select
          id={id}
          value={value}
          onChange={onChange}
          className="w-full p-4 rounded-2xl border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 appearance-none"
          whileFocus="focus"
          aria-required="true"
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </motion.select>
      ) : null}
    </motion.div>
  );

  // Handle form input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add your report generation logic here
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Sidebar />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full sm:w-3/4 md:w-2/3 lg:w-4/5 p-8 m-6 bg-white rounded-3xl shadow-2xl transform transition-all duration-300 hover:shadow-3xl mt-20"
      >
        {/* Header */}
        <div className="mb-10">
          {/* Navigation Buttons with Enhanced Design */}
          <div className="flex flex-wrap gap-4 justify-center"></div>
        </div>

        {/* Conditional Rendering for Report Generation Form with Animations */}
        <AnimatePresence mode="wait">
          {selectedOption === "Report Generation" && (
            <motion.div
              key="reportGeneration"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={contentVariants}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <div className="flex justify-center items-center mb-8">
                <form
                  onSubmit={handleSubmit}
                  className="w-full max-w-3xl p-8 rounded-2xl bg-gray-200 border border-gray-300 shadow-md space-y-6"
                >
                  <h2 className="text-2xl text-gray-800 font-extrabold text-center mb-8 tracking-tight">
                    Report Generation
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {formFields.map((field) => (
                      <FormField
                        key={field.id}
                        label={field.label}
                        id={field.id}
                        value={formData[field.id]}
                        onChange={handleChange}
                        options={field.options}
                      />
                    ))}
                  </div>
                  <div className="flex justify-center mt-10">
                    <motion.button
                      type="submit"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      className="bg-black text-white px-6 py-3 rounded-2xl hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                    >
                      Generate Report
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ReportGeneration;
