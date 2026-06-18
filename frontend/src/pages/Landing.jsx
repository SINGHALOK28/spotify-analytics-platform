import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart3, Brain, Music } from 'lucide-react';
import { getDashboard } from '../hooks/useAPI';
import KPICard from '../components/ui/KPICard';

export default function Landing() {
  const [stats, setStats] = useState({ total_tracks: 0, total_artists: 0, total_genres: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then(res => setStats(res.data))
      .catch(err => console.error("Error fetching stats:", err))
      .finally(() => setLoading(false));
  }, []);

  const headingWords = "Spotify Analytics Platform".split(" ");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden selection:bg-[#1DB954]/30">
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center">
        {/* Radial Gradient Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(29,185,84,0.15)_0%,rgba(10,10,10,1)_50%)] pointer-events-none" />
        
        <div className="z-10 max-w-4xl mx-auto flex flex-col items-center">
          <motion.h1 
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 flex flex-wrap justify-center gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {headingWords.map((word, i) => (
              <motion.span key={i} variants={wordVariants} className={word === "Spotify" ? "text-[#1DB954]" : ""}>
                {word}
              </motion.span>
            ))}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-xl md:text-2xl text-white/70 mb-10 max-w-2xl"
          >
            Uncover deep insights, predict hit songs using Machine Learning, and explore track similarity.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.4 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link to="/dashboard">
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(29,185,84,0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#1DB954] text-black font-bold text-lg px-8 py-4 rounded-full transition-colors hover:bg-[#1ed760]"
              >
                Explore Dashboard
              </motion.button>
            </Link>
            <Link to="/predict">
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255,255,255,0.2)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 text-white font-bold text-lg px-8 py-4 rounded-full backdrop-blur-md border border-white/20 transition-colors hover:bg-white/20"
              >
                Try Predictor
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Live Stats Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KPICard title="Total Tracks" value={stats.total_tracks} icon={Music} loading={loading} />
          <KPICard title="Total Artists" value={stats.total_artists} icon={Music} color="text-blue-500" loading={loading} />
          <KPICard title="Total Genres" value={stats.total_genres} icon={BarChart3} color="text-yellow-500" loading={loading} />
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-24 px-6 max-w-6xl mx-auto relative z-10">
        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-16"
        >
          Powerful Features
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Analytics Dashboard",
              desc: "Visualize popularity distributions, genre trends, and audio feature comparisons with interactive charts.",
              icon: BarChart3,
              color: "text-blue-400"
            },
            {
              title: "ML Predictions",
              desc: "Tweak acoustic features like danceability and energy to predict a track's potential popularity score.",
              icon: Brain,
              color: "text-purple-400"
            },
            {
              title: "Recommendations",
              desc: "Find mathematically similar tracks based on audio feature embeddings using cosine similarity vectors.",
              icon: Music,
              color: "text-[#1DB954]"
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors"
            >
              <div className={`mb-6 inline-block p-4 rounded-xl bg-white/5 ${feature.color}`}>
                <feature.icon size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
              <p className="text-white/60 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
