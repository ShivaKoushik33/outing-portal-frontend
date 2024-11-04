import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_URL } from '../data/apiPath';

const Login = () => {
  const [loginType, setLoginType] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();


  const validateForm = (data) => {
    const errors = {};
    if (!data.email.trim()) {
      errors.email = 'Email is required';
    }
    if (!data.password.trim()) {
      errors.password = 'Password is required';
    }
    return errors;
  };

  const handleLoginType = (type) => {
    setLoginType(type);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm({ email, password });
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      return;
    }

    const loginUrl = loginType === 'student' 
      ? `${API_URL}/student/login/` 
      : `${API_URL}/caretaker/login/`;

    try {
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message || 'Logged in successfully', { autoClose: 2000 });
        setEmail('');
        setPassword('');
        localStorage.setItem('loginToken', data.token);

        setTimeout(() => {
          loginType==='student'
          ?navigate("/studentpage")
          :navigate("/caretakerpage");
        }, 2000); 
        
      } else {
        if (data.error) {
          setErrors((e) => ({
            ...e,
            password: data.error,
          }));
        }
        toast.error(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong!');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-8 sm:px-6 lg:px-8 mt-8">
      <ToastContainer />
      <div className="flex justify-center space-x-4 mb-8">
        <button onClick={() => handleLoginType('student')} className={`px-4 py-2 font-bold lg:text-lg ${loginType === 'student' ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'} rounded-lg transition duration-300 ease-in-out`}>
          Student
        </button>
        <button onClick={() => handleLoginType('caretaker')} className={`px-4 py-2 font-bold lg:text-lg ${loginType === 'caretaker' ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'} rounded-lg transition duration-300 ease-in-out`}>
          Caretaker
        </button>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="font-andada text-3xl font-bold mb-8 text-gray-800 text-center">{loginType === 'student' ? 'Student Login' : 'Caretaker Login'}</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">{loginType === 'student' ? 'Student Email' : 'Caretaker Email'}</label>
            <input type="email" id="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800" />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" id="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800" />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          <div>
            <button type="submit" className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition duration-300 ease-in-out">
              {loginType === 'student' ? 'Login as Student' : 'Login as Caretaker'}
            </button>
          </div>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to={loginType === 'student' ? '/signup/student' : '/signup/caretaker'} className="text-black hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
