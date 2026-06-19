import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getTopGenres } from '../../hooks/useAPI';
import Loader from '../ui/Loader';

export default function TopGenresBar() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTopGenres(10)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.error("Error fetching top genres:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 h-80 flex flex-col">
        <h3 className="text-lg font-bold text-white mb-auto">Top Genres by Track Count</h3>
        <Loader size="lg" className="m-auto" />
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 h-80 flex flex-col">
      <h3 className="text-lg font-bold text-white mb-6">Top Genres by Track Count</h3>
      <div className="flex-1 min-h-0 w-full h-full">
        <ResponsiveContainer width="99%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 40 }}>
            <XAxis 
              dataKey="genre_name" 
              angle={-45} 
              textAnchor="end" 
              height={60} 
              tick={{ fill: '#ffffff80', fontSize: 12 }} 
              axisLine={{ stroke: '#ffffff20' }}
              tickLine={{ stroke: '#ffffff20' }}
            />
            <YAxis 
              tick={{ fill: '#ffffff80', fontSize: 12 }} 
              axisLine={{ stroke: '#ffffff20' }}
              tickLine={{ stroke: '#ffffff20' }}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#121212', borderColor: '#ffffff20', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: '#1DB954', fontWeight: 'bold' }}
              cursor={{ fill: '#ffffff10' }}
            />
            <Bar dataKey="track_count" fill="#1DB954" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
