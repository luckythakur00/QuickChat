import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react'
import React, { useState } from 'react'
import bgImg from '../assets/sideImage.png'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore.js'
import favicondark from '../assets/favicon.png'
import faviconlight from '../assets/faviconlight.png'

function LoginPage() {
  const [userData, setuserData] = useState({
    email: "",
    password: ""
  })
  const [showPassword, setShowPassword] = useState(false);
  const { logInUser, darkMode } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    logInUser(userData);
  }

  return (
    <div className='h-full lg:flex' >
      {/* Left Side */}
      <div className='h-full md:h-[50%] lg:h-full w-full lg:w-1/2 pt-10 md:pt-0 flex flex-col md:justify-center items-center md:gap-4' >
        <div className='flex flex-col justify-center items-center' >
          <div className={`h-8 w-8 md:h-9 md:w-9 rounded-md flex justify-center items-center`} >
            <img src={darkMode ? favicondark : faviconlight} className='h-full w-full animate-bounce' />
          </div>
          <h1 className='text-2xl font-bold mt-1 md:py-1 ' >Welcome Back</h1>
          <p className='text-sm opacity-80'>Log In to your account</p>
        </div>

        <form onSubmit={handleLogin} method='post' className='w-[90%] sm:w-full sm:flex flex-col justify-center items-center text-base sm:text-lg'>
          {/* email */}
          <div className='my-2 text-lg md:text-base' >
            <h1 className='font-semibold'>Email</h1>
            <div className={`h-11 w-full sm:w-96 flex justify-start rounded-md overflow-hidden ${darkMode ? 'bg-[#323131] shadow-sm shadow-green-400' : 'bg-[#ececec] shadow-md shadow-black/30 md:shadow-purple-400'}`} >
              <div className='mx-1.5 flex justify-center items-center' >
                <Mail className='size-6 md:size-5' />
              </div>
              <input type="email" placeholder='Enter Email' value={userData.email} onChange={(e) => setuserData({ ...userData, email: e.target.value })} className='w-full pl-1 bg-transparent border-none outline-none' />
            </div>
          </div>
          {/* password */}
          <div className='my-2 text-lg md:text-base' >
            <h1 className='font-semibold'>Password</h1>
            <div className={`h-11 w-full sm:w-96 flex justify-start rounded-md overflow-hidden ${darkMode ? 'bg-[#323131] shadow-sm shadow-green-400' : 'bg-[#ececec] shadow-md shadow-black/30 md:shadow-purple-400'}`} >
              <div className='mx-1.5 flex justify-center items-center' >
                <LockKeyhole className='size-6 md:size-5' />
              </div>
              <div className='w-full flex ' >
                <input type={showPassword ? "text" : "password"} placeholder='Enter Password' value={userData.password} onChange={(e) => setuserData({ ...userData, password: e.target.value })} className='w-full pl-1 bg-transparent border-none outline-none' />
                <button type='button' onClick={() => setShowPassword(!showPassword)} className='mx-2'> {showPassword ? <EyeOff /> : <Eye />} </button>
              </div>
            </div>
          </div>

          <button type='submit' className={`h-11 md:h-10 w-full sm:w-96 mt-2 rounded-md font-bold text-lg text-black ${darkMode ? 'bg-green-600 hover:bg-green-700 shadow-sm shadow-white/50' : 'bg-[#945ecd] hover:bg-purple-700 shadow-black/30 md:bg-purple-600 shadow-md md:shadow-purple-500'}`} >Log In</button>
        </form>

        <h1 className='text-center font-semibold pt-2 md:pt-0'>Don't have an accout? <Link to={"/signup"} className={`${darkMode ? 'text-green-400 font-bold' : 'text-purple-500 md:text-purple-700 text-lg font-semibold'}`} >Create Account</Link></h1>
      </div>


      {/* Right Side */}
      <div className='h-0 md:h-[50%] lg:h-full w-full lg:w-1/2 flex justify-center items-center invisible sm:visible '>
        <img src={bgImg} alt="" className=' bg-inherit' />
      </div>

    </div>
  )
}

export default LoginPage