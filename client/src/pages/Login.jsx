// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (email === 'admin@rewear.com' && password === 'admin123') {
      localStorage.setItem('user', JSON.stringify({ role: 'admin', email }));
      navigate('/admin');
    } else {
      localStorage.setItem('user', JSON.stringify({ role: 'user', email }));
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[85vh] bg-gradient-to-br from-green-50 via-emerald-100 to-green-200 px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-white/70 backdrop-blur-md border border-emerald-200 shadow-lg p-6 rounded-2xl space-y-5"
      >
        <h2 className="text-2xl font-bold text-center text-emerald-800">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition"
        >
          Login
        </button>

        <p className="text-center text-sm text-gray-600">
          New here?{' '}
          <Link to="/register" className="text-emerald-700 font-semibold hover:underline">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
