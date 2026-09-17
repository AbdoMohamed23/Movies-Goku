import React from 'react';
import { Link } from 'react-router-dom';
import { 
    FaFire, 
    FaStar, 
    FaGithub, 
    FaTwitter, 
    FaTelegramPlane, 
    FaRedditAlien,
    FaHeart
} from 'react-icons/fa';

const Footer = () => {
    const genres = [
        { name: 'Action', path: '/?cat=action' },
        { name: 'Comedy', path: '/?cat=comedy' },
        { name: 'Drama', path: '/?cat=drama' },
        { name: 'Horror', path: '/?cat=horror' },
        { name: 'Fantasy', path: '/?cat=fantasy' },
        { name: 'Animation', path: '/?cat=animation' },
        { name: 'Sci-Fi', path: '/?cat=sci-fi' },
        { name: 'Mystery', path: '/?cat=mystery' },
    ];

    const quickLinks = [
        { name: 'Home', path: '/' },
        { name: 'Popular Movies', path: '/?cat=popular' },
        { name: 'Top Rated', path: '/?cat=top_rated' },
        { name: 'Now Playing', path: '/?cat=now_playing' },
        { name: 'Search', path: '/search' },
    ];

    return (
        <footer className="mt-16 bg-[#0e1014] text-gray-300 border-t border-gray-800/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    
                    {/* Brand Col */}
                    <div className="md:col-span-1 space-y-4">
                        <Link to="/" className="flex flex-col group cursor-pointer inline-block">
                            <span className="text-2xl sm:text-3xl font-black tracking-widest bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(249,115,22,0.3)]">
                                ĀPEX
                            </span>
                            <span className="text-[9px] text-gray-400 font-semibold tracking-widest uppercase -mt-1">
                                Movies & Cinema
                            </span>
                        </Link>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Your premier destination for high quality movie streams, official trailers, and trending cinema discovery.
                        </p>
                        {/* Social Buttons */}
                        <div className="flex items-center gap-2 pt-2">
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noreferrer"
                                className="w-9 h-9 rounded-lg bg-gray-800/80 hover:bg-orange-600 text-gray-300 hover:text-white flex items-center justify-center transition-all duration-200 border border-gray-700/50"
                                aria-label="GitHub"
                            >
                                <FaGithub />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noreferrer"
                                className="w-9 h-9 rounded-lg bg-gray-800/80 hover:bg-orange-600 text-gray-300 hover:text-white flex items-center justify-center transition-all duration-200 border border-gray-700/50"
                                aria-label="Twitter"
                            >
                                <FaTwitter />
                            </a>
                            <a
                                href="https://telegram.org"
                                target="_blank"
                                rel="noreferrer"
                                className="w-9 h-9 rounded-lg bg-gray-800/80 hover:bg-orange-600 text-gray-300 hover:text-white flex items-center justify-center transition-all duration-200 border border-gray-700/50"
                                aria-label="Telegram"
                            >
                                <FaTelegramPlane />
                            </a>
                            <a
                                href="https://reddit.com"
                                target="_blank"
                                rel="noreferrer"
                                className="w-9 h-9 rounded-lg bg-gray-800/80 hover:bg-orange-600 text-gray-300 hover:text-white flex items-center justify-center transition-all duration-200 border border-gray-700/50"
                                aria-label="Reddit"
                            >
                                <FaRedditAlien />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold text-base mb-4 flex items-center gap-2">
                            <FaFire className="text-orange-500 text-xs" />
                            <span>Quick Links</span>
                        </h4>
                        <ul className="space-y-2.5 text-sm">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="text-gray-400 hover:text-orange-400 hover:translate-x-1 inline-block transition-all duration-200"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Genres Column - Hidden on mobile */}
                    <div className="hidden md:block md:col-span-2">
                        <h4 className="text-white font-bold text-base mb-4 flex items-center gap-2">
                            <FaStar className="text-yellow-400 text-xs" />
                            <span>Popular Genres</span>
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {genres.map((g) => (
                                <Link
                                    key={g.name}
                                    to={g.path}
                                    className="px-3 py-2 bg-gray-900/80 hover:bg-orange-600/20 text-gray-300 hover:text-orange-400 border border-gray-800 hover:border-orange-500/40 rounded-lg text-xs font-medium text-center transition-all duration-200"
                                >
                                    {g.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Copyright & Credit Bar */}
                <div className="pt-8 border-t border-gray-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
                    <div>
                        <span>© 2026 Designed & developed by </span>
                        <a
                            href="https://apex-scale.vercel.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-orange-400 hover:text-orange-300 underline underline-offset-4 transition-colors"
                        >
                            ĀPEX
                        </a>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                        <span>Powered by TMDB & Embed Streams</span>
                        <FaHeart className="text-red-500 text-[10px] ml-1" />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;