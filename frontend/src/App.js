import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Scissors, Activity } from 'lucide-react';
import ShortenerForm from './components/ShortenerForm';
import StatsViewer from './components/StatsViewer';

function App() {
  const [activeTab, setActiveTab] = useState('shorten');

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative z-0">
      {/* Background decorations */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-[hsl(var(--primary))]/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-[hsl(var(--secondary))]/20 rounded-full blur-[120px]" />
      </div>

      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: 'hsl(var(--card))',
            color: 'hsl(var(--foreground))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '16px',
            backdropFilter: 'blur(10px)',
          }
        }}
      />
      
      <main className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))]">
            URL Shortener
          </h1>
          <p className="text-xl text-gray-400 font-medium">
            Shorten, share, and track your links with ease.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 bg-[hsl(var(--card))]/50 backdrop-blur-md p-1.5 rounded-2xl border border-[hsl(var(--border))]">
          <button
            onClick={() => setActiveTab('shorten')}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              activeTab === 'shorten' 
                ? 'bg-[hsl(var(--input))] text-white shadow-md' 
                : 'text-gray-400 hover:text-white hover:bg-[hsl(var(--input))]/50'
            }`}
          >
            <Scissors className="h-4 w-4" />
            <span>Shorten</span>
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              activeTab === 'stats' 
                ? 'bg-[hsl(var(--input))] text-white shadow-md' 
                : 'text-gray-400 hover:text-white hover:bg-[hsl(var(--input))]/50'
            }`}
          >
            <Activity className="h-4 w-4" />
            <span>Analytics</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="w-full transition-all duration-500">
          {activeTab === 'shorten' ? <ShortenerForm /> : <StatsViewer />}
        </div>
      </main>
    </div>
  );
}

export default App;
