import { useState, useEffect } from 'react';
import { Search, X, Filter, ChevronLeft, ChevronRight, SlidersHorizontal, Music } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import TrackCard from '../components/ui/TrackCard';
import Dropdown from '../components/ui/Dropdown';
import TrackDetailsModal from '../components/ui/TrackDetailsModal';
import useDebounce from '../hooks/useDebounce';
import { searchTracks, getTopGenres } from '../hooks/useAPI';

export default function Explorer() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 400);

  const [genres, setGenres] = useState([]);
  const [genreFilter, setGenreFilter] = useState('');
  const [bucketFilter, setBucketFilter] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  const [sortDesc, setSortDesc] = useState(true);
  
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [jumpPage, setJumpPage] = useState('');

  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [selectedTrack, setSelectedTrack] = useState(null);

  // Fetch genres for dropdown on mount
  useEffect(() => {
    getTopGenres(50)
      .then(res => setGenres(res.data.map(g => g.genre_name)))
      .catch(err => console.error(err));
  }, []);

  // Fetch tracks whenever filters or debounce query changes
  useEffect(() => {
    setLoading(true);
    const params = {
      q: debouncedQuery || undefined,
      genre: genreFilter || undefined,
      bucket: bucketFilter || undefined,
      sort_by: sortBy,
      sort_dir: sortDesc ? 'desc' : 'asc',
      page: page,
      page_size: limit
    };

    searchTracks(params)
      .then(res => {
        setResults(res.data.tracks || []);
        setTotal(res.data.total_count || 0);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [debouncedQuery, genreFilter, bucketFilter, sortBy, sortDesc, page, limit]);

  // Reset to page 1 if query or filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, genreFilter, bucketFilter, sortBy, sortDesc]);

  const totalPages = Math.ceil(total / limit) || 1;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleJumpSubmit = (e) => {
    e.preventDefault();
    const p = parseInt(jumpPage);
    if (!isNaN(p)) {
      handlePageChange(p);
      setJumpPage('');
    }
  };

  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Track Explorer</h1>
        <p className="text-white/60 mt-2">Search, filter, and sort through the entire database.</p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-8 flex flex-col gap-4 relative z-20">
        
        {/* Search Bar */}
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
          <input
            type="text"
            placeholder="Search by track name or artist..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-12 text-white focus:outline-none focus:border-[#1DB954] transition-colors"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap gap-4 items-center mt-2">
          <div className="flex items-center gap-2 text-white/60 bg-white/5 px-3 py-2 rounded-lg border border-white/10">
            <Filter size={16} />
            <span className="text-sm font-medium">Filters</span>
          </div>

          <Dropdown 
            value={genreFilter}
            onChange={setGenreFilter}
            placeholder="All Genres"
            options={genres.map(g => ({ label: g, value: g }))}
          />

          <Dropdown 
            value={bucketFilter}
            onChange={setBucketFilter}
            placeholder="All Popularity"
            options={[
              { label: 'Hit', value: 'Hit' },
              { label: 'Popular', value: 'Popular' },
              { label: 'Medium', value: 'Medium' },
              { label: 'Low', value: 'Low' }
            ]}
          />

          <div className="flex-1 min-w-0" />

          <div className="flex items-center gap-2 relative z-[70]">
            <SlidersHorizontal size={16} className="text-white/60" />
            <Dropdown 
              value={sortBy}
              onChange={setSortBy}
              placeholder="Sort By"
              allowClear={false}
              options={[
                { label: 'Popularity', value: 'popularity' },
                { label: 'Tempo', value: 'tempo' },
                { label: 'Danceability', value: 'danceability' },
                { label: 'Duration', value: 'duration_min' }
              ]}
            />
            <button
              onClick={() => setSortDesc(!sortDesc)}
              className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white hover:bg-white/10 hover:border-white/30 transition-all cursor-pointer shadow-lg"
            >
              {sortDesc ? "Desc ↓" : "Asc ↑"}
            </button>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="mb-6 flex justify-between items-end">
        <h2 className="text-xl font-bold">Results</h2>
        <span className="text-white/50 text-sm">
          {!loading && `Showing ${results.length} of ${total.toLocaleString()} results`}
        </span>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 h-40 animate-pulse">
              <div className="h-6 w-3/4 bg-white/10 rounded mb-2" />
              <div className="h-4 w-1/2 bg-white/10 rounded mb-4" />
              <div className="flex gap-2 mb-6">
                <div className="h-5 w-16 bg-white/10 rounded-full" />
                <div className="h-5 w-16 bg-white/10 rounded-full" />
              </div>
              <div className="mt-auto flex justify-between">
                <div className="h-8 w-12 bg-white/10 rounded" />
                <div className="h-8 w-12 bg-white/10 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="py-24 flex flex-col items-center justify-center text-center bg-white/5 border border-white/10 rounded-2xl">
          <Music size={64} className="text-white/20 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No tracks found</h3>
          <p className="text-white/60">We couldn't find anything matching "{query}". Try clearing your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {results.map(track => (
            <TrackCard 
              key={track.track_id} 
              track={track} 
              onSelect={(id) => setSelectedTrack(results.find(t => t.track_id === id))}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && total > 0 && (
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm font-medium">Page {page} of {totalPages}</span>
            <button 
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <form onSubmit={handleJumpSubmit} className="flex items-center gap-2">
            <span className="text-sm text-white/60">Jump to:</span>
            <input 
              type="number" 
              min="1" 
              max={totalPages}
              value={jumpPage}
              onChange={(e) => setJumpPage(e.target.value)}
              className="w-16 bg-white/10 border border-white/20 rounded p-1.5 text-center text-sm focus:outline-none focus:border-[#1DB954]"
            />
            <button type="submit" className="text-sm font-bold text-[#1DB954] hover:text-[#1ed760] px-2">Go</button>
          </form>
        </div>
      )}

      {/* Track Details Modal */}
      <TrackDetailsModal 
        track={selectedTrack} 
        isOpen={!!selectedTrack} 
        onClose={() => setSelectedTrack(null)} 
      />
    </PageWrapper>
  );
}
