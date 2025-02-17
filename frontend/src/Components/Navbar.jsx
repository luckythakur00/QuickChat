import React from 'react'
import { LogOut, MessageSquare, Moon, Sun, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore.js';

function Navbar() {
    const { authUser, logOutUser, setDarkMode, darkMode, sideBar } = useAuthStore();

    return (
        <div className={`${sideBar ? 'visible h-14' : ' invisible md:visible h-0 w-0 md:h-14 md:w-full'} flex justify-between relative z-50 ${darkMode ? 'text-white bg-black shadow-sm shadow-gray-700' : 'text-black shadow-md shadow-purple-800 bg-purple-600 '} rounded-bl-lg rounded-br-lg items-center px-4 sm:px-6 lg:px-8`} >
            <Link to={'/'} className='flex justify-between items-center' >
                <div className={`h-8 w-8 rounded-md flex justify-center items-center ${darkMode ? 'bg-[#1B1B1B]' : 'bg-white text-black shadow-md shadow-gray-700'}`} >
                    <MessageSquare className='h-5 animate-pulse' />
                </div>
                <h1 className={`ml-2 font-serif text-xl`}>QuickChat</h1>
            </Link>

            <div className={`w-full flex justify-end items-center`} >
                <button onClick={setDarkMode} className='px-1 sm:px-2 mr-0 sm:mr-4 flex justify-start items-center cursor-pointer' >
                    <div className={`h-8 w-8 rounded-md flex justify-center items-center bg-[#1B1B1B] ${darkMode ? '' : 'bg-white text-black shadow-md shadow-gray-700'}  `} >
                        {
                            darkMode ? <Sun className='h-5' /> : <Moon className='h-5' />
                        }
                    </div>
                    <h1 className='text-base font-semibold ml-2 hidden sm:block'>{darkMode ? 'Light Mode' : 'Dark Mode'}</h1>
                </button>
                {
                    authUser && (
                        <>
                            <Link to={"/profile"} className='px-1 sm:px-2 mr-0 sm:mr-4 flex justify-start items-center cursor-pointer' >
                                <div className={`h-8 w-8 rounded-md flex justify-center items-center bg-[#1B1B1B] ${darkMode ? '' : 'bg-white text-black shadow-md shadow-gray-700'}  `} >
                                    <User className='h-5' />
                                </div>
                                <h1 className='text-base font-semibold ml-2 hidden sm:block'>Profile</h1>
                            </Link>

                            <button onClick={() => logOutUser()} className='px-1 sm:px-2 flex justify-start items-center cursor-pointer' >
                                <div className={`h-8 w-8 rounded-md flex justify-center items-center bg-[#1B1B1B] ${darkMode ? '' : 'bg-white text-black shadow-md shadow-gray-700'}  `} >
                                    <LogOut className='h-5' />
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