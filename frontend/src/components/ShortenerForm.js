import React, { useState } from 'react';
import { Link2, Sparkles, Copy, ExternalLink, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

const ShortenerForm = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!originalUrl) {
      toast.error('Please enter a URL to shorten');
      return;
    }

    setIsLoading(true);
    setShortUrl('');

    try {
      const response = await api.post('/shortUrl', {
        originalUrl,
        customAlias: customAlias || undefined
      });

      setShortUrl(response.data.shortUrl);
      toast.success('URL successfully shortened!');
      // setOriginalUrl('');
      // setCustomAlias('');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to shorten URL');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 space-y-8">
      <div className="glass-panel p-8 rounded-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-32 bg-[hsl(var(--primary))]/10 rounded-full blur-3xl -z-10 group-hover:bg-[hsl(var(--secondary))]/10 transition-colors duration-700" />

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">Original URL</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Link2 className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="url"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                placeholder="https://example.com/very-long-url"
                className="input-field pl-12"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">Custom Alias (Optional)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Sparkles className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
                placeholder="my-custom-link"
                className="input-field pl-12"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
                <span>Shortening...</span>
              </>
            ) : (
              <span>Shorten URL</span>
            )}
          </button>
        </form>
      </div>

      {shortUrl && (
        <div className="glass-panel p-6 rounded-2xl animate-[fadeIn_0.5s_ease-out]">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Your Shortened URL</h3>
          <div className="flex items-center space-x-3 bg-[hsl(var(--input))] p-4 rounded-xl border border-[hsl(var(--border))]">
            <a
              href={shortUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 text-[hsl(var(--secondary))] hover:text-[hsl(var(--secondary-hover))] font-medium truncate"
            >
              {shortUrl}
            </a>
            <div className="flex items-center space-x-2 border-l border-[hsl(var(--border))] pl-3">
              <button
                onClick={copyToClipboard}
                className="p-2 hover:bg-[hsl(var(--border))] rounded-lg transition-colors text-gray-300 hover:text-white"
                title="Copy to clipboard"
              >
                <Copy className="h-5 w-5" />
              </button>
              <a
                href={shortUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 hover:bg-[hsl(var(--border))] rounded-lg transition-colors text-gray-300 hover:text-white"
                title="Open link"
              >
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShortenerForm;
