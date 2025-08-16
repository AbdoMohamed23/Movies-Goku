import axios from 'axios';
import CardList from './CardList';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Details = () => {
  const { id } = useParams();
  const [movies, setMovies] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);

  useEffect(() => {
    const getMovies = async () => {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=52ef927bbeb21980cd91386a29403c78&language=en`);
      setMovies([response.data]); // Wrap in an array to match the map structure
    };

    const getTrailer = async () => {
      try {
        const res = await axios.get(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=52ef927bbeb21980cd91386a29403c78&language=en`);
        const trailer = res.data.results.find(
          vid => vid.type === "Trailer" && vid.site === "YouTube"
        );
        if (trailer) setTrailerKey(trailer.key);
      } catch (e) {
        setTrailerKey(null);
      }
    };

    getMovies();
    getTrailer();
  }, [id]);

  return (
    <div className="text-white py-6">
      {movies && movies.map((movie) => (
        <div key={movie.id} className="bg-card grid grid-cols-1 md:grid-cols-2 justify-between gap-8 rounded-2xl shadow-md p-4 mb-4 mx-6">
          <div className='justify-center flex'>
            {trailerKey ? (
              <iframe
                width="100%"
                height="315"
                src={`https://www.youtube.com/embed/${trailerKey}`}
                title="Trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className='rounded-2xl w-full md:w-full'
              ></iframe>
            ) : (
              <img src={`https://image.tmdb.org/t/p/w400/${movie.poster_path}`} alt={movie.title} className='rounded-2xl w-full md:w-2/4' />
            )}
          </div>
          <div>
            <h2 className='text-xl text-orange-600 mt-2 mb-7'>{movie.title}</h2>
            <p className='text-H1 text-sm'>Release Date: {movie.release_date}</p>
            <p className='text-H1 text-sm'>Rating: {movie.vote_average.toFixed(1)}</p>
            <p className='text-H1 text-sm mt-2'>{movie.overview}</p>
          </div>
        </div>
      ))}
      <CardList key={id}/>
    </div>
  );
};

export default Details;