import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { getFeatureTrends } from '../../hooks/useAPI';
import Loader from '../ui/Loader';
import Dropdown from '../ui/Dropdown';

const GENRE_COLORS = ['#1DB954', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'];
const FEATURES = ['danceability', 'energy', 'valence', 'acousticness', 'liveness', 'speechiness', 'instrumentalness'];

export default function RadarComparison() {
  const [rawData, setRawData] = useState([]);
  const [activeFeature, setActiveFeature] = useState('danceability');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeatureTrends()
      .then((res) => {
        setRawData(res.data.slice(0, 5));
      })
      .catch((err) => console.error("Error fetching feature trends:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 h-96 flex flex-col">
        <h3 className="text-lg font-bold text-white mb-auto">Audio Feature Comparison</h3>
        <Loader size="lg" className="m-auto" />
      </div>
    );
  }

  // Format data for PieChart
  const data = rawData.map((g) => ({
    name: g.genre,
    value: parseFloat(g[activeFeature]) || 0
  })).filter(d => d.value > 0); // Remove 0s from pie

  const featureOptions = FEATURES.map(f => ({
    label: f.charAt(0).toUpperCase() + f.slice(1),
    value: f
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#121212] border border-white/20 p-3 rounded-lg shadow-xl">
          <p className="text-white font-bold mb-1">{data.name}</p>
          <p className="text-white/80 text-sm">Score: <span className="font-medium text-[#1DB954]">{data.value.toFixed(3)}</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 h-96 flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4 relative z-50">
        <h3 className="text-lg font-bold text-white">Feature Comparison</h3>
        <div className="w-48">
          <Dropdown
            value={activeFeature}
            onChange={setActiveFeature}
            options={featureOptions}
            allowClear={false}
          />
        </div>
      </div>
      
      <div className="flex-1 min-h-0 w-full h-full">
        <ResponsiveContainer width="99%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
              isAnimationActive={true}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={GENRE_COLORS[index % GENRE_COLORS.length]} />
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
