import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Components/Navbar';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import { useAuthStore } from './store/useAuthStore.js';
import { useEffect } from 'react';
import { Loader } from 'lucide-react';
import ErrorPage from './pages/ErrorPage.jsx';

function App() {
  const { authUser, checkAuth, isCheckingAuth, darkMode } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [])

  if (isCheckingAuth && !authUser) {
    return (
      <div className='h-screen flex justify-center items-center bg-[#090909]' >
        <Loader className='size-10 animate-spin text-[#EFF6FC]' />
      </div>
    )
  }

  return (
    <div className={`h-[100dvh] w-full ${darkMode ? 'text-white bg-[#090909]' : 'bg-[#b1b1b1] text-black'} overflow-hidden`} >
      <div className='h-[7%]' >
        <Navbar />
      </div>
      <div className='h-[93%]' >
        <Routes>
          <Route path='/' element={authUser ? <HomePage /> : <Navigate to={'/login'} />} />
          <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to={'/'} />} />
          <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to={'/'} />} />
          <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to={'/login'} />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>
    </div>
  )
}

export default App