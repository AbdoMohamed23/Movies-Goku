import React, { useState, useEffect } from 'react';
import { FaSearch } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';

const API_KEY = "52ef927bbeb21980cd91386a29403c78";

const Search = ({ movies }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.length > 0) {
      fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`)
        .then(res => res.json())
        .then(data => setResults(data.results || []));
    } else {
      setResults([]);
    }
  }, [query]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex flex-col">
      <div className="flex items-center px-8 py-6 relative">
        <FaSearch className="text-white text-3xl mr-3" />
        <input
          type="text"
          autoFocus
          className="bg-transparent text-white text-2xl w-full outline-none"
          placeholder="Enter keywords..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button className="absolute right-8 text-white text-3xl" onClick={() => navigate('/')}>
          <IoClose />
        </button>
      </div>
      <div className="px-10 flex-1 overflow-y-auto"> {/* هنا أضفنا flex-1 و overflow-y-auto */}
        <h2 className="text-white text-2xl font-bold mb-6">{results.length} results</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 pb-10">
          {results.map(movie => (
            <Link
              to={`/details/${movie.id}`}
              key={movie.id}
              className="bg-card rounded-lg overflow-hidden cursor-pointer"
            >
              <img src={`https://image.tmdb.org/t/p/w300/${movie.poster_path}`} alt={movie.title} className="w-full h-64 object-cover" />
              <div className="p-3">
                <h3 className="text-white text-lg font-semibold truncate">{movie.title}</h3>
                <div className="flex justify-between text-sm text-gray-300 mt-2">
                  <span>{movie.release_date?.slice(0, 4)}</span>
                  <span>⭐ {movie.vote_average?.toFixed(1)}</span>
                </div>
              </div>
            </Link>
          ))}{/* map */}
        </div>
      </div>
    </div>
  );
};

export default Search;