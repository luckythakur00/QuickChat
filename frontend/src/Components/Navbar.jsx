import React from 'react'
import { LogOut, MessageSquare, Moon, Sun, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore.js';
import favicondark from '../assets/favicon.png'
import faviconlight from '../assets/faviconlight.png'

function Navbar() {
    const { authUser, logOutUser, setDarkMode, darkMode } = useAuthStore();

    return (
        <div className={`h-full w-full flex justify-between relative z-50  ${darkMode ? 'text-white bg-black shadow-sm shadow-gray-700' : 'text-black shadow-md shadow-black/40 bg-[#945ecd] md:shadow-purple-800 md:bg-purple-600 '} rounded-bl-lg rounded-br-lg items-center px-4 sm:px-6 lg:px-8`} >
            <Link to={'/'} className='flex justify-between items-center' >
                <div className={`h-8 w-8 md:h-9 md:w-9 ${darkMode ? '' : 'bg-white'} p-1 rounded-md flex justify-center items-center`} >
                    <img src={darkMode ? favicondark : faviconlight} className='h-full w-full' />
                </div>
                <h1 className={` ${darkMode ? 'md:ml-1' : 'ml-1 md:ml-2 text-lg'} font-serif md:text-xl`}>QuickChat</h1>
            </Link>

            <div className={`w-full flex justify-end items-center`} >
                <button onClick={setDarkMode} className='px-1 sm:px-2 mr-0 sm:mr-4 flex justify-start items-center cursor-pointer' >
                    <div className={`p-1.5 rounded-md flex justify-center items-center bg-[#1B1B1B] ${darkMode ? '' : 'bg-white text-black shadow-md shadow-gray-700'}  `} >
                        {
                            darkMode ? <Sun className='size-4 md:size-5' /> : <Moon className='size-4 md:size-5' />
                        }
                    </div>
                    <h1 className='text-base font-semibold ml-2 hidden sm:block'>{darkMode ? 'Light Mode' : 'Dark Mode'}</h1>
                </button>
                {
                    authUser && (
                        <>
                            <Link to={"/profile"} className='px-1 sm:px-2 mr-0 sm:mr-4 flex justify-start items-center cursor-pointer' >
                                <div className={`p-1.5 rounded-md flex justify-center items-center bg-[#1B1B1B] ${darkMode ? '' : 'bg-white text-black shadow-md shadow-gray-700'}  `} >
                                    <User className='size-4 md:size-5' />
                                </div>
                                <h1 className='text-base font-semibold ml-2 hidden sm:block'>Profile</h1>
                            </Link>

                            <button onClick={() => logOutUser()} className='px-1 sm:px-2 flex justify-start items-center cursor-pointer' >
                                <div className={`p-1.5 rounded-md flex justify-center items-center bg-[#1B1B1B] ${darkMode ? '' : 'bg-white text-black shadow-md shadow-gray-700'}  `} >
                                    <LogOut className='size-4 md:size-5' />
                                </div>
                                <h1 className='text-base font-semibold ml-2 hidden sm:block'>Logout</h1>
                            </button>
                        </>
                    )
                }
            </div>
        </div>
    )
}

export default Navbar