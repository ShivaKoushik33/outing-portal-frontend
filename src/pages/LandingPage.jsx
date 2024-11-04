import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Login from './Login';
import StudentSignup from './StudentSignup';
import CaretakerSignup from './CaretakerSignup';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header Section */}
      <header className="w-full p-4 bg-white shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 shadow-sm">Outing Portal</h1>
      </header>
      <div>
      <Login/>
      </div>
      <footer className="mt-8 text-sm text-gray-600">
        <p>
          <Link to="/">Back to Login</Link>
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
