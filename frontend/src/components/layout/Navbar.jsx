import { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Explorer', path: '/explore' },
    { name: 'Predictor', path: '/predict' },
    { name: 'Recommendations', path: '/recommend' },
    { name: 'Monitoring', path: '/admin/monitoring' },
  ];

  const getNavLinkClass = ({ isActive }) => {
    return `text-base font-medium transition-colors hover:text-[#1DB954] relative py-1 ${
      isActive ? 'text-white' : 'text-white/70'
    }`;
  };

  const activeIndicator = (
    <motion.div
      layoutId="nav-indicator"
      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#1DB954] rounded-full"
    />
  );

  return (
    <nav className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo - Left */}
          <NavLink to="/" className="flex items-center gap-2">
            <div className="bg-[#1DB954] text-black p-1.5 rounded-full">
              <Music size={20} className="fill-black" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight hidden sm:block">
              Spotify Analytics
            </span>
          </NavLink>

          {/* Desktop Nav - Center */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink key={link.path} to={link.path} className={getNavLinkClass}>
                {({ isActive }) => (
                  <>
                    {link.name}
                    {isActive && activeIndicator}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Right side - Auth */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <div className="bg-white/10 p-1.5 rounded-full">
                    <User size={16} />
                  </div>
                  {user.email.split('@')[0]}
                </div>
                <button 
                  onClick={logout}
                  className="text-white/60 hover:text-red-400 transition-colors p-2 rounded-full hover:bg-white/5"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-white text-black font-bold text-sm px-6 py-2 rounded-full hover:scale-105 transition-transform"
              >
                Log in
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white/80 hover:text-white p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#121212] border-b border-white/10 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => 
                    `text-lg font-medium ${isActive ? 'text-[#1DB954]' : 'text-white/80 hover:text-white'}`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              
              <div className="h-px bg-white/10 w-full my-2"></div>
              
              {user ? (
                <div className="flex items-center justify-between">
                  <span className="text-white/80">{user.email}</span>
                  <button 
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-2 text-red-400 font-medium"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="bg-[#1DB954] text-black font-bold text-center py-3 rounded-full w-full block"
                >
                  Log in
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
