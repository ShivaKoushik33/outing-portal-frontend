import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import PastOutings from '../components/PastOutings.jsx';
import ApplyForOuting from '../components/ApplyForOuting.jsx';

const StudentDashboard = () => {
  const [activeComponent, setActiveComponent] = useState('pastOutings');
  const [studentName, setStudentName] = useState('');

  const getName = () => {
    const token = localStorage.getItem('loginToken');
    if (token) {
      const decoded = jwtDecode(token);
      setStudentName(decoded.name);
    }
  };

  useEffect(() => {
    getName();
  }, []);

  const handleComponentChange = (component) => {
    setActiveComponent(component);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6 sm:p-8 font-sans">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold tracking-wide text-center sm:text-left">
          Welcome, Mr. {studentName}
        </h1>
        <button
          onClick={() => {
            localStorage.removeItem('loginToken');
            window.location.href = '/login'; // Navigate to login page
          }}
          className="bg-red-500 text-white p-2 rounded mt-4 sm:mt-0 hover:bg-red-600 transition duration-200"
        >
          Logout
        </button>
      </header>

      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
        <button
          onClick={() => handleComponentChange('pastOutings')}
          className={`flex-1 px-6 py-2 text-lg font-semibold rounded-full shadow-md transition duration-300 ${activeComponent === 'pastOutings' ? 'bg-black text-white shadow-lg' : 'bg-white text-black border border-black hover:bg-gray-100'}`}
        >
          Past Outings
        </button>
        <button
          onClick={() => handleComponentChange('applyForOuting')}
          className={`flex-1 px-6 py-2 text-lg font-semibold rounded-full shadow-md transition duration-300 ${activeComponent === 'applyForOuting' ? 'bg-black text-white shadow-lg' : 'bg-white text-black border border-black hover:bg-gray-100'}`}
        >
          Apply for Outing
        </button>
      </div>

      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-lg border border-gray-300">
        {activeComponent === 'pastOutings' && <PastOutings />}
        {activeComponent === 'applyForOuting' && <ApplyForOuting />}
      </div>
    </div>
  );
};

export default StudentDashboard;
