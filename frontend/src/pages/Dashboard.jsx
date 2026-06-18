import { useState, useEffect } from 'react';
import { Music, Users, Tag, TrendingUp } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import KPICard from '../components/ui/KPICard';
import TopGenresBar from '../components/charts/TopGenresBar';
import PopularityPie from '../components/charts/PopularityPie';
import RadarComparison from '../components/charts/RadarComparison';
import FeatureTrends from '../components/charts/FeatureTrends';
import Badge from '../components/ui/Badge';
import Loader from '../components/ui/Loader';
import TrackDetailsModal from '../components/ui/TrackDetailsModal';
import { getDashboard, getTopTracks } from '../hooks/useAPI';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrack, setSelectedTrack] = useState(null);

  useEffect(() => {
    // Fetch KPI stats
    getDashboard()
      .then(res => setStats(res.data))
      .catch(err => console.error("Error fetching dashboard stats:", err))
      .finally(() => setLoading(false));

    // Fetch top tracks table data
    getTopTracks()
      .then(res => setTracks(res.data))
      .catch(err => console.error("Error fetching top tracks:", err));
  }, []);

  return (
    <PageWrapper>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Analytics Dashboard</h1>
          <p className="text-white/60 mt-1">Platform overview and feature insights.</p>
        </div>
        <div className="text-sm text-white/40">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard 
          title="Total Tracks" 
          value={stats?.total_tracks || 0} 
          icon={Music} 
          color="text-green-500" 
          loading={loading} 
        />
        <KPICard 
          title="Total Artists" 
          value={stats?.total_artists || 0} 
          icon={Users} 
          color="text-blue-500" 
          loading={loading} 
        />
        <KPICard 
          title="Total Genres" 
          value={stats?.total_genres || 0} 
          icon={Tag} 
          color="text-yellow-500" 
          loading={loading} 
        />
        <KPICard 
          title="Avg Popularity" 
          value={stats?.avg_popularity || 0} 
          icon={TrendingUp} 
          color="text-purple-500" 
          loading={loading} 
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <TopGenresBar />
        <PopularityPie />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <RadarComparison />
        <FeatureTrends />
      </div>

      {/* Top Tracks Table */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-xl font-bold">Top 20 Most Popular Tracks</h3>
        </div>
        
        {tracks.length === 0 ? (
          <div className="p-12 flex justify-center"><Loader size="md" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-white/60 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 font-medium">Rank</th>
                  <th className="px-6 py-4 font-medium">Track</th>
                  <th className="px-6 py-4 font-medium">Artist</th>
                  <th className="px-6 py-4 font-medium">Genre</th>
                  <th className="px-6 py-4 font-medium text-right">Score</th>
                  <th className="px-6 py-4 font-medium text-center">Bucket</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {tracks.map((track, idx) => (
                  <tr 
                    key={track.track_id} 
                    className="hover:bg-white/10 transition-colors cursor-pointer"
                    onClick={() => setSelectedTrack(track)}
                  >
                    <td className="px-6 py-4 font-medium text-white/40">#{idx + 1}</td>
                    <td className="px-6 py-4 font-medium text-white truncate max-w-[200px]">{track.track_name}</td>
                    <td className="px-6 py-4 text-white/70 truncate max-w-[150px]">{track.artists}</td>
                    <td className="px-6 py-4"><Badge text={track.track_genre} variant="medium" /></td>
                    <td className="px-6 py-4 text-right font-bold text-[#1DB954]">{Math.round(track.popularity)}</td>
                    <td className="px-6 py-4 text-center">
                      <Badge text={track.popularity_bucket} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <TrackDetailsModal 
        track={selectedTrack} 
        isOpen={!!selectedTrack} 
        onClose={() => setSelectedTrack(null)} 
      />
    </PageWrapper>
  );
}
