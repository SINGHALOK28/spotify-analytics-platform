import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { login, register } from '../hooks/useAPI';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { user, login: authLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const switchMode = (newMode) => {
    setEmail('');
    setPassword('');
    setError('');
    setSuccess('');
    setLoading(false);
    setShowPassword(false);
    setMode(newMode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (mode === 'register') {
      const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!passRegex.test(password)) {
        setError('Password does not meet the requirements.');
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === 'login') {
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);

        const res = await login(formData);
        authLogin(res.data.access_token, { email });
        // After login, useEffect redirects
      } else {
        await register({ email, password });
        setSuccess('Account created! You can now log in.');
        setTimeout(() => switchMode('login'), 1500);
      }
    } catch (err) {
      const detail = err?.response?.data?.detail;
      if (typeof detail === 'string') {
        setError(detail);
      } else if (Array.isArray(detail)) {
        setError(detail[0]?.msg || 'Something went wrong.');
      } else {
        setError(mode === 'login' ? 'Invalid email or password.' : 'Registration failed. Try a different email.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#18181b]/80 backdrop-blur-2xl border border-white/20 rounded-3xl w-full max-w-md shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-br from-[#1DB954]/20 via-[#1DB954]/5 to-transparent p-8 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-[#1DB954] p-2 rounded-full">
              <Music size={20} className="fill-black text-black" />
            </div>
            <span className="font-bold text-white text-lg">Spotify Analytics</span>
          </div>

          <h2 className="text-2xl font-extrabold text-white">
            {mode === 'login' ? 'Welcome back' : 'Create an account'}
          </h2>
          <p className="text-white/50 text-sm mt-1">
            {mode === 'login'
              ? 'Sign in to access the full platform'
              : 'Get started with your free account'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-5">

          {/* Mode Tabs */}
          <div className="flex bg-black/40 rounded-xl p-1 border border-white/10 relative">
            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#1DB954] rounded-lg transition-transform duration-300 ${mode === 'login' ? 'translate-x-0' : 'translate-x-[calc(100%+8px)]'}`}
            />
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`flex-1 py-2.5 text-sm font-bold relative z-10 transition-colors ${mode === 'login' ? 'text-black' : 'text-white/70 hover:text-white'}`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => switchMode('register')}
              className={`flex-1 py-2.5 text-sm font-bold relative z-10 transition-colors ${mode === 'register' ? 'text-black' : 'text-white/70 hover:text-white'}`}
            >
              Sign Up
            </button>
          </div>

          {/* Error / Success */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm"
              >
                <AlertCircle size={16} className="flex-shrink-0" />
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-xl text-sm"
              >
                <CheckCircle size={16} className="flex-shrink-0" />
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white/70">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-[#1DB954] focus:ring-1 focus:ring-[#1DB954] transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white/70">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-11 pr-11 text-white placeholder-white/30 focus:outline-none focus:border-[#1DB954] focus:ring-1 focus:ring-[#1DB954] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            
            {/* Password Instructions (Only on Register) */}
            <AnimatePresence>
              {mode === 'register' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-white/50 bg-black/20 p-3 rounded-lg border border-white/5 mt-1"
                >
                  <p className="font-semibold mb-1 text-white/70">Password must contain:</p>
                  <ul className="list-disc pl-4 space-y-0.5">
                    <li className={password.length >= 8 ? "text-green-400" : ""}>At least 8 characters</li>
                    <li className={/[A-Z]/.test(password) ? "text-green-400" : ""}>At least one uppercase letter</li>
                    <li className={/[a-z]/.test(password) ? "text-green-400" : ""}>At least one lowercase letter</li>
                    <li className={/\d/.test(password) ? "text-green-400" : ""}>At least one number</li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#1DB954] to-[#1ed760] hover:from-[#1ed760] hover:to-[#1DB954] text-black font-extrabold py-4 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-4 shadow-[0_0_20px_rgba(29,185,84,0.3)] hover:shadow-[0_0_30px_rgba(29,185,84,0.5)] hover:-translate-y-0.5"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              mode === 'login' ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
