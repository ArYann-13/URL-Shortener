import React, { useState } from 'react';
import { Search, BarChart2, Calendar, Link2, Loader2, MousePointerClick } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

const StatsViewer = () => {
  const [shortCode, setShortCode] = useState('');
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStats = async (e) => {
    e.preventDefault();
    if (!shortCode) {
      toast.error('Please enter a short code');
      return;
    }

    setIsLoading(true);
    setStats(null);
    
    // Extract the code if user pasted full URL
    let codeToFetch = shortCode;
    try {
      if (shortCode.startsWith('http')) {
        const url = new URL(shortCode);
        const pathSegments = url.pathname.split('/').filter(Boolean);
        codeToFetch = pathSegments[pathSegments.length - 1]; // get last segment
      }
    } catch (e) {
      // Not a full URL, treat as just the code
    }

    try {
      const response = await api.get(`/stats/${codeToFetch}`);
      setStats(response.data);
      toast.success('Stats fetched successfully!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to fetch stats. Check if the code is correct.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 space-y-8">
      <div className="glass-panel p-8 rounded-2xl">
        <div className="flex items-center space-x-3 mb-6 text-gray-200">
          <BarChart2 className="h-6 w-6 text-[hsl(var(--secondary))]" />
          <h2 className="text-xl font-bold">Track URL Analytics</h2>
        </div>
        
        <form onSubmit={fetchStats} className="flex gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={shortCode}
              onChange={(e) => setShortCode(e.target.value)}
              placeholder="Enter short code or full short URL"
              className="input-field pl-12"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary flex items-center justify-center min-w-[120px]"
          >
            {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Get Stats'}
          </button>
        </form>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-[fadeIn_0.5s_ease-out]">
          <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-2">
            <div className="p-3 bg-[hsl(var(--primary))]/20 rounded-full text-[hsl(var(--primary))]">
              <MousePointerClick className="h-6 w-6" />
            </div>
            <p className="text-gray-400 text-sm">Total Clicks</p>
            <p className="text-3xl font-bold text-white">{stats.clicks}</p>
          </div>
          
          <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-2">
            <div className="p-3 bg-[hsl(var(--secondary))]/20 rounded-full text-[hsl(var(--secondary))]">
              <Calendar className="h-6 w-6" />
            </div>
            <p className="text-gray-400 text-sm">Created At</p>
            <p className="text-lg font-semibold text-white">
              {new Date(stats.createdAt).toLocaleDateString()}
            </p>
          </div>
          
          <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 md:col-span-3">
            <div className="p-3 bg-[hsl(var(--accent))]/20 rounded-full text-[hsl(var(--accent))] mb-2">
              <Link2 className="h-6 w-6" />
            </div>
            <p className="text-gray-400 text-sm">Original URL</p>
            <a 
              href={stats.originalUrl} 
              target="_blank" 
              rel="noreferrer"
              className="text-[hsl(var(--foreground))] hover:text-[hsl(var(--secondary))] transition-colors text-center break-all w-full px-4"
            >
              {stats.originalUrl}
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsViewer;
