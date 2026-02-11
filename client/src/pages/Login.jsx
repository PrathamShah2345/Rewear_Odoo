import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
      // api.js throws on 500+, result.ok check handled there? 
      // Actually api.js returns json, we check token presence
      if (result.access_token) {
        localStorage.setItem('token', result.access_token);
        const userInfo = await getCurrentUser(result.access_token);
        localStorage.setItem('user', JSON.stringify(userInfo));
        navigate('/dashboard');
      } else {
        setError(result.msg || 'Invalid credentials');
      }
    } catch (err) {
      setError(err.message || 'Login failed.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold uppercase tracking-tight">Log In</h2>
          <p className="mt-2 text-sm text-gray-600">
            Welcome back to ReWear Design Store.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email Address"
                required
                className="w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black rounded-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                required
                className="w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black rounded-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <div className="text-red-600 text-sm text-center font-medium">{error}</div>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold uppercase tracking-widest text-white bg-black hover:bg-gray-800 transition-colors"
            >
              Sign In
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <Link to="/register" className="text-sm border-b border-black pb-0.5 hover:text-gray-600 hover:border-gray-600 transition">
            Create an Account
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;