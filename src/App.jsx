import React, { useState } from 'react';

import CaretakerSignup from './pages/CaretakerSignup';
import StudentSignup from './pages/StudentSignup';
import { BrowserRouter,Route,Routes,Link } from 'react-router-dom';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
// import CareTakerPage from './pages/CareTakerPage';
import CareTakerDashboard from './components/CareTakerDashboard';
import StudentDashboard from './pages/StudentPage';


const App = () => {
  return(
    <Routes>
      <Route path="/*" element={<LandingPage/>} />
      <Route path="/caretakerpage" element={<CareTakerDashboard/>}/>
      <Route path="/studentpage" element={<StudentDashboard />} /> 
      <Route path="signup/student" element={<StudentSignup />} />
      <Route path="signup/caretaker" element={<CaretakerSignup />} />
    </Routes>

  );
}

export default App;
