import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, RefreshCw, AlertCircle } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import Loader from '../components/ui/Loader';
import Badge from '../components/ui/Badge';
import { predictPopularity } from '../hooks/useAPI';
import { formatAudioFeature } from '../utils/formatters';

const DEFAULT_FEATURES = {
  danceability: 0.7,
  energy: 0.6,
  valence: 0.5,
  speechiness: 0.05,
  acousticness: 0.2,
  instrumentalness: 0.0,
  liveness: 0.1,
  tempo: 120
};

export default function Predictor() {
  const [features, setFeatures] = useState(DEFAULT_FEATURES);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeatures(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await predictPopularity(features);
      setResult(res.data);
    } catch (err) {
      console.error("Prediction failed:", err);
      setError("Failed to predict popularity. Ensure backend is running and features are valid.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFeatures(DEFAULT_FEATURES);
    setResult(null);
    setError(null);
  };

  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Hit Predictor (ML)</h1>
        <p className="text-white/60 mt-2 max-w-2xl">
          Tweak the audio features below to see how our trained Scikit-Learn model scores the potential popularity of the track.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Panel: Inputs */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
          <form onSubmit={handlePredict} className="flex flex-col h-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 mb-8">
              {['danceability', 'energy', 'valence', 'speechiness', 'acousticness', 'instrumentalness', 'liveness'].map(key => (
                <div key={key} className="flex flex-col">
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-white/80 capitalize">{key}</label>
                    <span className="text-sm font-bold text-[#1DB954]">{formatAudioFeature(features[key])}</span>
                  </div>
                  <input
                    type="range"
                    name={key}
                    min="0"
                    max="1"
                    step="0.01"
                    value={features[key]}
                    onChange={handleChange}
                    className="w-full accent-[#1DB954] h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              ))}

              <div className="flex flex-col">
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-white/80 capitalize">Tempo (BPM)</label>
                  <span className="text-sm font-bold text-[#1DB954]">{Math.round(features.tempo)}</span>
                </div>
                <input
                  type="number"
                  name="tempo"
                  min="40"
                  max="250"
                  value={features.tempo}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#1DB954] transition-colors"
                />
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-white/10">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold text-lg py-4 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader size="sm" /> : <BrainCircuit size={24} />}
                Predict Popularity
              </button>
            </div>
          </form>
        </div>

        {/* Right Panel: Results */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center relative overflow-hidden min-h-[400px]">
          <AnimatePresence mode="wait">
            {!result && !error && !loading && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-white/40 flex flex-col items-center"
              >
                <BrainCircuit size={64} className="mb-4 opacity-20" />
                <p className="text-lg">Enter features and click Predict.</p>
              </motion.div>
            )}

            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-xl flex flex-col items-center text-center"
              >
                <AlertCircle size={48} className="mb-4" />
                <p>{error}</p>
              </motion.div>
            )}

            {loading && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Loader size="lg" />
              </motion.div>
            )}

            {result && !loading && !error && (
              <motion.div
                key="result"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full flex flex-col items-center"
              >
                <div className="relative w-48 h-48 mb-6 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#ffffff10" strokeWidth="8" />
                    {/* Progress circle */}
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#1DB954"
                      strokeWidth="8"
                      strokeDasharray="283"
                      initial={{ strokeDashoffset: 283 }}
                      animate={{ strokeDashoffset: 283 - (283 * Math.min(result.predicted_popularity, 100)) / 100 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-extrabold text-white">
                      {Math.round(result.predicted_popularity)}
                    </span>
                    <span className="text-white/50 text-sm uppercase tracking-widest mt-1">Score</span>
                  </div>
                </div>

                <Badge text={result.category} variant={result.category} />

                <div className="w-full mt-8 space-y-3">
                  <div className="flex justify-between text-sm bg-white/5 p-3 rounded-lg border border-white/5">
                    <span className="text-white/60">Danceability</span>
                    <span className="font-bold text-white">{features.danceability >= 0.7 ? "Highly Danceable" : "Moderate"} ({features.danceability})</span>
                  </div>
                  <div className="flex justify-between text-sm bg-white/5 p-3 rounded-lg border border-white/5">
                    <span className="text-white/60">Energy</span>
                    <span className="font-bold text-white">{features.energy >= 0.7 ? "High Energy" : "Mellow"} ({features.energy})</span>
                  </div>
                  <div className="flex justify-between text-sm bg-white/5 p-3 rounded-lg border border-white/5">
                    <span className="text-white/60">Valence</span>
                    <span className="font-bold text-white">{features.valence >= 0.6 ? "Happy/Upbeat" : "Sad/Dark"} ({features.valence})</span>
                  </div>
                </div>

                <button
                  onClick={resetForm}
                  className="mt-8 text-white/60 hover:text-white flex items-center gap-2 transition-colors"
                >
                  <RefreshCw size={18} />
                  Try Another
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageWrapper>
  );
}
