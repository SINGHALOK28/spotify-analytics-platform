import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { getPopularityDistribution } from '../../hooks/useAPI';
import Loader from '../ui/Loader';

const COLORS = {
  'Low': '#6b7280',
  'Medium': '#3b82f6',
  'Popular': '#1DB954',
  'Hit': '#f59e0b'
};

export default function PopularityPie() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPopularityDistribution()
      .then((res) => {
        // Backend returns array like [{"bucket": "Hit", "count": 500}, ...]
        // Transform for recharts: [{name: "Hit", value: 500}]
        const formatted = res.data.map((item) => ({
          name: item.bucket,
          value: item.count
        }));
        // Sort to maintain consistent pie rendering order
        formatted.sort((a, b) => b.value - a.value);
        setData(formatted);
      })
      .catch((err) => console.error("Error fetching popularity:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 h-80 flex flex-col">
        <h3 className="text-lg font-bold text-white mb-auto">Popularity Distribution</h3>
        <Loader size="lg" className="m-auto" />
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percent = total > 0 ? ((data.value / total) * 100).toFixed(1) : 0;
      return (
        <div className="bg-[#121212] border border-white/20 p-3 rounded-lg shadow-xl">
          <p className="text-white font-bold mb-1">{data.name}</p>
          <p className="text-white/80 text-sm">Count: <span className="font-medium text-white">{data.value.toLocaleString()}</span></p>
          <p className="text-white/80 text-sm">Share: <span className="font-medium text-[#1DB954]">{percent}%</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 h-80 flex flex-col">
      <h3 className="text-lg font-bold text-white mb-2">Popularity Distribution</h3>
      <div className="flex-1 min-h-0 w-full h-full">
        <ResponsiveContainer width="99%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              isAnimationActive={true}
              animationBegin={200}
              animationDuration={1000}
              animationEasing="ease-out"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#ffffff'} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              wrapperStyle={{ fontSize: '12px', color: '#ffffff80', paddingTop: '10px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
