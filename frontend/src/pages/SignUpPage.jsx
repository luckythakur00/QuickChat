import { Eye, EyeOff, LockKeyhole, Mail, MessageSquare, User } from 'lucide-react'
import React, { useState } from 'react'
import sideImage from '../assets/sideImage.png'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore.js'

function SignUpPage() {
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false);
  const { signUpUser, darkMode } = useAuthStore();

  const handleCreate = async (e) => {
    e.preventDefault();
    signUpUser(userData);
  }

  return (
    <div className='h-full lg:flex' >
      {/* Left Side */}
      <div className='h-full md:h-[50%] lg:h-full w-full lg:w-1/2 pt-4 md:pt-0 flex flex-col md:justify-center items-center md:gap-4' >
        <div className='flex flex-col justify-center items-center' >
          <div className={`h-10 w-10 rounded-md flex justify-center items-center ${darkMode ? 'bg-[#1B1B1B]' : 'bg-white'}`} >
            <MessageSquare className='size-6 animate-pulse' />
          </div>
          <h1 className='text-2xl font-bold py-1' >Create Account</h1>
          <p className='text-sm opacity-80'>Get started with your free account</p>
        </div>

        <form onSubmit={handleCreate} method='post' className='w-[90%] sm:w-full sm:flex flex-col justify-center items-center text-base sm:text-lg' >
          {/* name */}
          <div className='my-2 text-base' >
            <h1 className='font-semibold '>Full Name</h1>
            <div className={`h-11 w-full sm:w-96 flex justify-start rounded-md overflow-hidden ${darkMode ? 'bg-[#323131] shadow-sm shadow-green-400' : 'bg-[#ececec] shadow-md shadow-black/30 md:shadow-purple-400'}`} >
              <div className='mx-1.5 flex justify-center items-center ' >
                <User className='size-5' />
              </div>
              <input type="text" name='fullName' placeholder='Enter Full Name' value={userData.fullName} onChange={(e) => setUserData({ ...userData, fullName: e.target.value })} className={`w-full pl-1 bg-transparent border-none outline-none`} />
            </div>
          </div>

          {/* email */}
          <div className='my-2 text-base' >
            <h1 className='font-semibold '>Email</h1>
            <div className={`h-11 w-full sm:w-96 flex justify-start rounded-md overflow-hidden ${darkMode ? 'bg-[#323131] shadow-sm shadow-green-400' : 'bg-[#ececec] shadow-md shadow-black/30 md:shadow-purple-400'}`} >
              <div className='mx-1.5 flex justify-center items-center ' >
                <Mail className='size-5' />
              </div>
              <input type="email" name='email' placeholder='Enter Email' value={userData.email} onChange={(e) => setUserData({ ...userData, email: e.target.value })} className={`w-full pl-1 bg-transparent border-none outline-none`} />
            </div>
          </div>

          {/* password */}
          <div className='my-2 text-base' >
            <h1 className='font-semibold '>Password</h1>
            <div className={`h-11 w-full sm:w-96 flex justify-start rounded-md overflow-hidden ${darkMode ? 'bg-[#323131] shadow-sm shadow-green-400' : 'bg-[#ececec] shadow-md shadow-black/30 md:shadow-purple-400'}`} >
              <div className='mx-1.5 flex justify-center items-center ' >
                <LockKeyhole className='size-5' />
              </div>
              <div className='w-full flex' >
                <input type={showPassword ? "text" : "password"} name='password' placeholder='Enter Password' value={userData.password} onChange={(e) => setUserData({ ...userData, password: e.target.value })} className='w-full pl-1 bg-transparent border-none outline-none' />
                <button onClick={() => setShowPassword(!showPassword)} type='button' className='mx-2'> {showPassword ? <EyeOff /> : <Eye />} </button>
              </div>
            </div>
          </div>

          <button type='submit' className={`h-11 md:h-10 w-full sm:w-96 mt-2 rounded-md text-black text-lg  ${darkMode ? 'bg-green-600 shadow-sm shadow-white/50' : 'bg-[#945ecd] md:bg-purple-600 font-semibold shadow-md shadow-black/30 md:shadow-purple-500'}`} >  Create Account</button>
        </form>

        <h1 className='text-center font-semibold '>Already have an Accout? <Link to={'/login'} className={`${darkMode ? 'text-green-400 font-bold' : 'text-purple-500 md:text-purple-700 font-semibold text-lg'}`} >Log In</Link></h1>
      </div>

      {/* Right Side */}
      <div className='h-0 md:h-[50%] lg:h-full w-full lg:w-1/2 flex justify-center items-center invisible sm:visible '>
        <img src={sideImage} alt="" className=' bg-inherit' />
      </div>

    </div>
  )
}

export default SignUpPage