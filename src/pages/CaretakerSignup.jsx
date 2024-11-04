import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_URL } from '../data/apiPath';

const CaretakerSignup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = (data) => {
    const errors = {};
    if (!data.name.trim()) {
      errors.name = "Name is required";
    } else if (data.name.length <= 4) {
      errors.name = "Username must be at least 4 characters long";
    }

    if (!data.email.trim()) {
      errors.email = 'Email is required';
    }

    if (!data.password.trim()) {
      errors.password = 'Password is required';
    } else if (data.password.length < 5) {
      errors.password = 'Password must be at least 5 characters long';
    }

    if (!data.mobile.trim()) {
      errors.mobile = "Mobile Number is required";
    } else if (!/^[6-9]\d{9}$/.test(data.mobile)) {
      errors.mobile = "Indian mobile number only";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm({ name, email, password, mobile });
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/caretaker/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, mobile }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message || "Registration successful!", { autoClose: 3000 });
        setName("");
        setEmail("");
        setPassword("");
        setMobile("");
        setTimeout(() => {
          navigate("/");
        }, 2000);  // Adjust timeout if needed to allow toast display before navigation
      } else {
        if (data.error === "Email already exists") {
          setErrors((e) => ({
            ...e,
            email: data.error
          }));
        } else if (data.error === "Phone number already registered") {
          setErrors((e) => ({
            ...e,
            mobile: data.error
          }));
        }
        toast.error(data.error || "Registration failed.", { autoClose: 3000 });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong!', { autoClose: 3000 });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-8 sm:px-6 lg:px-8 mt-2">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar closeOnClick pauseOnHover />
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Caretaker Signup</h1>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" id="name" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800" />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" id="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800" />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" id="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800" />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          <div>
            <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">Mobile Number</label>
            <input type="text" id="mobile" placeholder="Enter your mobile number" value={mobile} onChange={(e) => setMobile(e.target.value)} className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800" />
            {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
          </div>
          <div>
            <button type="submit" className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition duration-300 ease-in-out">Signup as Caretaker</button>
          </div>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account? <Link to="/" className="text-black hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default CaretakerSignup;
