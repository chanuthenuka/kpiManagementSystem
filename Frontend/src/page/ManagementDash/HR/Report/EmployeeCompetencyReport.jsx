import React, { useState, useEffect } from 'react';
import axios from 'axios';

const monthsOrder = [
  'ratingJan', 'ratingFeb', 'ratingMar', 'ratingApr', 'ratingMay', 'ratingJun',
  'ratingJul', 'ratingAug', 'ratingSep', 'ratingOct', 'ratingNov', 'ratingDec'
];

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const EmployeeCompetencyReport = ({ employeeId }) => {
  const [data, setData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [employeeName, setEmployeeName] = useState('');

  const fetchData = async () => {
    if (!employeeId) return;

    try {
      const response = await axios.get(
        `http://localhost:5000/api/competency-ratings/employee/${employeeId}/year/${selectedYear}`,
        { withCredentials: true }
      );

      const competencyData = response.data;
      setData(competencyData);

      // Set name if available in API response (optional)
      // setEmployeeName(competencyData[0]?.employeeName || '');
    } catch (error) {
      console.error('Failed to fetch competency data:', error.response?.data || error.message);
      setData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedYear, employeeId]);

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white shadow rounded-2xl overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4">
        Employee Competency Report - {selectedYear}
      </h1>

      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p><strong>Employee ID:</strong> {employeeId}</p>
          <p><strong>Employee Name:</strong> {employeeName || '-'}</p>
        </div>
        <select
          className="border p-2 rounded"
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {Array.from({ length: 5 }).map((_, i) => {
            const year = new Date().getFullYear() - i;
            return <option key={year} value={year}>{year}</option>;
          })}
        </select>
      </div>

      <table className="w-full border text-sm text-left min-w-[1000px]">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2">Competency</th>
            {monthNames.map((month) => (
              <th key={month} className="border px-3 py-2">{month}</th>
            ))}
            <th className="border px-3 py-2">Q1 Avg</th>
            <th className="border px-3 py-2">Q2 Avg</th>
            <th className="border px-3 py-2">Q3 Avg</th>
            <th className="border px-3 py-2">Q4 Avg</th>
            <th className="border px-3 py-2">H1 Avg</th>
            <th className="border px-3 py-2">H2 Avg</th>
            <th className="border px-3 py-2">Year Avg</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan={20} className="border px-3 py-2 text-center">
                No data available for the selected year.
              </td>
            </tr>
          )}
          {data.map((comp) => (
            <tr key={comp.competencyId}>
              <td className="border px-3 py-1 align-top">{comp.description}</td>

              {monthsOrder.map((monthKey) => (
                <td key={monthKey} className="border px-3 py-1 text-center">
                  {comp[monthKey] != null ? comp[monthKey] : '-'}
                </td>
              ))}

              <td className="border px-3 py-1 text-center">{comp.Q1_Average ?? '-'}</td>
              <td className="border px-3 py-1 text-center">{comp.Q2_Average ?? '-'}</td>
              <td className="border px-3 py-1 text-center">{comp.Q3_Average ?? '-'}</td>
              <td className="border px-3 py-1 text-center">{comp.Q4_Average ?? '-'}</td>
              <td className="border px-3 py-1 text-center">{comp.H1_Average ?? '-'}</td>
              <td className="border px-3 py-1 text-center">{comp.H2_Average ?? '-'}</td>
              <td className="border px-3 py-1 text-center">{comp.Year_Average ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeCompetencyReport;
