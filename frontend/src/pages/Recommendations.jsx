import { useState, useEffect, useRef } from 'react';
import { Search, Info } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import TrackCard from '../components/ui/TrackCard';
import Loader from '../components/ui/Loader';
import useDebounce from '../hooks/useDebounce';
import { searchTracks, getCustomRecommendations, getTopTracksByGenre, getTopGenres } from '../hooks/useAPI';
import { formatAudioFeature } from '../utils/formatters';

const AUDIO_FEATURES = ['danceability', 'energy', 'valence', 'speechiness', 'acousticness', 'instrumentalness', 'liveness'];

export default function Recommendations() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  
  const [dropdownResults, setDropdownResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searching, setSearching] = useState(false);
  
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(false);
  
  const [customFeatures, setCustomFeatures] = useState({});
  const [selectedGenre, setSelectedGenre] = useState('');
  const [availableGenres, setAvailableGenres] = useState([]);
  
  const [topTracksByGenre, setTopTracksByGenre] = useState([]);
  const [loadingTop, setLoadingTop] = useState(true);

  const dropdownRef = useRef(null);

  useEffect(() => {
    getTopGenres(20).then(res => setAvailableGenres(res.data)).catch(console.error);
    getTopTracksByGenre()
      .then(res => {
        setTopTracksByGenre(res.data);
      })
      .catch(console.error)
      .finally(() => setLoadingTop(false));
  }, []);

  useEffect(() => {
    if (debouncedQuery) {
      setSearching(true);
      searchTracks({ q: debouncedQuery, limit: 5 })
        .then(res => {
          setDropdownResults(res.data.tracks || []);
          setShowDropdown(true);
        })
        .catch(err => console.error(err))
        .finally(() => setSearching(false));
    } else {
      setDropdownResults([]);
      setShowDropdown(false);
    }
  }, [debouncedQuery]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectTrack = (track) => {
    setSelectedTrack(track);
    setQuery('');
    setShowDropdown(false);
    setRecommendations([]);
    
    // Initialize custom features
    const initialFeatures = {};
    AUDIO_FEATURES.forEach(feat => {
      initialFeatures[feat] = track[feat] || 0;
    });
    // Tempo requires special handling as it's not 0-1
    initialFeatures['tempo'] = track.tempo || 120;
    setCustomFeatures(initialFeatures);
  };

  const handleFindSimilar = () => {
    if (!selectedTrack) return;
    setLoadingRecs(true);
    
    const payload = { ...customFeatures };
    if (selectedGenre) payload.genre_filter = selectedGenre;
    
    getCustomRecommendations(payload)
      .then(res => setRecommendations(res.data))
      .catch(err => console.error("Error fetching custom recommendations:", err))
      .finally(() => setLoadingRecs(false));
  };

  return (
    <PageWrapper>
      <div className="mb-8 max-w-3xl mx-auto text-center">
        <h1 className="text-3xl font-extrabold tracking-tight">AI Recommendations</h1>
        <p className="text-white/60 mt-2">Find mathematically similar tracks based on audio feature embeddings.</p>
      </div>

      <div className="max-w-3xl mx-auto relative z-50" ref={dropdownRef}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
          <input
            type="text"
            placeholder="Search for a seed track..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (dropdownResults.length > 0) setShowDropdown(true);
            }}
            className="w-full bg-white/5 border border-white/20 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#1DB954] transition-colors shadow-lg"
          />
          {searching && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <Loader size="sm" />
            </div>
          )}
        </div>

        {/* Dropdown */}
        {showDropdown && dropdownResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-3 bg-[#18181b]/95 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden max-h-96 overflow-y-auto z-50">
            {dropdownResults.map(track => (
              <div 
                key={track.track_id}
                onClick={() => handleSelectTrack(track)}
                className="p-4 border-b border-white/5 hover:bg-[#1DB954]/10 hover:border-l-4 hover:border-l-[#1DB954] cursor-pointer transition-all flex justify-between items-center group"
              >
                <div>
                  <h4 className="font-bold text-white group-hover:text-[#1DB954] transition-colors">{track.track_name}</h4>
                  <p className="text-sm text-white/50">{track.artists}</p>
                </div>
                <span className="text-xs bg-white/10 group-hover:bg-[#1DB954]/20 group-hover:text-[#1DB954] px-3 py-1.5 rounded-md text-white/70 transition-colors">{track.track_genre}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedTrack && (
        <div className="mt-12 max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-8 relative z-10">
          <h2 className="text-xl font-bold mb-6 text-[#1DB954]">Seed Track</h2>
          <div className="mb-8">
            <h3 className="text-3xl font-bold">{selectedTrack.track_name}</h3>
            <p className="text-xl text-white/60">{selectedTrack.artists}</p>
            <div className="mt-2 text-sm bg-white/10 inline-block px-3 py-1 rounded-full">
              Genre: {selectedTrack.track_genre}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 mb-8">
            {AUDIO_FEATURES.map(feat => {
              const val = customFeatures[feat] || 0;
              return (
                <div key={feat} className="flex flex-col gap-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/70 capitalize">{feat}</span>
                    <span className="font-mono text-[#1DB954]">{formatAudioFeature(val)}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.01" 
                    value={val}
                    onChange={(e) => setCustomFeatures({ ...customFeatures, [feat]: parseFloat(e.target.value) })}
                    className="w-full accent-[#1DB954] cursor-pointer"
                  />
                </div>
              );
            })}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white/70 capitalize">Tempo (BPM)</span>
                <span className="font-mono text-[#1DB954]">{Math.round(customFeatures.tempo || 120)}</span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="250" 
                step="1" 
                value={customFeatures.tempo || 120}
                onChange={(e) => setCustomFeatures({ ...customFeatures, tempo: parseFloat(e.target.value) })}
                className="w-full accent-[#1DB954] cursor-pointer"
              />
            </div>
            
            <div className="flex flex-col gap-2 sm:col-span-2 mt-2">
               <label className="text-white/70 text-sm">Target Genre (Optional)</label>
               <select 
                 value={selectedGenre}
                 onChange={(e) => setSelectedGenre(e.target.value)}
                 className="bg-black/40 border border-white/20 text-white text-sm rounded-xl focus:ring-[#1DB954] focus:border-[#1DB954] block w-full p-3 transition-colors"
               >
                 <option value="">Any Genre</option>
                 {availableGenres.map(g => (
                   <option key={g.genre_name} value={g.genre_name}>{g.genre_name}</option>
                 ))}
               </select>
            </div>
          </div>

          <button 
            onClick={handleFindSimilar}
            disabled={loadingRecs}
            className="w-full bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold py-4 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loadingRecs ? <Loader size="sm" /> : <Search size={20} />}
            {loadingRecs ? "Finding similar tracks..." : "Find Similar Tracks"}
          </button>
        </div>
      )}

      {recommendations.length > 0 && !loadingRecs && (
        <div className="mt-16 max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Recommendations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map(rec => (
              <TrackCard 
                key={rec.track_id} 
                track={rec} 
                similarity={rec.similarity_score}
                onSelect={handleSelectTrack}
                showRecommendButton={true}
              />
            ))}
          </div>

          <div className="mt-16 bg-[#121212] border border-white/10 rounded-2xl p-6 flex gap-4">
            <Info size={32} className="text-[#1DB954] flex-shrink-0" />
            <div>
              <h3 className="font-bold text-lg mb-2">Why these tracks?</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                We represent every track as a multidimensional vector using its numerical audio features (danceability, energy, tempo, etc.). When you select a seed track, we calculate the <strong>Cosine Similarity</strong> between its vector and the vectors of all other 100k+ tracks in our database. The tracks returned have the highest cosine similarity scores, meaning their acoustic profile mathematically points in the exact same direction as your selected track!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Top Tracks by Genre Section */}
      <div className="mt-24 max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold tracking-tight text-center mb-12">Top Tracks by Genre</h2>
        {loadingTop ? (
          <div className="flex justify-center"><Loader size="lg" /></div>
        ) : topTracksByGenre.length > 0 ? (
          <div className="flex flex-col gap-12">
            {topTracksByGenre.map((group) => (
              <div key={group.genre} className="bg-white/5 border border-white/10 p-8 rounded-3xl">
                <h3 className="text-2xl font-bold text-[#1DB954] mb-6 capitalize">{group.genre}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {group.tracks.map((track) => (
                    <TrackCard 
                      key={track.track_id} 
                      track={track} 
                      onSelect={handleSelectTrack}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-white/50">No top tracks available.</p>
        )}
      </div>

    </PageWrapper>
  );
}
