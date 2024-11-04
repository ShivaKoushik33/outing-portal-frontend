import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-black text-white flex flex-col p-4">
      <h2 className="text-2xl font-bold mb-8">P-HR</h2>
      <Link to="dashboard" className="mb-4 text-gray-200 hover:text-white">Dashboard</Link>
      <Link to="leave-calendar" className="mb-4 text-gray-200 hover:text-white">Leave Calendar</Link>
      <Link to="team" className="mb-4 text-gray-200 hover:text-white">LogOut</Link>
      <div className="mt-auto text-gray-400">Help & Support</div>
    </div>
  );
};

export default Sidebar;
