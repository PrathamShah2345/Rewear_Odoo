import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, getCurrentUser } from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const result = await login(email, password);
      if (result.access_token) {
        localStorage.setItem('token', result.access_token);
        const userInfo = await getCurrentUser(result.access_token);
        localStorage.setItem('user', JSON.stringify(userInfo));
        setTimeout(() => {
          navigate('/dashboard');
        }, 1200);
      } else {
        setError(result.msg || 'Login failed');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[85vh] bg-gradient-to-br from-green-50 via-emerald-100 to-green-200 px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-white/70 backdrop-blur-md border border-emerald-200 shadow-lg p-6 rounded-2xl space-y-5"
      >
        <h2 className="text-2xl font-bold text-center text-emerald-800">Login</h2>

        {error && (
          <div className="text-red-600 text-center text-sm">{error}</div>
        )}

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