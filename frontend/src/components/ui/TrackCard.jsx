import { motion } from 'framer-motion';
import { PlayCircle } from 'lucide-react';
import Badge from './Badge';
import { formatDuration, getBucketColor, truncate, formatSimilarity } from '../../utils/formatters';

export default function TrackCard({ track, similarity, onSelect, showRecommendButton = false }) {
  if (!track) return null;

  const handleCardClick = () => {
    if (onSelect && !showRecommendButton) {
      onSelect(track.track_id);
    }
  };

  const handleBtnClick = (e) => {
    e.stopPropagation();
    if (onSelect) onSelect(track.track_id);
  };

  const popColor = getBucketColor(track.popularity_bucket);

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      onClick={handleCardClick}
      className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 flex flex-col gap-3 transition-colors ${onSelect && !showRecommendButton ? 'cursor-pointer hover:bg-white/10' : ''}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-bold text-lg leading-tight truncate" title={track.track_name}>
            {truncate(track.track_name, 30)}
          </h4>
          <p className="text-white/60 text-sm truncate">{track.artists}</p>
        </div>
        {similarity != null && (
          <div className="bg-[#1DB954]/20 text-[#1DB954] text-xs font-bold px-2 py-1 rounded-md ml-3 whitespace-nowrap">
            {formatSimilarity(similarity)} Match
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mt-1">
        {track.track_genre && (
          <Badge text={track.track_genre} variant="medium" />
        )}
        {track.popularity_bucket && (
          <Badge text={track.popularity_bucket} />
        )}
      </div>

      <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between text-sm">
        <div className="flex flex-col">
          <span className="text-white/40 text-xs uppercase tracking-wider">Popularity</span>
          <span className={`font-bold text-base ${popColor}`}>{Math.round(track.popularity || 0)}</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-white/40 text-xs uppercase tracking-wider">Duration</span>
            <span className="text-white/80 font-medium">{formatDuration(track.duration_minutes)}</span>
          </div>
          
          {showRecommendButton && (
            <button 
              onClick={handleBtnClick}
              className="bg-[#1DB954] hover:bg-[#1ed760] text-black rounded-full p-2 transition-colors ml-2"
              title="Get Recommendations"
            >
              <PlayCircle size={20} className="fill-black" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
