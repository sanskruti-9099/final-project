import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Bot } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to login');
    }
  };

  return (
    <div className="min-h-screen bg-[#0b141c] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-[#0b141c] to-[#0b141c]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-primary">
          <Bot size={48} className="drop-shadow-[0_0_15px_rgba(176,198,255,0.3)]" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-[#e2e2e9]">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-[#b0b8d1]">
          Sign in to access your AI study assistant
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#141c24] py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-[#2d363e]/50">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-[#c3c6cf]">Email address</label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 bg-[#0b141c] border border-[#2d363e] rounded-xl text-[#e2e2e9] placeholder-[#b0b8d1]/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#c3c6cf]">Password</label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 bg-[#0b141c] border border-[#2d363e] rounded-xl text-[#e2e2e9] placeholder-[#b0b8d1]/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-[#002d6e] bg-primary hover:bg-[#d9e2ff] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-[#0b141c] transition-all duration-200"
              >
                Sign in
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#2d363e]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#141c24] text-[#b0b8d1]">New here?</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link to="/register" className="text-primary hover:text-[#d9e2ff] font-medium transition-colors">
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
