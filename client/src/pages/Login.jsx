import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login, getCurrentUser } from '../services/api';
import Squares from '../components/Squares';

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
    <div className="relative min-h-screen flex items-center justify-center bg-white px-4 overflow-hidden">
      <Squares className="opacity-40" direction="diagonal" speed={0.6} borderColor="#4b5563" hoverFillColor="#111827" squareSize={44} />
      <div className="relative z-10 w-full max-w-md space-y-8 bg-gradient-to-br from-white/95 to-gray-100/90 backdrop-blur-sm p-8 border border-slate-200/70 shadow-xl transition transform-gpu duration-300 ease-out hover:-translate-y-1 hover:scale-[1.01] hover:shadow-2xl hover:border-slate-300/80 ring-1 ring-gray-200/40 hover:ring-gray-300/50">
        <div className="text-center">
          <h2 className="text-3xl font-bold uppercase tracking-tight">Log In</h2>
          <p className="mt-2 text-sm text-gray-600">
            Welcome back to ReWear Design Store.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="login-email" className="sr-only">Email address</label>
              <input
                id="login-email"
                type="email"
                placeholder="Email Address"
                required
                className="w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black rounded-none transition transform-gpu duration-200 hover:-translate-y-0.5 hover:shadow-md focus:-translate-y-0.5 focus:shadow-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="login-password" className="sr-only">Password</label>
              <input
                id="login-password"
                type="password"
                placeholder="Password"
                required
                className="w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black rounded-none transition transform-gpu duration-200 hover:-translate-y-0.5 hover:shadow-md focus:-translate-y-0.5 focus:shadow-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <div className="text-red-600 text-sm text-center font-medium">{error}</div>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold uppercase tracking-widest text-white bg-black transition transform-gpu duration-200 ease-out hover:bg-gray-800 hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-lg active:scale-[0.99] active:translate-y-0"
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
