import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import CareTakerDashboard from '../components/CareTakerDashboard';

const CareTakerPage = () => {
  return (
      <div className="flex h-screen bg-gray-100">
        {/* <Sidebar /> */}
        <div className="flex-grow overflow-auto">
        <Routes>
            <Route path="dashboard" element={<CareTakerDashboard />} />
            {/* <Route path="/leave-calendar" element={<LeaveCalendar />} /> */}
            {/* <Route path="/team" element={<LogOut />} /> */}
          </Routes>
        </div>
      </div>
  );
};



export default CareTakerPage;
