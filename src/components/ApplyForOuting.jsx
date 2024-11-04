import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { API_URL } from '../data/apiPath';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const ApplyForOuting = () => {
  const [year, setYear] = useState('P1');
  const [reason, setReason] = useState('');
  const [outingDate, setOutingDate] = useState('');
  const [slot, setSlot] = useState('morning');
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [studentmongoId, setStudentmongoId] = useState('');

  const navigate = useNavigate();

  const getName = () => {
    const token = localStorage.getItem('loginToken');
    if (token) {
      const decoded = jwtDecode(token);
      setStudentName(decoded.name);
      setStudentId(decoded.id);
      setStudentmongoId(decoded.studentId);
    }
  };

  useEffect(() => {
    getName();
  }, []);

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/outing/create-outing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: localStorage.getItem('loginToken'),
        },
        body: JSON.stringify({
          name: studentName,
          studentId: studentmongoId,
          year,
          reason,
          outingDate,
          slot,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Outing applied', { autoClose: 2000 });
        setReason('');
        setOutingDate('');
        setSlot('morning');
      } else {
        toast.error(data.message || 'Outing applied already', { autoClose: 2000 });
      }
    } catch (error) {
      console.error('Error applying for outing:', error);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const oneWeekFromNow = new Date();
  oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
  const maxDate = oneWeekFromNow.toISOString().split('T')[0];

  return (
    <div className="relative">
      <ToastContainer />
      <form onSubmit={handleApply} className="flex flex-col space-y-5 bg-white p-6 rounded-lg shadow-lg text-black">
        <h2 className="text-2xl font-bold text-center mb-4">Apply for Outing</h2>

        <input
          type="text"
          placeholder="Name"
          value={studentName}
          readOnly
          className="p-3 border border-gray-300 rounded bg-gray-200 text-gray-700"
        />

        <input
          type="text"
          placeholder="ID"
          value={studentId}
          readOnly
          className="p-3 border border-gray-300 rounded bg-gray-200 text-gray-700"
        />

        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-600"
        >
          <option value="P1">P1</option>
          <option value="P2">P2</option>
          <option value="E1">E1</option>
          <option value="E2">E2</option>
          <option value="E3">E3</option>
          <option value="E4">E4</option>
        </select>

        <input
          type="text"
          placeholder="Reason for Outing"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-600"
          required
        />

        <input
          type="date"
          value={outingDate}
          onChange={(e) => setOutingDate(e.target.value)}
          min={today}
          max={maxDate}
          className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-600"
          required
        />

        <select
          value={slot}
          onChange={(e) => setSlot(e.target.value)}
          className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-600"
        >
          <option value="morning">Morning</option>
          <option value="afternoon">Afternoon</option>
          <option value="evening">Evening</option>
        </select>

        <button
          type="submit"
          className="bg-black text-white p-3 rounded hover:bg-gray-800 transition duration-200 font-semibold shadow-md"
        >
          Apply
        </button>
      </form>
    </div>
  );
};

export default ApplyForOuting;
