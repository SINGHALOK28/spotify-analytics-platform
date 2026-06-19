import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, Loader2 } from 'lucide-react';
import { AuthProvider } from './context/AuthContext';
import api from './hooks/useAPI';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Predictor from './pages/Predictor';
import Explorer from './pages/Explorer';
import Recommendations from './pages/Recommendations';
import Login from './pages/Login';
import Monitoring from './pages/Monitoring';

function App() {
  const [isWakingServer, setIsWakingServer] = useState(false);

  useEffect(() => {
    // If the server doesn't respond in 2 seconds, it's likely sleeping
    const timer = setTimeout(() => {
      setIsWakingServer(true);
    }, 2000);

    // Ping backend to wake up Render free tier
    api.get('/')
      .then(() => {
        clearTimeout(timer);
        setIsWakingServer(false);
      })
      .catch(() => {
        clearTimeout(timer);
        setIsWakingServer(false);
      });

    return () => clearTimeout(timer);
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="bg-[#0a0a0a] min-h-screen text-white selection:bg-[#1DB954]/30 relative overflow-hidden">
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/explore" element={<Explorer />} />
            <Route path="/predict" element={
              <ProtectedRoute><Predictor /></ProtectedRoute>
            } />
            <Route path="/recommend" element={
              <ProtectedRoute><Recommendations /></ProtectedRoute>
            } />
            <Route path="/admin/monitoring" element={
              <ProtectedRoute><Monitoring /></ProtectedRoute>
            } />
            
            {/* Catch-all route to prevent blank pages */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Waking Server Popup */}
          <AnimatePresence>
            {isWakingServer && (
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.9 }}
                className="fixed bottom-6 right-6 z-[9999] max-w-sm w-full bg-[#121212]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl flex items-start gap-4"
              >
                <div className="bg-[#1DB954]/20 p-3 rounded-xl shrink-0 mt-0.5">
                  <Coffee className="w-6 h-6 text-[#1DB954]" />
                </div>
                <div>
                  <h4 className="font-bold text-white flex items-center gap-2">
                    Waking up server <Loader2 className="w-4 h-4 animate-spin text-[#1DB954]" />
                  </h4>
                  <p className="text-sm text-white/60 mt-1 leading-relaxed">
                    Our database is waking up from sleep. It usually takes about 15-30 seconds to boot up. Grab a quick sip of water! 🚰
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
