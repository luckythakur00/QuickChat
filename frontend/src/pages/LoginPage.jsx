import { Eye, EyeOff, LockKeyhole, Mail, MessageSquare } from 'lucide-react'
import React, { useState } from 'react'
import bgImg from '../assets/sideImage.png'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore.js'

function LoginPage() {
  const [userData, setuserData] = useState({
    email: "",
    password: ""
  })
  const [showPassword, setShowPassword] = useState(false);
  const { logInUser, darkMode, authUser } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("authUser:", authUser);
    logInUser(userData);
  }

  return (
    <div className='h-full lg:flex' >
      {/* Left Side */}
      <div className='h-[50%] lg:h-full w-full lg:w-1/2 flex flex-col justify-center items-center gap-4 mt-4 sm:my-10 lg:my-20' >
        <div className='flex flex-col justify-center items-center' >
          <div className={`h-10 w-10 rounded-md flex justify-center items-center ${darkMode ? 'bg-[#1B1B1B] text-white' : 'bg-white'}`} >
            <MessageSquare className='size-6 animate-pulse' />
          </div>
          <h1 className='text-xl sm:text-2xl font-bold py-1 ' >Welcome Back</h1>
          <p className='text-sm opacity-80'>Log In to your account</p>
        </div>

        <form onSubmit={handleLogin} method='post' className='w-[90%] sm:w-full sm:flex flex-col justify-center items-center text-base sm:text-lg'>
          {/* email */}
          <div className='my-2' >
            <h1 className='font-semibold'>Email</h1>
            <div className={`h-11 w-full sm:w-96 flex justify-start rounded-md overflow-hidden ${darkMode ? 'bg-[#141414] shadow-sm shadow-green-400' : 'bg-[#ececec] shadow-md shadow-purple-400'}`} >
              <div className='mx-1.5 flex justify-center items-center' >
                <Mail className='size-5' />
              </div>
              <input type="email" placeholder='Enter Email' value={userData.email} onChange={(e) => setuserData({ ...userData, email: e.target.value })} className='w-full pl-1 bg-transparent border-none outline-none' />
            </div>
          </div>
          {/* password */}
          <div className='my-2' >
            <h1 className='font-semibold'>Password</h1>
            <div className={`h-11 w-full sm:w-96 flex justify-start rounded-md overflow-hidden ${darkMode ? 'bg-[#141414] shadow-sm shadow-green-400' : 'bg-[#ececec] shadow-md shadow-purple-400'}`} >
              <div className='mx-1.5 flex justify-center items-center' >
                <LockKeyhole className='size-5' />
              </div>
              <div className='w-full flex ' >
                <input type={showPassword ? "text" : "password"} placeholder='Enter Password' value={userData.password} onChange={(e) => setuserData({ ...userData, password: e.target.value })} className='w-full pl-1 bg-transparent border-none outline-none' />
                <button type='button' onClick={() => setShowPassword(!showPassword)} className='mx-2'> {showPassword ? <EyeOff /> : <Eye />} </button>
              </div>
            </div>
          </div>

          <button type='submit' className={`h-10 w-full sm:w-96 mt-2 rounded-md font-bold text-lg text-black ${darkMode ? 'bg-green-600 shadow-sm shadow-white/50' : 'bg-purple-600 shadow-md shadow-purple-500'}`} >Log In</button>
        </form>

        <h1 className='text-center font-semibold '>Don't have an accout? <Link to={"/signup"} className={`${darkMode ? 'text-green-400 font-bold' : 'text-purple-700 text-lg font-semibold'}`} >Create Account</Link></h1>
      </div>


      {/* Right Side */}
      <div className='h-0 sm:h-[50%] w-full lg:w-1/2 mt-0 lg:mt-28 flex justify-center items-center invisible sm:visible '>
        <img src={bgImg} alt="" className=' bg-inherit' />
      </div>

    </div>
  )
}

export default LoginPage