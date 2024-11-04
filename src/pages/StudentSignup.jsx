import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../data/apiPath';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StudentSignup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = (data) => {
    const errors = {};
    if (!data.name.trim()) {
      errors.name = "Name is required";
    } else if (data.name.length < 4) {
      errors.name = "Username must be at least 4 characters long";
    }

    if (!data.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[nN](20|21|22|23|24)\d{4}@rguktn\.ac\.in$/.test(data.email)) {
      errors.email = 'Enter rgukt mail only';
    }

    if (!data.password) {
      errors.password = 'Password is required';
    } else if (data.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm({ name, email, password });
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/student/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message || "Registration successful!", { autoClose: 3000 });
        setName("");
        setEmail("");
        setPassword("");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        if (data.error === "Email already exists") {
          setErrors((e) => ({
            ...e,
            email: data.error
          }));
        }
        toast.error(data.error || 'Registration failed', { autoClose: 3000 });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong!', { autoClose: 3000 });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-8 sm:px-6 lg:px-8 mt-2">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar closeOnClick pauseOnHover />
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Student Signup</h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          <div>
            <button type="submit" className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition duration-300 ease-in-out">
              Signup as Student
            </button>
          </div>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to={'/'} className="text-black hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default StudentSignup;
