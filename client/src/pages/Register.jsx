import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/api';
import Squares from '../components/Squares';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const result = await register(formData.username, formData.email, formData.password);
      if (result.msg === "User registered successfully") {
        setSuccess('Account created.');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setError(result.msg || 'Registration failed');
      }
    } catch (err) {
      setError(err.message || 'Server error.');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-white px-4 overflow-hidden">
      <Squares className="opacity-40" direction="diagonal" speed={0.6} borderColor="#4b5563" hoverFillColor="#111827" squareSize={44} />
      <div className="relative z-10 w-full max-w-md space-y-8 bg-gradient-to-br from-white/95 to-gray-100/90 backdrop-blur-sm p-8 border border-slate-200/70 shadow-xl transition transform-gpu duration-300 ease-out hover:-translate-y-1 hover:scale-[1.01] hover:shadow-2xl hover:border-slate-300/80 ring-1 ring-gray-200/40 hover:ring-gray-300/50">
        <div className="text-center">
          <h2 className="text-3xl font-bold uppercase tracking-tight">Create Account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Join the circular fashion movement.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="space-y-4">
            <div>
              <label htmlFor="register-username" className="sr-only">Full name</label>
              <input
                id="register-username"
                type="text"
                name="username"
                placeholder="Full Name"
                required
                className="w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black rounded-none transition transform-gpu duration-200 hover:-translate-y-0.5 hover:shadow-md focus:-translate-y-0.5 focus:shadow-lg"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="register-email" className="sr-only">Email address</label>
              <input
                id="register-email"
                type="email"
                name="email"
                placeholder="Email Address"
                required
                className="w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black rounded-none transition transform-gpu duration-200 hover:-translate-y-0.5 hover:shadow-md focus:-translate-y-0.5 focus:shadow-lg"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="register-password" className="sr-only">Password</label>
              <input
                id="register-password"
                type="password"
                name="password"
                placeholder="Password"
                required
                className="w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black rounded-none transition transform-gpu duration-200 hover:-translate-y-0.5 hover:shadow-md focus:-translate-y-0.5 focus:shadow-lg"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && <div className="text-red-600 text-sm text-center font-medium">{error}</div>}
          {success && <div className="text-green-600 text-sm text-center font-medium">{success}</div>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold uppercase tracking-widest text-white bg-black transition transform-gpu duration-200 ease-out hover:bg-gray-800 hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-lg active:scale-[0.99] active:translate-y-0"
            >
              Create Account
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <Link to="/login" className="text-sm border-b border-black pb-0.5 hover:text-gray-600 hover:border-gray-600 transition">
            Already have an account? Log In
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;
