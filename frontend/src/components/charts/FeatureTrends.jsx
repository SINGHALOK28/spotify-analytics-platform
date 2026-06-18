import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getFeatureTrends } from '../../hooks/useAPI';
import Loader from '../ui/Loader';

const FEATURES = [
  { key: 'danceability', label: 'Danceability', color: '#1DB954' },
  { key: 'energy', label: 'Energy', color: '#3b82f6' },
  { key: 'valence', label: 'Valence', color: '#f59e0b' },
  { key: 'acousticness', label: 'Acousticness', color: '#ec4899' },
  { key: 'liveness', label: 'Liveness', color: '#8b5cf6' }
];

export default function FeatureTrends() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFeatures, setActiveFeatures] = useState(
    FEATURES.reduce((acc, f) => ({ ...acc, [f.key]: true }), {})
  );

  useEffect(() => {
    getFeatureTrends()
      .then((res) => {
        // Limit to top 15 genres so line chart doesn't get infinitely long
        setData(res.data.slice(0, 15));
      })
      .catch((err) => console.error("Error fetching feature trends:", err))
      .finally(() => setLoading(false));
  }, []);

  const toggleFeature = (key) => {
    setActiveFeatures(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 h-96 flex flex-col">
        <h3 className="text-lg font-bold text-white mb-auto">Feature Trends Across Genres</h3>
        <Loader size="lg" className="m-auto" />
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 h-96 flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
        <h3 className="text-lg font-bold text-white">Feature Trends Across Genres</h3>
        <div className="flex flex-wrap gap-3">
          {FEATURES.map(feat => (
            <label key={feat.key} className="flex items-center gap-1.5 cursor-pointer group">
              <div 
                className={`w-3 h-3 rounded-sm transition-colors border ${activeFeatures[feat.key] ? 'border-transparent' : 'border-white/30'}`}
                style={{ backgroundColor: activeFeatures[feat.key] ? feat.color : 'transparent' }}
              />
              <span className={`text-xs ${activeFeatures[feat.key] ? 'text-white' : 'text-white/50 group-hover:text-white/80'}`}>
                {feat.label}
              </span>
              <input 
                type="checkbox" 
                className="hidden" 
                checked={activeFeatures[feat.key]}
                onChange={() => toggleFeature(feat.key)}
              />
            </label>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis 
              dataKey="genre" 
              angle={-45} 
              textAnchor="end" 
              height={60}
              tick={{ fill: '#ffffff80', fontSize: 11 }} 
              axisLine={{ stroke: '#ffffff20' }}
              tickLine={{ stroke: '#ffffff20' }}
            />
            <YAxis 
              domain={[0, 1]} 
              tick={{ fill: '#ffffff80', fontSize: 11 }} 
              axisLine={{ stroke: '#ffffff20' }}
              tickLine={{ stroke: '#ffffff20' }}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#121212', borderColor: '#ffffff20', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ fontWeight: 'bold' }}
            />
            {FEATURES.map(feat => (
              <Area 
                key={feat.key}
                hide={!activeFeatures[feat.key]}
                type="monotone" 
                dataKey={feat.key} 
                name={feat.label}
                stroke={feat.color}
                fill={feat.color}
                fillOpacity={0.2}
                strokeWidth={3}
                activeDot={{ r: 6, stroke: '#121212', strokeWidth: 2 }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
