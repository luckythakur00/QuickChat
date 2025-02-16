import React, { useEffect, useState } from 'react'
import { Sidebar, Users, X } from 'lucide-react'
import sideImg from '../assets/profilePic.webp'
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';

function SideBar() {
    const { getUsers, users, setSelectedUser, selectedUser } = useChatStore();
    const { onlineUsers, darkMode, setSideBar, sideBar } = useAuthStore();
    const [showOnlineOnly, setShowOnlineOnly] = useState(false);

    useEffect(() => {
        getUsers();
    }, [getUsers])

    const filteredUsers = showOnlineOnly ? users.filter(val => onlineUsers.includes(val._id)) : users

    return (
        <div className={`h-full w-full ${darkMode ? 'bg-[#141414]' : 'bg-[#e8e8e8] '}`} >
            {
                sideBar ?
                    <div className={`h-[15%] md:h-[10%] lg:h-[13%] overflow-hidden py-4 px-6 rounded-lg relative ${darkMode ? 'shadow-sm shadow-gray-700' : 'shadow-md shadow-black/20'}`} >
                        <button onClick={() => setSideBar()} className='absolute right-2 md:invisible'>
                            <X className='size-5 font-bold' />
                        </button>
                        <button onClick={() => setSideBar()} className='flex gap-2' >
                            <Users />
                            <h1 className='text-lg font-semibold' >Contacts</h1>
                        </button>
                        <div className='flex gap-1 justify-start items-start' >
                            <input type="checkbox" checked={showOnlineOnly} onChange={(e) => setShowOnlineOnly(e.target.checked)} className='cursor-pointer mt-1' />
                            <div className='flex flex-col justify-start items-start' >
                                <h1 className='text-sm opacity-80' >Show online only</h1>
                                <h1 className='text-xs font-bold text-gray-400'>{`(${onlineUsers?.length - 1} Online)`}</h1>
                            </div>
                        </div>
                    </div> :
                    <div className={`h-[10%] md:h-[6%] lg:h-[8%] py-4 px-6 rounded-lg relative z-20 ${darkMode ? 'shadow-sm shadow-gray-700' : 'shadow-md shadow-black/20'}`} >
                        <button onClick={() => setSideBar()}>
                            <Sidebar />
                        </button>
                    </div>
            }

            {/* All Users */}
            {
                sideBar ?
                    <div className='h-[85%] md:h-[90%] lg:h-[87%] w-full' >
                        <div className='h-full w-full overflow-y-scroll' >
                            {
                                filteredUsers.length > 0 && filteredUsers.map(value => (
                                    <div onClick={() => setSelectedUser(value)} key={value._id} className={`px-[10%] ${selectedUser?._id === value._id ? darkMode ? 'bg-[#2a2a2a] rounded-sm' : 'bg-[#b1b1b1] rounded' : ''} h-14 px-2 flex justify-start items-center cursor-pointer`} >
                                        <div className='relative' >
                                            <img src={value.profilePic || sideImg} className='h-10 w-10 mr-3 rounded-full bg-gray-400 object-cover' />
                                            {
                                                onlineUsers?.includes(value._id) && <div className='size-3 absolute bottom-0 right-3 bg-green-600 rounded-full' ></div>
                                            }
                                        </div>
                                        <div>
                                            <h1 className='font-semibold' >{value.fullName}</h1>
                                            <h1 className='text-xs opacity-40 font-semibold' >{onlineUsers?.includes(value._id) ? 'Online' : 'Offline'}</h1>
                                        </div>
                                    </div>
                                ))
                            }
                            {
                                filteredUsers.length === 0 && <h1 className='text-sm opacity-60 mt-4 text-center italic ' >No users online</h1>
                            }
                        </div>
                    </div> :
                    <div className='h-[90%] md:h-[94%] lg:h-[92%] w-full' >
                        <div className='h-full w-full overflow-y-scroll' >
                            {
                                filteredUsers.length > 0 && filteredUsers.map(value => (
                                    <div onClick={() => setSelectedUser(value)} key={value._id} className={` ${selectedUser?._id === value._id ? darkMode ? 'bg-[#2a2a2a] rounded-sm' : 'bg-[#b1b1b1] rounded' : ''} h-12 flex justify-start items-center cursor-pointer`} >
                                        <div className='m-auto relative' >
                                            <img src={value.profilePic || sideImg} className='h-10 w-10 m-auto rounded-full bg-gray-400 object-cover' />
                                            {
                                                onlineUsers?.includes(value._id) && <div className='size-3 absolute bottom-0 right-0 bg-green-600 rounded-full' ></div>
                                            }
                                        </div>
                                    </div>
                                ))
                            }
                            {
                                filteredUsers.length === 0 && <h1 className='text-sm opacity-60 mt-4 text-center italic ' >No users online</h1>
                            }
                        </div>
                    </div>
            }
        </div>
    )
}

export default SideBar