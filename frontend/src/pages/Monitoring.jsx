import { useState, useEffect } from 'react';
import { Activity, Server, Zap, ThumbsUp, LogIn, AlertOctagon, Database } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../hooks/useAPI';
import KPICard from '../components/ui/KPICard';

export default function Monitoring() {
  const [metrics, setMetrics] = useState({
    api_requests: 0,
    total_predictions: 0,
    total_recommendations: 0,
    successful_logins: 0,
    failed_logins: 0,
    etl_runs: 0
  });
  
  const [etlStatus, setEtlStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [sysMetricsRes, etlStatusRes] = await Promise.all([
          api.get('/admin/system-metrics'),
          api.get('/admin/etl-status')
        ]);
        
        setMetrics(sysMetricsRes.data);
        setEtlStatus(etlStatusRes.data);
      } catch (err) {
        console.error("Failed to fetch monitoring data", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMetrics();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
          <Activity className="text-[#1DB954]" size={36} />
          System Monitoring
        </h1>
        <p className="text-white/60">Real-time platform observability and metrics</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <KPICard 
          title="Total API Requests" 
          value={metrics.api_requests || 0} 
          icon={Server} 
          color="text-blue-500" 
          loading={loading} 
        />
        <KPICard 
          title="Predictions Generated" 
          value={metrics.total_predictions || metrics.predictions || 0} 
          icon={Zap} 
          color="text-yellow-500" 
          loading={loading} 
        />
        <KPICard 
          title="Recommendations Served" 
          value={metrics.total_recommendations || metrics.recommendations || 0} 
          icon={ThumbsUp} 
          color="text-purple-500" 
          loading={loading} 
        />
        <KPICard 
          title="Successful Logins" 
          value={metrics.successful_logins || 0} 
          icon={LogIn} 
          color="text-green-500" 
          loading={loading} 
        />
        <KPICard 
          title="Failed Logins" 
          value={metrics.failed_logins || 0} 
          icon={AlertOctagon} 
          color="text-red-500" 
          loading={loading} 
        />
        <KPICard 
          title="ETL Pipeline Runs" 
          value={metrics.etl_runs || 0} 
          icon={Database} 
          color="text-pink-500" 
          loading={loading} 
        />
      </div>

      {/* ETL Status Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6"
      >
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Database size={24} className="text-[#1DB954]" />
          Latest ETL Pipeline Run
        </h2>
        
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-6 w-1/4 bg-white/10 rounded"></div>
            <div className="h-6 w-1/2 bg-white/10 rounded"></div>
          </div>
        ) : etlStatus && Object.keys(etlStatus).length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-white/50 text-sm mb-1">Status</p>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                etlStatus.status === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {etlStatus.status ? etlStatus.status.toUpperCase() : 'UNKNOWN'}
              </span>
            </div>
            <div>
              <p className="text-white/50 text-sm mb-1">Rows Processed</p>
              <p className="text-white font-medium text-lg">{etlStatus.rows_processed?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-white/50 text-sm mb-1">Duration</p>
              <p className="text-white font-medium text-lg">{etlStatus.duration_seconds}s</p>
            </div>
            <div>
              <p className="text-white/50 text-sm mb-1">Last Run</p>
              <p className="text-white font-medium text-lg">
                {etlStatus.run_timestamp ? new Date(etlStatus.run_timestamp).toLocaleString() : 'N/A'}
              </p>
            </div>
            {etlStatus.error_message && (
              <div className="col-span-full mt-4 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <p className="text-red-400 text-sm font-mono">{etlStatus.error_message}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-white/50">No ETL runs recorded yet.</p>
        )}
      </motion.div>
    </div>
  );
}
