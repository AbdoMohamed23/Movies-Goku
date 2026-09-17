import React, { useState, useEffect } from 'react';
import { FaSearch, FaTimes, FaStar } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';

const API_KEY = "52ef927bbeb21980cd91386a29403c78";

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isClosing, setIsClosing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Smooth entrance
  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = React.useCallback(() => {
    setIsClosing(true);
    setIsOpen(false);
    setTimeout(() => {
      navigate(-1 || '/');
    }, 280);
  }, [navigate]);

  // Handle ESC key to close smoothly
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose]);

  useEffect(() => {
    if (query.trim().length > 0) {
      setLoading(true);
      const timer = setTimeout(() => {
        fetch(`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`)
          .then(res => res.json())
          .then(data => {
            const valid = (data.results || []).filter(
              item => (item.media_type === 'movie' || item.media_type === 'tv' || item.title || item.name) && (item.poster_path || item.backdrop_path)
            );
            setResults(valid);
            setLoading(false);
          })
          .catch(() => setLoading(false));
      }, 250);

      return () => clearTimeout(timer);
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [query]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col bg-[#0c0e12]/95 backdrop-blur-xl transition-opacity duration-300 ease-out ${
        isOpen && !isClosing ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Top Search Bar */}
      <div className={`p-4 sm:p-6 border-b border-gray-800/80 transform transition-transform duration-300 ease-out ${
        isOpen && !isClosing ? 'translate-y-0' : '-translate-y-6'
      }`}>
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <div className="flex-1 flex items-center gap-3 bg-gray-900/90 px-4 py-3 rounded-2xl border border-gray-700/70 focus-within:border-orange-500 shadow-xl transition-all">
            <FaSearch className="text-orange-400 text-xl flex-shrink-0" />
            <input
              type="text"
              autoFocus
              className="bg-transparent text-white text-lg sm:text-2xl w-full outline-none placeholder-gray-500 font-medium"
              placeholder="Search movies, series, franchises (e.g. Godfather, Batman, Harry Potter)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-gray-400 hover:text-white p-1 transition-colors"
                title="Clear search"
              >
                <FaTimes />
              </button>
            )}
          </div>

          <button
            onClick={handleClose}
            className="p-3 rounded-2xl bg-gray-800/90 text-gray-300 hover:text-white hover:bg-gray-700 border border-gray-700/80 transition-all flex-shrink-0 shadow-lg"
            title="Close Search (Esc)"
            aria-label="Close search"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>
      </div>

      {/* Search Results Content */}
      <div className="max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-6 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-lg sm:text-xl font-bold flex items-center gap-2">
            <span>Search Results</span>
            {query && (
              <span className="text-xs bg-orange-600/20 text-orange-400 px-2.5 py-1 rounded-full border border-orange-500/30">
                {results.length} found
              </span>
            )}
          </h2>
          <span className="text-xs text-gray-500 hidden sm:inline">Press ESC to close</span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-gray-400 text-sm">Searching for "{query}"...</p>
          </div>
        ) : query.length > 0 && results.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg mb-2">No results found for "{query}"</p>
            <p className="text-xs text-gray-500">Try searching for a different movie or series title.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-4 md:gap-6 pb-12">
            {results.map((item) => {
              const title = item.title || item.name;
              const date = item.release_date || item.first_air_date;
              const isTv = item.media_type === 'tv' || !item.release_date;
              const poster = item.poster_path
                ? `https://image.tmdb.org/t/p/w400/${item.poster_path}`
                : item.backdrop_path
                ? `https://image.tmdb.org/t/p/w500/${item.backdrop_path}`
                : 'https://via.placeholder.com/400x600?text=No+Poster';

              return (
                <Link
                  to={`/details/${item.id}${isTv ? '?type=tv' : ''}`}
                  key={`${item.id}-${item.media_type || 'movie'}`}
                  className="group bg-card rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-all duration-300 border border-gray-800 hover:border-orange-500/50 shadow-lg flex flex-col"
                >
                  <div className="relative aspect-[2/3] overflow-hidden bg-gray-900">
                    <img
                      src={poster}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    {isTv && (
                      <div className="absolute top-1.5 left-1.5 bg-blue-600/90 text-[9px] font-bold text-white px-1.5 py-0.5 rounded shadow">
                        TV
                      </div>
                    )}
                    <div className="absolute top-1.5 right-1.5 bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-semibold text-yellow-400 flex items-center gap-1">
                      <FaStar className="text-[9px]" />
                      {item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}
                    </div>
                  </div>
                  <div className="p-1.5 sm:p-2.5 flex flex-col justify-between flex-1 bg-gradient-to-b from-card to-[#16181f]">
                    <h3 className="text-white text-[11px] sm:text-xs md:text-sm font-semibold truncate group-hover:text-orange-400 transition-colors">
                      {title}
                    </h3>
                    <div className="flex justify-between items-center text-[9px] sm:text-[11px] text-gray-400 mt-1 sm:mt-2">
                      <span>{date ? date.slice(0, 4) : 'N/A'}</span>
                      <span className="text-orange-500 font-medium">Watch</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;