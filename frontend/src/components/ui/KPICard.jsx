import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function KPICard({ title, value, icon: Icon, color = 'text-green-500', loading = false }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    // If it's a decimal, keep decimals, otherwise round to whole
    if (value % 1 !== 0) return latest.toFixed(1);
    return Math.round(latest).toLocaleString();
  });

  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    if (loading) return;
    
    // Animate the motion value
    const controls = animate(count, value, { duration: 1.5, ease: "easeOut" });
    
    // Subscribe to changes to update React state
    const unsubscribe = rounded.on ? rounded.on("change", (v) => setDisplayValue(v)) : null;
    const unsubscribeModern = rounded.onChange ? rounded.onChange((v) => setDisplayValue(v)) : null;
    
    return () => {
      controls.stop();
      if (unsubscribe) unsubscribe();
      if (unsubscribeModern) unsubscribeModern();
    };
  }, [value, loading, count, rounded]);

  const colorMap = {
    'text-green-500': 'bg-green-500/10 text-green-500',
    'text-blue-500': 'bg-blue-500/10 text-blue-500',
    'text-yellow-500': 'bg-yellow-500/10 text-yellow-500',
    'text-purple-500': 'bg-purple-500/10 text-purple-500',
    'text-pink-500': 'bg-pink-500/10 text-pink-500',
  };

  const iconBg = colorMap[color] || 'bg-gray-500/10 text-gray-500';

  return (
    <motion.div 
      whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(29, 185, 84, 0.15)" }}
      className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 transition-all duration-300 relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-full ${iconBg}`}>
          {Icon && <Icon size={24} />}
        </div>
      </div>
      
      <div className="space-y-1">
        {loading ? (
          <div className="h-10 w-24 bg-white/10 animate-pulse rounded"></div>
        ) : (
          <motion.h3 className="text-3xl font-bold text-white">
            {displayValue}
          </motion.h3>
        )}
        <p className="text-sm font-medium text-white/50">{title}</p>
      </div>
    </motion.div>
  );
}
