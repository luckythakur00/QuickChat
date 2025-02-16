import React, { useRef, useState } from 'react'
import defaultImage from '../assets/profilePic.webp';
import { ArrowLeft, Camera, Mail, User } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore.js'
import { Link } from 'react-router-dom';

function ProfilePage() {
  const { authUser, isUpdatingProfile, updateProfile, darkMode } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const fileRef = useRef();

  const handleClick = () => {
    fileRef.current.click();
  }

  const handleOnChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    }
  }

  const timeStamp = authUser.createdAt;
  const time = new Date(timeStamp);
  const userCreateAt = `${time.getDate()}-${time.getMonth() + 1}-${time.getFullYear()} `

  return (
    <div className={`w-full sm:max-w-[70%] md:max-w-[50%] lg:w-1/3 m-auto relative text-center rounded-md mt-5 sm:mt-10 p-4 ${darkMode ? 'bg-[#202020] shadow-md shadow-white/20' : 'bg-white shadow-md shadow-gray-500'}`}>

      <div>
        <Link to={'/'} className=' absolute left-5 top-5' >
          <ArrowLeft />
        </Link>
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-sm pt-1">Your profile information</p>

        {/* Profile Image */}
        <div className="h-32 w-32 m-auto mt-4 relative rounded-full">
          <img src={selectedImg || authUser?.profilePic || defaultImage} className="h-full w-full border-2 border-white rounded-full object-cover object-center" />
          <button onClick={handleClick} className={`h-10 w-10 absolute bottom-0 right-0 flex justify-center items-center rounded-full ${darkMode ? 'bg-green-600 text-black' : 'bg-purple-900 text-white'}`}>
            <Camera className={`${isUpdatingProfile ? 'animate-pulse pointer-events-none' : ''} size-6`} />
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleOnChange} disabled={isUpdatingProfile} className="hidden" />
        </div>
        <h1 className="text-sm py-2 font-semibold">{isUpdatingProfile ? 'Uploading...' : 'Click the camera icon to update your photo'}</h1>
      </div>

      {/* User Information Form */}
      <form className="w-[90%] sm:w-[80%] m-auto text-start mb-4">

        {/* Full Name */}
        <div className="my-2">
          <h1 className="font-semibold">Full Name</h1>
          <div className={`h-11 w-full flex items-center rounded-md overflow-hidden ${darkMode ? 'bg-[#161616] shadow-sm shadow-green-300' : 'bg-[#dddddd] shadow-md shadow-gray-400'}`}>
            <div className="px-3">
              <User className="size-5" />
            </div>
            <input type="text" readOnly placeholder="Full Name" value={authUser?.fullName} className="w-full bg-transparent border-none outline-none text-sm" />
          </div>
        </div>

        {/* Email */}
        <div className="my-2">
          <h1 className="font-semibold">Email</h1>
          <div className={`h-11 w-full flex items-center rounded-md overflow-hidden ${darkMode ? 'bg-[#161616] shadow-sm shadow-green-300' : 'bg-[#dddddd] shadow-md shadow-gray-400'}`}>
            <div className="px-3">
              <Mail className="size-5" />
            </div>
            <input type="email" readOnly placeholder="Email" value={authUser?.email} className="w-full bg-transparent border-none outline-none text-sm" />
          </div>
        </div>

      </form>

      {/* Account Information */}
      <div className="text-start px-6 sm:px-12 mt-10">
        <h1 className="text-lg font-semibold mb-1">Account Information</h1>

        <div className="flex justify-between border-b-2 border-white pb-0.5">
          <h1 className="text-sm font-semibold">Member Since</h1>
          <h1 className="text-sm">{userCreateAt}</h1>
        </div>

        <div className="flex justify-between mt-4 border-b-2 border-white pb-0.5">
          <h1 className="text-sm font-semibold">Account Status</h1>
          <h1 className={`${darkMode ? 'text-green-600 font-semibold' : 'text-purple-600 font-bold'}`}>Active</h1>
        </div>
      </div>

    </div>
  );
}

export default ProfilePage