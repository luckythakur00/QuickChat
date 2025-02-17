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

function App() {
  const { authUser, checkAuth, isCheckingAuth, darkMode } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [])

  if (isCheckingAuth && !authUser) {
    return (
      <div className='h-screen flex justify-center items-center  bg-[#090909]' >
        <Loader className='size-10 animate-spin text-[#EFF6FC]' />
      </div>
    )
  }

  // TODO:-
  // 1. from setting change the background image of the chat. That will look good.
  // 2. Add light and dark mode along with setting button on the navbar. ✅
  // 3. Also you should be able to create a group. (If possible then check it out)
  // 4. Do something about update profile button in "profile.jsx". ✅ (I just removed that button)
  // 5. In chatContainer, where the logo and the video call section are, that cotainer is getting big and its hiding some part of main chat box, so check it out. (This is happening in mideam size screen like tablet). ✅
  // 6. While user login, if user type wrong password accidently he is not able to login again until he refresh the page. Check it out and fix it. ✅
  // 7. When user login and open a chat all the messages are getting on a single side (left side) until he refresh the page. ✅
  // 7. When a new user login he is able to see all the online usrs, but all the other previous users are not able to see him online until the new user refresh his page.✅
  // 8. Save the theme in localStorage so that it doesn't get remove while refreshing the page.✅

  // lucky@example.com
  // lucky00example
  // user@example.com
  // user00example.com
  // user2@example.com
  // user200example.com


  // MERN Chat App
  // 2:31:20 = start the theme sectoin. Basically the setting option part.

  return (
    <div className={`min-h-screen w-full ${darkMode ? 'text-white bg-[#090909]' : 'bg-[#b1b1b1] text-black'} overflow-hidden`} >
      <Navbar />
      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to={'/login'} />} />
        <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to={'/'} />} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to={'/'} />} />
        <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to={'/login'} />} />
      </Routes>
    </div>
  )
}

export default App