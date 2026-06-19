import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
  useEffect(() => {
    // Ping backend to wake up Render free tier
    api.get('/').catch(() => {});
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="bg-[#0a0a0a] min-h-screen text-white selection:bg-[#1DB954]/30">
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
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
