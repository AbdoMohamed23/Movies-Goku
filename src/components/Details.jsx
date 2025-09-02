import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const Details = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);

  useEffect(() => {
    const getMovie = async () => {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}?api_key=52ef927bbeb21980cd91386a29403c78&language=en`
      );
      setMovie(response.data);
    };

    const getTrailer = async () => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/videos?api_key=52ef927bbeb21980cd91386a29403c78&language=en`
        );
        const trailer = res.data.results.find(
          (vid) => vid.type === 'Trailer' && vid.site === 'YouTube'
        );
        if (trailer) setTrailerKey(trailer.key);
      } catch (e) {
        setTrailerKey(null);
      }
    };

    const getSimilar = async () => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/similar?api_key=52ef927bbeb21980cd91386a29403c78&language=en&page=1`
        );
        setSimilarMovies(res.data.results);
      } catch (e) {
        setSimilarMovies([]);
      }
    };

    getMovie();
    getTrailer();
    getSimilar();
  }, [id]);

  return (
    <div className="text-white py-6">
      {movie && (
        <div className="bg-card grid grid-cols-1 md:grid-cols-2 justify-between gap-8 rounded-2xl shadow-md p-4 mb-8 mx-6">
          <div className="justify-center flex">
            {trailerKey ? (
              <iframe
                width="100%"
                height="315"
                src={`https://www.youtube.com/embed/${trailerKey}`}
                title="Trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-2xl w-full md:w-full"
              ></iframe>
            ) : (
              <img
                src={`https://image.tmdb.org/t/p/w400/${movie.poster_path}`}
                alt={movie.title}
                className="rounded-2xl w-full md:w-2/4"
              />
            )}
          </div>
          <div>
            <h2 className="text-xl text-orange-600 mt-2 mb-7">{movie.title}</h2>
            <p className="text-H1 text-sm">Release Date: {movie.release_date}</p>
            <p className="text-H1 text-sm">Rating: {movie.vote_average.toFixed(1)}</p>
            <p className="text-H1 text-sm mt-2">{movie.overview}</p>
          </div>
        </div>
      )}

      {/* similar movies section */}
      <div className="p-6 space-y-6">
        <h3 className="md:ps-6 text-lg font-semibold mb-4">Similar Movies</h3>
        <div className="w-full md:px-6 mx-auto grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-6">
          {similarMovies.map((sim) => (
            <Link to={`/details/${sim.id}`} className="bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300" key={sim.id}>
              <img src={`https://image.tmdb.org/t/p/w500/${sim.poster_path}`} className='rounded-t-lg' alt={sim.title} />
              <div className='px-2 md:px-2 flex flex-col justify-between py-2'>
                <h1 className='text-H1 text-xs md:text-sm text-start truncate'>{sim.title}</h1>
                <div className='flex justify-between text-xs text-gray-300 mt-2'>
                  <span>{sim.release_date?.slice(0, 4)}</span>
                  <span>⭐ {sim.vote_average?.toFixed(1)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Details;