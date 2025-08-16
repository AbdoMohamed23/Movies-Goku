import React from 'react'
import { Link } from 'react-router-dom'

const Card = ({ movies }) => {
  return (
    <>
      {movies && movies.map((movie) => {
        return (
          <Link to={`/details/${movie.id}`} className="bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300" key={movie.id}>
            <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} className='rounded-t-lg' alt="" />
            <div className='px-1 md:px-2 flex flex-col justify-between py-2'>
              <h1 className='text-H1 text-sm md:text-lg text-start truncate'>{movie.title}</h1>
              <div className='flex justify-between text-sm text-gray-300 mt-2'>
                  <span>{movie.release_date?.slice(0, 4)}</span>
                  <span>⭐ {movie.vote_average?.toFixed(1)}</span>
              </div>
            </div>
          </Link>
        )
      })}
    </>
  )
}

export default Card