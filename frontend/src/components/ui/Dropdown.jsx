import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dropdown({ value, onChange, options, placeholder, allowClear = true }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.value === value);

  return (
    <div className="relative z-[60]" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between min-w-[160px] bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white hover:bg-white/10 hover:border-white/30 focus:outline-none focus:border-[#1DB954] focus:ring-1 focus:ring-[#1DB954] transition-all cursor-pointer shadow-lg"
      >
        <span className="truncate pr-4">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown size={16} className={`text-white/50 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-[#18181b]/95 backdrop-blur-3xl border border-white/20 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden max-h-60 overflow-y-auto custom-scrollbar"
          >
            {allowClear && (
              <div 
                onClick={() => { onChange(''); setIsOpen(false); }}
                className={`px-4 py-2.5 text-sm cursor-pointer transition-all hover:bg-[#1DB954]/10 hover:text-[#1DB954] ${value === '' ? 'text-[#1DB954] bg-[#1DB954]/5' : 'text-white'}`}
              >
                {placeholder}
              </div>
            )}
            {options.map((opt) => (
              <div
                key={opt.value}
                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                className={`px-4 py-2.5 text-sm cursor-pointer transition-all hover:bg-[#1DB954]/10 hover:text-[#1DB954] ${value === opt.value ? 'text-[#1DB954] bg-[#1DB954]/5 border-l-2 border-[#1DB954]' : 'text-white'}`}
              >
                {opt.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
