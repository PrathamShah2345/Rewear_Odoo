import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/api';

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
    <div className="min-h-[80vh] flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold uppercase tracking-tight">Create Account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Join the circular fashion movement.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="space-y-4">
            <div>
              <input
                type="text"
                name="username"
                placeholder="Full Name"
                required
                className="w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black rounded-none"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                required
                className="w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black rounded-none"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                className="w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black rounded-none"
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
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold uppercase tracking-widest text-white bg-black hover:bg-gray-800 transition-colors"
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