import React, { useEffect, useState } from 'react'
import Card from './Card';
import axios from 'axios';

// دالة لخلط المصفوفة
function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}

const CardList = () => {
    const [movies, setMovies] = useState([]);

    const getMovies = async () => {
        const ras = await axios.get('https://api.themoviedb.org/3/movie/popular?api_key=52ef927bbeb21980cd91386a29403c78&language=en');
        setMovies(shuffle(ras.data.results)); // خلط النتائج هنا
    };

    useEffect(() => {
        getMovies();
    }, []);

    return (
        <section className="flex justify-center items-center p-6">
            <div className="w-full px-6 mx-auto grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-6 ">
                <Card movies={movies} />
            </div>
        </section>
    )
}

export default CardList