// src/pages/Register.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    console.log('Registering user:', formData);
  };

  return (
    <div className="flex justify-center items-center min-h-[85vh] bg-gradient-to-br from-green-50 via-emerald-100 to-green-200 px-4">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-sm bg-white/70 backdrop-blur-md border border-emerald-200 shadow-lg p-6 rounded-2xl space-y-5"
      >
        <h2 className="text-2xl font-bold text-center text-emerald-800">Create Account</h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="w-full px-4 py-2 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full px-4 py-2 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full px-4 py-2 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition"
        >
          Register
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-emerald-700 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
