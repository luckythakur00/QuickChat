import React from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

function ErrorPage() {
    const { darkMode } = useAuthStore();

    return (
        <div className={`flex flex-col items-center justify-center h-screen ${darkMode ? 'bg-black text-white' : 'bg-gray-100 text-gray-900'}`}>
            <h1 className="text-4xl font-bold">404</h1>
            <p className="text-lg mt-2">Oops! Page not found.</p>
            <Link to="/" className={`mt-4 px-4 py-2 ${darkMode ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-purple-500 text-white hover:bg-purple-600'} rounded-lg`}>
                Go Home
            </Link>
        </div>
    )
}

export default ErrorPage