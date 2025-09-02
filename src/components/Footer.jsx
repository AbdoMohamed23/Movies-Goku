import React from 'react'
import { Link } from 'react-router-dom'
import { FaFolder } from 'react-icons/fa';
import { PiCloverBold } from 'react-icons/pi';
import Logo from '../assets/logo.png';

const Footer = () => {
    return (
        <footer className="py-12 bg-[#111317] text-white w-full mx-auto">
            <div className='hidden md:flex gap-10 justify-between'>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-10 text-start pb-7 px-10'>
                    <div>
                        <h3 className='text-H1 text-lg mb-4'>About us</h3>
                        <div className='flex gap-5'>
                            <ul className='flex flex-col text-sm gap-4 text-white'>
                                <li><Link to={`/`}>Home</Link></li>
                                <li><Link to={`/`}>Genre</Link></li>
                                <li><Link to={`/`}>Country</Link></li>
                            </ul>
                            <ul className='flex flex-col text-sm gap-4 text-white'>
                                <li><Link to={`/`}>Movies</Link></li>
                                <li><Link to={`/`}>TV Series</Link></li>
                                <li><Link to={`/`}>Top IMDb</Link></li>
                            </ul>
                        </div>
                    </div>{/* link-1 */}
                    <div>
                        <h3 className='text-H1 text-lg mb-4'>Genre</h3>
                        <div className='flex gap-5'>
                            <ul className='flex flex-col text-sm gap-4 text-white'>
                                <li><Link className='flex gap-2 items-center hover:text-orange-600' to={`/`}><FaFolder className='text-orange-600' />Action</Link></li>
                                <li><Link className='flex gap-2 items-center hover:text-orange-600' to={`/`}><FaFolder className='text-orange-600' />Comedy</Link></li>
                                <li><Link className='flex gap-2 items-center hover:text-orange-600' to={`/`}><FaFolder className='text-orange-600' />Drama</Link></li>
                            </ul>
                            <ul className='flex flex-col text-sm gap-4 text-white'>
                                <li><Link className='flex gap-2 items-center hover:text-orange-600' to={`/`}><FaFolder className='text-orange-600' />Horror</Link></li>
                                <li><Link className='flex gap-2 items-center hover:text-orange-600' to={`/`}><FaFolder className='text-orange-600' />Fantasy</Link></li>
                                <li><Link className='flex gap-2 items-center hover:text-orange-600' to={`/`}><FaFolder className='text-orange-600' />Mystery</Link></li>
                            </ul>
                        </div>
                    </div>{/* link-2 */}
                    <div>
                        <h3 className='text-H1 text-lg mb-4'>Contact us</h3>
                        <div className='flex gap-5'>
                            <ul className='flex flex-col text-sm gap-2 text-gray-400'>
                                <li className='bg-white rounded-full w-full px-4 py-2 hover:bg-orange-600'><Link className='flex gap-2 items-center' to={`/`}>Join Group Telegram</Link></li>
                                <li className='bg-white rounded-full w-full px-4 py-2 hover:bg-orange-600'><Link className='flex gap-2 items-center' to={`/`}>Join Group Reddit</Link></li>
                                <li className='bg-white rounded-full w-full px-4 py-2 hover:bg-orange-600'><Link className='flex gap-2 items-center' to={`/`}>Join Twitter</Link></li>
                            </ul>
                        </div>
                    </div>{/* link-3 */}
                </div>{/* link */}

                <div className='pb-6 px-10'>
                    <Link to="/"><img src={Logo} className="w-28" alt='...' /></Link>
                </div>{/* logo */}

            </div>{/* flex / logo,link */}



            {/* mobile */}



            <div className='flex gap-10 justify-between md:hidden'>

                <div className='grid grid-cols-2 gap-10 text-start pb-7 px-10'>


                    <div className='px-5 col-span-2'>
                        <Link to="/"><img src={Logo} className="w-28 " alt='movies' /></Link>
                    </div>{/* logo */}

                    <div className='col-span-1 w-full'>
                        <h3 className='text-H1 text-lg mb-4'>About us</h3>
                        <div className='flex gap-5'>
                            <ul className='flex flex-col text-sm gap-4 text-white w-full'>
                                <li><Link to={`/`}>Home</Link></li>
                                <li><Link to={`/`}>Genre</Link></li>
                                <li><Link to={`/`}>Country</Link></li>
                            </ul>
                            <ul className='flex flex-col text-sm gap-4 text-white w-full'>
                                <li><Link to={`/`}>Movies</Link></li>
                                <li><Link to={`/`}>TV Series</Link></li>
                                <li><Link to={`/`}>Top IMDb</Link></li>
                            </ul>
                        </div>
                    </div>{/* link-1 */}
                    <div className='col-span-1 w-full'>
                        <h3 className='text-H1 text-lg mb-4'>Contact us</h3>
                        <div className='flex gap-5 w-full'>
                            <ul className='flex flex-col text-sm gap-2 text-gray-400 w-full'>
                                <li className='bg-white rounded-full w-full px-4 py-2 hover:bg-orange-600'><Link className='flex gap-2 items-center' to={`/`}>Join Group Telegram</Link></li>
                                <li className='bg-white rounded-full w-full px-4 py-2 hover:bg-orange-600'><Link className='flex gap-2 items-center' to={`/`}>Join Group Reddit</Link></li>
                                <li className='bg-white rounded-full w-full px-4 py-2 hover:bg-orange-600'><Link className='flex gap-2 items-center' to={`/`}>Join Twitter</Link></li>
                            </ul>
                        </div>
                    </div>{/* link-2 */}
                </div>{/* link */}


            </div>{/* flex / logo,link */}

            <h4 className="px-10 text-start flex gap-2 items-center">Created by Abdelrahman Mohamed <PiCloverBold className='text-orange-600' /> </h4>
        </footer>

    )
}

export default Footer