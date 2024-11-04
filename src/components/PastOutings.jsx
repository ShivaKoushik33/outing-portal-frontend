import React, { useEffect, useState } from 'react';
import { API_URL } from '../data/apiPath';

const PastOutings = () => {
  const [pastOutings, setPastOutings] = useState([]);
  const [filteredOutings, setFilteredOutings] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [months] = useState([
    { value: '', label: 'All Months' },
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ]);

  useEffect(() => {
    fetchPastOutings();
  }, []);

  useEffect(() => {
    filterOutings();
  }, [pastOutings, selectedMonth]);

  const fetchPastOutings = async () => {
    try {
      const response = await fetch(`${API_URL}/outing/allOutings`);
      const data = await response.json();
      const outings = data.data || [];

      // Sort by recent first (assuming outingDate is part of the outing object)
      outings.sort((a, b) => new Date(b.outingDate) - new Date(a.outingDate));
      
      setPastOutings(outings);
    } catch (error) {
      console.error('Error fetching past outings:', error);
    }
  };

  const filterOutings = () => {
    if (selectedMonth) {
      const filtered = pastOutings.filter((outing) => {
        const outingDate = new Date(outing.outingDate);
        return outingDate.getMonth() + 1 === parseInt(selectedMonth);
      });
      setFilteredOutings(filtered);
    } else {
      setFilteredOutings(pastOutings);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Past Outings</h2>

      <div className="mb-4">
        <label htmlFor="month-select" className="mr-2">Filter by Month:</label>
        <select
          id="month-select"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          {months.map(month => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>
      </div>

      <div className="hidden md:block">
        {/* Table for larger screens */}
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black text-white rounded-md">
              <th className="p-4">Outing Date</th>
              <th className="p-4">Reason</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredOutings.map((outing) => (
              <tr key={outing._id} className="border-t even:bg-gray-100">
                <td className="p-4">{new Date(outing.outingDate).toLocaleDateString()}</td>
                <td className="p-4">{outing.reason}</td>
                <td className="p-4">{outing.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden grid grid-cols-1 gap-4 mt-4">
        {/* Cards for mobile screens */}
        {filteredOutings.map((outing) => (
          <div key={outing._id} className="bg-gray-100 rounded-lg p-4 shadow-md">
            <h3 className="text-lg font-semibold">Outing on {new Date(outing.outingDate).toLocaleDateString()}</h3>
            <p className="text-sm">Reason: {outing.reason}</p>
            <p className="text-sm">Status: {outing.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PastOutings;
