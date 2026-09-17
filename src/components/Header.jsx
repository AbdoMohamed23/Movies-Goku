import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    FaSearch, 
    FaBars, 
    FaTimes, 
    FaFilm, 
    FaFire, 
    FaStar, 
    FaTv,
    FaBolt, 
    FaRocket, 
    FaPalette, 
    FaSmile, 
    FaGhost, 
    FaMagic, 
    FaMask,
    FaLanguage
} from 'react-icons/fa';

const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    // Close mobile drawer when route/query changes
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location]);

    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [mobileMenuOpen]);

    const allCategories = [
        { name: 'Home', path: '/', icon: <FaFilm className="text-orange-400" /> },
        { name: 'Movies', path: '/?cat=movies', icon: <FaFilm className="text-amber-400" /> },
        { name: 'TV Series', path: '/?cat=tv', icon: <FaTv className="text-blue-400" /> },
        { name: 'Dubbed', path: '/?cat=dubbed', icon: <FaLanguage className="text-emerald-400" /> },
        { name: 'Animation', path: '/?cat=animation', icon: <FaPalette className="text-pink-400" /> },
        { name: 'Popular', path: '/?cat=popular', icon: <FaFire className="text-orange-500" /> },
        { name: 'Top Rated', path: '/?cat=top_rated', icon: <FaStar className="text-yellow-400" /> },
        { name: 'Action', path: '/?cat=action', icon: <FaBolt className="text-red-400" /> },
        { name: 'Sci-Fi', path: '/?cat=sci-fi', icon: <FaRocket className="text-cyan-400" /> },
        { name: 'Comedy', path: '/?cat=comedy', icon: <FaSmile className="text-amber-400" /> },
        { name: 'Horror', path: '/?cat=horror', icon: <FaGhost className="text-purple-400" /> },
        { name: 'Fantasy', path: '/?cat=fantasy', icon: <FaMagic className="text-indigo-400" /> },
        { name: 'Drama', path: '/?cat=drama', icon: <FaMask className="text-blue-400" /> },
    ];

    // Primary desktop links
    const desktopLinks = allCategories.slice(0, 6);

    return (
        <>
            <header className="sticky top-0 z-40 bg-[#111317]/95 backdrop-blur-md border-b border-gray-800/80 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        
                        {/* Logo ĀPEX without the icon box, with permanent vibrant gradient */}
                        <div className="flex items-center gap-8">
                            <Link to="/" className="flex flex-col group cursor-pointer">
                                <span className="text-2xl sm:text-3xl font-black tracking-widest bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(249,115,22,0.3)]">
                                    ĀPEX
                                </span>
                                <span className="text-[9px] text-gray-400 font-semibold tracking-widest uppercase -mt-1">
                                    Movies & Cinema
                                </span>
                            </Link>

                            {/* Desktop Navigation */}
                            <nav className="hidden xl:flex items-center gap-1">
                                {desktopLinks.map((link) => {
                                    const isActive = location.pathname + location.search === link.path;
                                    return (
                                        <Link
                                            key={link.name}
                                            to={link.path}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                                isActive
                                                    ? 'bg-orange-600/20 text-orange-400 font-semibold border border-orange-500/30'
                                                    : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
                                            }`}
                                        >
                                            {link.icon}
                                            <span>{link.name}</span>
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* Right Actions: Search + Mobile Menu Button */}
                        <div className="flex items-center gap-2.5">
                            <Link
                                to="/search"
                                className="p-2.5 rounded-xl bg-gray-800 text-gray-200 hover:text-white hover:bg-gray-700 border border-gray-700/80 flex items-center justify-center transition-colors shadow-sm"
                                title="Search movies"
                                aria-label="Search movies"
                            >
                                <FaSearch className="text-lg text-orange-400 hover:text-white" />
                            </Link>

                            {/* Mobile Hamburger Button */}
                            <button
                                onClick={() => setMobileMenuOpen(true)}
                                className="xl:hidden p-2.5 rounded-xl bg-gray-800 text-gray-200 hover:text-white hover:bg-gray-700 border border-gray-700/80 focus:outline-none transition-colors"
                                aria-label="Open mobile menu"
                            >
                                <FaBars className="text-lg" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Smooth Mobile Drawer from the Right */}
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/75 backdrop-blur-sm z-50 transition-opacity duration-300 ease-in-out ${
                    mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setMobileMenuOpen(false)}
            />

            {/* Drawer Content */}
            <aside
                className={`fixed top-0 right-0 h-full w-72 sm:w-80 bg-[#12141a] border-l border-gray-800/90 z-50 shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${
                    mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Drawer Header */}
                <div className="p-5 flex items-center justify-between border-b border-gray-800/80">
                    <div className="flex flex-col">
                        <span className="text-2xl font-black tracking-widest bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent">
                            ĀPEX
                        </span>
                        <span className="text-[9px] text-gray-400 font-semibold tracking-widest uppercase">
                            Menu & Categories
                        </span>
                    </div>
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="p-2 rounded-xl bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                        aria-label="Close menu"
                    >
                        <FaTimes className="text-lg" />
                    </button>
                </div>

                {/* All Menu Items with Icons */}
                <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">
                        Genres & Discovery
                    </p>
                    {allCategories.map((item) => {
                        const isActive = location.pathname + location.search === item.path;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                                    isActive
                                        ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold shadow-md shadow-orange-600/20'
                                        : 'text-gray-300 hover:bg-gray-800/80 hover:text-white'
                                }`}
                            >
                                <span className="text-base flex-shrink-0">{item.icon}</span>
                                <span className="flex-1">{item.name}</span>
                            </Link>
                        );
                    })}
                </div>

                {/* Drawer Footer Credit */}
                <div className="p-4 border-t border-gray-800/80 bg-[#0e1014] text-center text-xs text-gray-500">
                    <span>ĀPEX Movies © 2026</span>
                </div>
            </aside>
        </>
    );
};

export default Header;