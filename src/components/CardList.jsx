import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Card from "./Card";
import axios from "axios";
import { 
    FaFire, 
    FaStar, 
    FaTv, 
    FaFilm,
    FaBolt, 
    FaGhost, 
    FaRocket, 
    FaSmile, 
    FaMask, 
    FaMagic, 
    FaPalette,
    FaArrowRight,
    FaUser,
    FaChevronLeft,
    FaChevronRight,
    FaLanguage
} from "react-icons/fa";

const API_KEY = "52ef927bbeb21980cd91386a29403c78";

const CATEGORIES = [
    {
        id: "movies",
        title: "Movies",
        icon: <FaFilm className="text-amber-400" />,
        url: (page) => `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en&page=${page}`
    },
    {
        id: "tv",
        title: "TV Series",
        icon: <FaTv className="text-blue-400" />,
        url: (page) => `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=en&page=${page}`
    },
    {
        id: "dubbed",
        title: "Arabic Dubbed",
        icon: <FaLanguage className="text-emerald-400" />,
        url: (page) => `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en&with_genres=16,10751,12&sort_by=popularity.desc&page=${page}`
    },
    {
        id: "animation",
        title: "Animation",
        icon: <FaPalette className="text-pink-400" />,
        url: (page) => `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en&with_genres=16&page=${page}`
    },
    {
        id: "popular",
        title: "Popular",
        icon: <FaFire className="text-orange-500" />,
        url: (page) => `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en&page=${page}`
    },
    {
        id: "top_rated",
        title: "Top Rated",
        icon: <FaStar className="text-yellow-400" />,
        url: (page) => `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en&page=${page}`
    },
    {
        id: "action",
        title: "Action",
        icon: <FaBolt className="text-red-400" />,
        url: (page) => `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en&with_genres=28&page=${page}`
    },
    {
        id: "sci-fi",
        title: "Sci-Fi",
        icon: <FaRocket className="text-cyan-400" />,
        url: (page) => `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en&with_genres=878&page=${page}`
    },
    {
        id: "comedy",
        title: "Comedy",
        icon: <FaSmile className="text-amber-400" />,
        url: (page) => `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en&with_genres=35&page=${page}`
    },
    {
        id: "horror",
        title: "Horror",
        icon: <FaGhost className="text-purple-400" />,
        url: (page) => `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en&with_genres=27&page=${page}`
    },
    {
        id: "fantasy",
        title: "Fantasy",
        icon: <FaMagic className="text-indigo-400" />,
        url: (page) => `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en&with_genres=14&page=${page}`
    },
    {
        id: "drama",
        title: "Drama",
        icon: <FaMask className="text-blue-400" />,
        url: (page) => `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en&with_genres=18&page=${page}`
    },
];

const CardList = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryParam = searchParams.get("cat");
    const actorIdParam = searchParams.get("actor");
    const actorNameParam = searchParams.get("name") || "Actor";
    const currentPage = Number(searchParams.get("page")) || 1;

    // Homepage sections data
    const [tvSeries, setTvSeries] = useState([]);
    const [moviesList, setMoviesList] = useState([]);
    const [animations, setAnimations] = useState([]);

    // Single category or actor filtered data
    const [filteredItems, setFilteredItems] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [loading, setLoading] = useState(false);

    const isSingleCategory = Boolean(categoryParam || actorIdParam);

    const activeCategoryObj = useMemo(() => {
        return CATEGORIES.find((cat) => cat.id === categoryParam) || CATEGORIES[0];
    }, [categoryParam]);

    useEffect(() => {
        const fetchContent = async () => {
            setLoading(true);
            try {
                if (actorIdParam) {
                    // Calculate exact 21 items for page
                    const tmdbPageStart = Math.floor(((currentPage - 1) * 21) / 20) + 1;
                    const tmdbPageEnd = Math.floor((currentPage * 21 - 1) / 20) + 1;
                    
                    const requests = [
                        axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_cast=${actorIdParam}&language=en&page=${tmdbPageStart}&sort_by=popularity.desc`)
                    ];
                    if (tmdbPageEnd > tmdbPageStart) {
                        requests.push(
                            axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_cast=${actorIdParam}&language=en&page=${tmdbPageEnd}&sort_by=popularity.desc`)
                        );
                    }

                    const responses = await Promise.all(requests);
                    const combined = responses.flatMap((r) => r.data.results || []);
                    const offset = ((currentPage - 1) * 21) % 20;
                    const pageResults = combined.slice(offset, offset + 21);

                    setFilteredItems(pageResults);
                    const total = responses[0].data.total_results || 0;
                    setTotalResults(total);
                    setTotalPages(Math.min(Math.ceil(total / 21) || 1, 500));
                } else if (categoryParam) {
                    // Calculate exact 21 items for page
                    const tmdbPageStart = Math.floor(((currentPage - 1) * 21) / 20) + 1;
                    const tmdbPageEnd = Math.floor((currentPage * 21 - 1) / 20) + 1;

                    const requests = [axios.get(activeCategoryObj.url(tmdbPageStart))];
                    if (tmdbPageEnd > tmdbPageStart) {
                        requests.push(axios.get(activeCategoryObj.url(tmdbPageEnd)));
                    }

                    const responses = await Promise.all(requests);
                    const combined = responses.flatMap((r) => r.data.results || []);
                    const offset = ((currentPage - 1) * 21) % 20;
                    const pageResults = combined.slice(offset, offset + 21);

                    setFilteredItems(pageResults);
                    const total = responses[0].data.total_results || 0;
                    setTotalResults(total);
                    setTotalPages(Math.min(Math.ceil(total / 21) || 1, 500));
                } else {
                    // Fetch Homepage 3 Sections: exactly 21 TV Series, 21 Movies, 21 Animations (divisible by 3)
                    const [tv1, tv2, mov1, mov2, anim1, anim2] = await Promise.all([
                        axios.get(`https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=en&page=1`),
                        axios.get(`https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=en&page=2`),
                        axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en&page=1`),
                        axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en&page=2`),
                        axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en&with_genres=16&page=1`),
                        axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en&with_genres=16&page=2`)
                    ]);

                    const tv21 = [...(tv1.data.results || []), ...(tv2.data.results || [])].slice(0, 21);
                    const movie21 = [...(mov1.data.results || []), ...(mov2.data.results || [])].slice(0, 21);
                    const anim21 = [...(anim1.data.results || []), ...(anim2.data.results || [])].slice(0, 21);

                    setTvSeries(tv21);
                    setMoviesList(movie21);
                    setAnimations(anim21);
                }
            } catch (error) {
                console.error("Error fetching content:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [categoryParam, actorIdParam, currentPage, activeCategoryObj]);

    const handleCategorySelect = (catId) => {
        setSearchParams({ cat: catId, page: '1' });
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            const params = {};
            if (categoryParam) params.cat = categoryParam;
            if (actorIdParam) {
                params.actor = actorIdParam;
                params.name = actorNameParam;
            }
            params.page = String(newPage);
            setSearchParams(params);
        }
    };

    // Calculate visible pagination pages
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, currentPage - 2);
        let end = Math.min(totalPages, start + maxVisible - 1);
        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <main className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-10">
            
            {/* Desktop Category Filter Pills / Tabs */}
            <div className="hidden sm:flex sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-800/80">
                <div className="flex items-center gap-2">
                    <span className="w-1.5 sm:w-2 h-5 sm:h-6 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full inline-block"></span>
                    <h2 className="text-lg sm:text-2xl font-bold text-white tracking-wide flex items-center gap-2">
                        {actorIdParam ? (
                            <>
                                <FaUser className="text-orange-400 text-base" />
                                <span>Cast: {actorNameParam}</span>
                            </>
                        ) : isSingleCategory ? (
                            <>
                                <span>{activeCategoryObj.title}</span>
                                <span className="text-sm">{activeCategoryObj.icon}</span>
                            </>
                        ) : (
                            <span>Trending Cinema</span>
                        )}
                    </h2>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none no-scrollbar">
                    <button
                        onClick={() => setSearchParams({})}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                            !isSingleCategory
                                ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md shadow-orange-600/30 ring-1 ring-orange-400/50 scale-105"
                                : "bg-[#141721] text-gray-300 hover:bg-gray-800 hover:text-white border border-gray-800"
                        }`}
                    >
                        <span>All Sections</span>
                    </button>

                    {CATEGORIES.map((cat) => {
                        const isActive = categoryParam === cat.id && !actorIdParam;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => handleCategorySelect(cat.id)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                                    isActive
                                        ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md shadow-orange-600/30 ring-1 ring-orange-400/50 scale-105"
                                        : "bg-[#141721] text-gray-300 hover:bg-gray-800 hover:text-white border border-gray-800"
                                }`}
                            >
                                <span className="text-[11px]">{cat.icon}</span>
                                <span>{cat.title}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {loading ? (
                <div className="min-h-[50vh] flex flex-col items-center justify-center">
                    <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                    <p className="text-gray-400 text-xs sm:text-sm">Loading cinema content...</p>
                </div>
            ) : isSingleCategory ? (
                /* Single Filtered Category or Actor View with Clean Header & Pagination */
                <div className="space-y-8">
                    {/* Header Breadcrumb & Results Count */}
                    <div className="flex flex-wrap items-center justify-between gap-3 bg-[#11131a] p-4 rounded-2xl border border-gray-800/80">
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-300">
                            <Link to="/" className="text-orange-400 hover:underline">
                                Home
                            </Link>
                            <span className="text-gray-600">/</span>
                            <span className="text-white font-bold">
                                {actorIdParam ? `Cast: ${actorNameParam}` : activeCategoryObj.title}
                            </span>
                        </div>
                        
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                            <span>Page {currentPage} of {totalPages}</span>
                            {totalResults > 0 && (
                                <span className="bg-gray-800 px-2.5 py-1 rounded-md text-gray-300">
                                    {totalResults.toLocaleString()} items
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Movies Grid */}
                    <div className="w-full grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-x-2 sm:gap-x-4 md:gap-x-5 gap-y-5 sm:gap-y-7 md:gap-y-9">
                        <Card movies={filteredItems} />
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 pt-6 border-t border-gray-800/80">
                            {/* Prev Page Button */}
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage <= 1}
                                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                                    currentPage <= 1
                                        ? 'bg-gray-900/50 text-gray-600 cursor-not-allowed border border-gray-900'
                                        : 'bg-[#141721] text-gray-300 hover:bg-orange-600 hover:text-white border border-gray-800 shadow'
                                }`}
                            >
                                <FaChevronLeft className="text-[10px]" />
                                <span>Prev</span>
                            </button>

                            {/* Page Numbers */}
                            <div className="flex items-center gap-1.5">
                                {getPageNumbers().map((pageNum) => (
                                    <button
                                        key={pageNum}
                                        onClick={() => handlePageChange(pageNum)}
                                        className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                                            currentPage === pageNum
                                                ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-600/30 scale-105 ring-1 ring-orange-400/50'
                                                : 'bg-[#141721] text-gray-300 hover:bg-gray-800 hover:text-white border border-gray-800'
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                ))}
                            </div>

                            {/* Next Page Button */}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage >= totalPages}
                                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                                    currentPage >= totalPages
                                        ? 'bg-gray-900/50 text-gray-600 cursor-not-allowed border border-gray-900'
                                        : 'bg-[#141721] text-gray-300 hover:bg-orange-600 hover:text-white border border-gray-800 shadow'
                                }`}
                            >
                                <span>Next</span>
                                <FaChevronRight className="text-[10px]" />
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                /* Multi-Section Homepage: 21 TV Series + 21 Movies + 21 Animation */
                <div className="space-y-12">
                    
                    {/* Section 1: 21 TV Series */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-gray-800/60">
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 sm:w-2 h-5 sm:h-6 bg-blue-500 rounded-full inline-block"></span>
                                <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide flex items-center gap-2">
                                    <FaTv className="text-blue-400 text-base" />
                                    <span>TV Series</span>
                                </h2>
                            </div>
                            <Link
                                to="/?cat=tv"
                                className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#141721] hover:bg-blue-600 text-gray-300 hover:text-white text-xs font-semibold border border-gray-800/80 transition-all shadow-sm"
                            >
                                <span>View all</span>
                                <FaArrowRight className="text-[10px] group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                        </div>

                        <div className="w-full grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-x-2 sm:gap-x-4 md:gap-x-5 gap-y-5 sm:gap-y-7 md:gap-y-9">
                            <Card movies={tvSeries} />
                        </div>
                    </section>

                    {/* Section 2: 21 Popular Movies */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-gray-800/60">
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 sm:w-2 h-5 sm:h-6 bg-orange-500 rounded-full inline-block"></span>
                                <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide flex items-center gap-2">
                                    <FaFilm className="text-amber-400 text-base" />
                                    <span>Popular Movies</span>
                                </h2>
                            </div>
                            <Link
                                to="/?cat=movies"
                                className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#141721] hover:bg-orange-600 text-gray-300 hover:text-white text-xs font-semibold border border-gray-800/80 transition-all shadow-sm"
                            >
                                <span>View all</span>
                                <FaArrowRight className="text-[10px] group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                        </div>

                        <div className="w-full grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-x-2 sm:gap-x-4 md:gap-x-5 gap-y-5 sm:gap-y-7 md:gap-y-9">
                            <Card movies={moviesList} />
                        </div>
                    </section>

                    {/* Section 3: 21 Animation */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-gray-800/60">
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 sm:w-2 h-5 sm:h-6 bg-pink-500 rounded-full inline-block"></span>
                                <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide flex items-center gap-2">
                                    <FaPalette className="text-pink-400 text-base" />
                                    <span>Animation</span>
                                </h2>
                            </div>
                            <Link
                                to="/?cat=animation"
                                className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#141721] hover:bg-pink-600 text-gray-300 hover:text-white text-xs font-semibold border border-gray-800/80 transition-all shadow-sm"
                            >
                                <span>View all</span>
                                <FaArrowRight className="text-[10px] group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                        </div>

                        <div className="w-full grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-x-2 sm:gap-x-4 md:gap-x-5 gap-y-5 sm:gap-y-7 md:gap-y-9">
                            <Card movies={animations} />
                        </div>
                    </section>
                </div>
            )}
        </main>
    );
};

export default CardList;