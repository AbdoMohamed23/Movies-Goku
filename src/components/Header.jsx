import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/logo.png';
import { FaSearch } from "react-icons/fa";

const Header = () => {
    return (
        <header className="py-3 text-white">
            <div className='w-10/12 md:w-[1400px] mx-auto'>
                <div className="flex justify-between items-center">
                    <div className="flex justify-end items-center gap-4">
                        <Link to="/"><img src={Logo} className="w-28" alt='movies' /></Link>
                        <nav className='hidden md:block ps-6'>
                            <ul className='flex gap-4 text-xl text-white'>
                                <li><Link to={`/`}>Home</Link></li>
                                <li><Link to={`/`}>Genre</Link></li>
                                <li><Link to={`/`}>Country</Link></li>
                                <li><Link to={`/`}>Movies</Link></li>
                                <li><Link to={`/`}>TV Series</Link></li>
                                <li><Link to={`/`}>Top IMDb</Link></li>
                            </ul>
                        </nav>
                    </div>{/* logo */}
                    <div className='text-white'>
                        <Link to={`/search`} className="px-4 py-2 transition-colors duration-300 flex justify-between gap-2 items-center text-xl font-semibold"><FaSearch />search</Link>
                    </div>
                </div> {/* row */}
            </div>
        </header>
    )
}

export default Header