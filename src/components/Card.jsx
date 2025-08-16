import React from 'react'
import { Link } from 'react-router-dom'

const Card = ({ movies }) => {
  return (
    <>
      {movies && movies.map((movie) => {
        return (
          <Link to={`/details/${movie.id}`} className="bg-card rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300" key={movie.id}>
            <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} className='rounded-t-2xl' alt="" />
            <div className='px-4 flex flex-col justify-between py-2'>
              <h1 className='text-H1 text-lg text-start truncate'>{movie.title}</h1>
              <div className='flex flex-wrap justify-between items-center'>
                <p className='text-H1 text-sm'>{movie.release_date.slice(0,4)}</p>
                <p className='text-H1 text-sm'>{movie.vote_average.toFixed(1)}</p>
              </div>
            </div>
          </Link>
        )
      })}
    </>
  )
}

export default Card