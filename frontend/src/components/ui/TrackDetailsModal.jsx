import { motion, AnimatePresence } from 'framer-motion';
import { X, Music, Activity, Zap, Heart, Disc, Volume2, Mic, Piano } from 'lucide-react';
import Badge from './Badge';
import { formatDuration, getBucketColor } from '../../utils/formatters';

export default function TrackDetailsModal({ track, isOpen, onClose }) {
  if (!isOpen || !track) return null;

  const features = [
    { label: 'Danceability', value: track.danceability, icon: Activity, color: 'text-[#1DB954]' },
    { label: 'Energy', value: track.energy, icon: Zap, color: 'text-[#3b82f6]' },
    { label: 'Valence', value: track.valence, icon: Heart, color: 'text-[#f59e0b]' },
    { label: 'Acousticness', value: track.acousticness, icon: Disc, color: 'text-[#ec4899]' },
    { label: 'Speechiness', value: track.speechiness, icon: Mic, color: 'text-[#8b5cf6]' },
    { label: 'Instrumentalness', value: track.instrumentalness, icon: Piano, color: 'text-[#06b6d4]' },
  ];

  const popColor = getBucketColor(track.popularity_bucket);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-[#18181b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="relative p-6 sm:p-8 bg-gradient-to-br from-white/10 to-transparent border-b border-white/10 flex-shrink-0">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-white/50 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="flex items-start gap-5 pr-10">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#1DB954] to-[#1ed760] rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                <Music size={32} className="text-black" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-1">
                  {track.track_name}
                </h2>
                <p className="text-lg text-white/70 font-medium mb-3">
                  {track.artists}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge text={track.track_genre} variant="medium" />
                  <Badge text={track.popularity_bucket} />
                  {track.explicit && (
                    <span className="bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold px-2 py-0.5 rounded uppercase">
                      Explicit
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable Body */}
          <div className="p-6 sm:p-8 overflow-y-auto">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col">
                <span className="text-white/40 text-xs uppercase tracking-wider mb-1">Popularity</span>
                <span className={`text-2xl font-bold ${popColor}`}>{Math.round(track.popularity)}</span>
              </div>
              <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col">
                <span className="text-white/40 text-xs uppercase tracking-wider mb-1">Tempo</span>
                <span className="text-2xl font-bold text-white">{Math.round(track.tempo)} <span className="text-sm font-normal text-white/40">BPM</span></span>
              </div>
              <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col">
                <span className="text-white/40 text-xs uppercase tracking-wider mb-1">Duration</span>
                <span className="text-2xl font-bold text-white">{formatDuration(track.duration_minutes)}</span>
              </div>
              <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col">
                <span className="text-white/40 text-xs uppercase tracking-wider mb-1">Album</span>
                <span className="text-sm font-bold text-white truncate" title={track.album_name}>{track.album_name || "Single"}</span>
              </div>
            </div>

            {/* Audio Features */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Volume2 size={20} className="text-white/40" />
                Audio Features
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feat) => {
                  const Icon = feat.icon;
                  const percentage = Math.round(feat.value * 100);
                  
                  return (
                    <div key={feat.label} className="bg-black/20 rounded-xl p-4 border border-white/5 flex items-center gap-4">
                      <div className={`p-2 rounded-lg bg-white/5 ${feat.color}`}>
                        <Icon size={20} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-white/80">{feat.label}</span>
                          <span className="text-sm font-bold text-white">{percentage}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-full rounded-full ${feat.color.replace('text-', 'bg-')}`}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
