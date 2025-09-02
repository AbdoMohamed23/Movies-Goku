import React, { useEffect, useState } from "react";
import Card from "./Card";
import axios from "axios";

const API_KEY = "52ef927bbeb21980cd91386a29403c78";

const categories = [
    {
        title: "Popular Movies",
        url: `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en,`
    },
    {
        title: "Fantasy",
        url: `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en&with_genres=14,`
    },
    {
        title: "Animation",
        url: `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en&with_genres=16,`
    },
    {
        title: "Horror",
        url: `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en&with_genres=27,`
    },
];

const CardList = () => {
    const [selectedCategory, setSelectedCategory] = useState(categories[0]); // الافتراضي Popular
    const [movies, setMovies] = useState([]);

    const getMovies = async (category) => {
        try {
            let allResults = [];

            // هنا ممكن تزود الصفحات لو عايز أكتر من 20
            for (let page = 1; page <= 3; page++) {
                const res = await axios.get(`${category.url}&page=${page}`);
                allResults = allResults.concat(res.data.results);
            }

            setMovies(allResults);
        } catch (error) {
            console.error("Error fetching movies:", error);
        }
    };

    useEffect(() => {
        getMovies(selectedCategory);
    }, [selectedCategory]);

    return (
        <main className="p-6 space-y-6">
            {/* Dropdown لاختيار الفئة */}
            <div className="mb-4 md:px-6">
                <select value={selectedCategory.title} onChange={(e) =>
                    setSelectedCategory(categories.find((cat) => cat.title === e.target.value))} className="px-4 py-2 bg-background text-H1 cursor-pointer border rounded-lg focus:border-orange-600">
                    {categories.map((cat) => (
                        <div className="border-8 rounded-full">
                            <option key={cat.id} value={cat.title} className="option_CardList ">
                            {cat.title}
                        </option>
                        </div>
                    ))}
                </select>
            </div>
            <div className="w-full md:px-6 mx-auto grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-6">
                <Card movies={movies} />
            </div>
        </main>
    );
};

export default CardList