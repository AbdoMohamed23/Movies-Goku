import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlay, FaStar, FaHeart, FaRegHeart } from 'react-icons/fa';
import { isFavorite, toggleFavorite } from '../utils/favorites';

const Card = ({ movies }) => {
  const [, setFavTick] = useState(0);

  useEffect(() => {
    const handleFavUpdate = () => setFavTick((t) => t + 1);
    window.addEventListener('apex_favorites_updated', handleFavUpdate);
    return () => window.removeEventListener('apex_favorites_updated', handleFavUpdate);
  }, []);

  return (
    <>
      {movies && movies.map((item) => {
        const title = item.title || item.name || 'Untitled';
        const date = item.release_date || item.first_air_date;
        const isTv = item.media_type === 'tv' || Boolean(item.first_air_date && !item.release_date) || Boolean(item.name && !item.title);
        const fav = isFavorite(item.id);
        
        const posterUrl = item.poster_path
          ? `https://image.tmdb.org/t/p/w500/${item.poster_path}`
          : item.backdrop_path
          ? `https://image.tmdb.org/t/p/w500/${item.backdrop_path}`
          : 'https://via.placeholder.com/500x750?text=No+Poster';

        return (
          <Link
            to={`/details/${item.id}${isTv ? '?type=tv' : ''}`}
            className="group relative bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex flex-col border border-gray-800/40 hover:border-orange-500/50"
            key={`${item.id}-${isTv ? 'tv' : 'movie'}`}
          >
            <div className="relative overflow-hidden aspect-[2/3] bg-gray-900">
              <img
                src={posterUrl}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                alt={title}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-orange-600/90 text-white flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
                  <FaPlay className="ml-0.5 text-xs sm:text-base" />
                </div>
              </div>
              
              {/* Badges */}
              <div className="absolute top-1.5 left-1.5 flex items-center gap-1 z-10">
                {isTv && (
                  <div className="bg-blue-600/90 text-[9px] font-bold text-white px-1.5 py-0.5 rounded shadow">
                    TV
                  </div>
                )}
                {/* Heart / Favorite Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFavorite(item);
                  }}
                  title={fav ? "Remove from favorites" : "Add to favorites"}
                  className={`p-1.5 rounded-full backdrop-blur-md transition-colors duration-150 cursor-pointer ${
                    fav
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/40'
                      : 'bg-black/60 text-gray-300 hover:text-red-400 hover:bg-black/80'
                  }`}
                >
                  {fav ? <FaHeart className="text-[11px] sm:text-xs" /> : <FaRegHeart className="text-[11px] sm:text-xs" />}
                </button>
              </div>

              <div className="absolute top-1.5 right-1.5 bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded-md text-[10px] sm:text-[11px] font-semibold text-yellow-400 flex items-center gap-1 z-10">
                <FaStar className="text-[9px] sm:text-[10px]" />
                {item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}
              </div>
            </div>
            <div className="p-1.5 sm:p-2.5 flex flex-col justify-between flex-1 bg-gradient-to-b from-card to-[#10121a]">
              <h2 className="text-white text-[11px] sm:text-xs md:text-sm font-semibold truncate group-hover:text-orange-400 transition-colors">
                {title}
              </h2>
              <div className="flex justify-between items-center text-[9px] sm:text-[11px] text-gray-400 mt-1 sm:mt-2">
                <span>{date ? date.slice(0, 4) : 'N/A'}</span>
                <span className="text-orange-500/90 font-medium">Watch</span>
              </div>
            </div>
          </Link>
        );
      })}
    </>
  );
};

export default Card;