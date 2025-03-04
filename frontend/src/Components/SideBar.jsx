import React, { useEffect, useState } from 'react'
import { CircleFadingPlus, Sidebar, Users, X } from 'lucide-react'
import defaultUserImage from '../assets/profilePic.webp'
import groupImg from '../assets/groupAvatar.jpg'
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import { useGroupStore } from '../store/useGroupStore';
import CreateGroup from './CreateGroup';

function SideBar() {
    const { getUsers, users, setSelectedUser, selectedUser } = useChatStore();
    const { onlineUsers, darkMode, setSideBar, sideBar, socket, authUser } = useAuthStore();
    const { groups } = useGroupStore();
    const [showOnlineOnly, setShowOnlineOnly] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        getUsers();
    }, [getUsers])

    useEffect(() => {
        if (selectedUser?._id) {
            socket.emit("joinGroup", selectedUser._id);
        }
    }, [selectedUser]);

    const filteredUsers = showOnlineOnly ? users.filter(val => onlineUsers.includes(val._id)) : users
    const filteredGroups = groups?.length > 0 && groups?.filter(group => group.members?.some(member => member._id === authUser._id))

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
                                <h1 className='text-xs font-bold text-gray-400'>{`(${onlineUsers?.length > 0 ? onlineUsers.length - 1 : 0} Online)`}</h1>
                            </div>
                        </div>
                    </div> :
                    <div className={`h-[10%] md:h-[6%] lg:h-[8%] py-4 px-6 rounded-lg relative z-20 ${darkMode ? 'shadow-sm shadow-gray-700' : 'shadow-md shadow-black/20'}`} >
                        <button onClick={() => setSideBar()}>
                            <Sidebar />
                        </button>
                    </div>
            }

            {/* All Users and groups */}
            {
                sideBar ?
                    <div className='h-[85%] md:h-[90%] lg:h-[87%] w-full' >
                        <div className='h-full w-full overflow-y-scroll' >
                            {
                                filteredGroups?.length > 0 && filteredGroups.map(value => (
                                    <div key={value._id} onClick={() => setSelectedUser(value)} className={`px-[10%] ${selectedUser?._id === value._id ? darkMode ? 'bg-[#2a2a2a] rounded-sm' : 'bg-[#b1b1b1] rounded' : ''} h-14 px-2 flex justify-start items-center cursor-pointer`} >
                                        <div className='flex justify-center items-center' >
                                            <img src={groupImg} className='h-11 w-11 md:h-10 md:w-10 mr-3 rounded-full bg-gray-400 object-cover' />
                                            <h1 className='font-semibold' >{value.groupName.length > 15 ? value.groupName.slice(0, 15) + '...' : value.groupName}</h1>
                                        </div>
                                    </div>
                                ))
                            }
                            {
                                filteredUsers.length > 0 && filteredUsers.map(value => (
                                    <div key={value._id} onClick={() => setSelectedUser(value)} className={`px-[10%] ${selectedUser?._id === value._id ? darkMode ? 'bg-[#2a2a2a] rounded-sm' : 'bg-[#b1b1b1] rounded' : ''} h-14 px-2 flex justify-start items-center cursor-pointer`} >
                                        <div className='relative' >
                                            <img src={value.profilePic || defaultUserImage} className='h-11 w-11 md:h-10 md:w-10 mr-3 rounded-full bg-gray-400 object-cover' />
                                            {
                                                onlineUsers?.includes(value._id) && <div className='size-3 absolute bottom-0 right-3 bg-green-600 rounded-full' ></div>
                                            }
                                        </div>
                                        <div>
                                            <h1 className='font-semibold' >{value.fullName.length > 15 ? value.fullName.slice(0, 15) + '...' : value.fullName}</h1>
                                            <h1 className='text-xs opacity-40 font-semibold' >{onlineUsers?.includes(value._id) ? 'Online' : 'Offline'}</h1>
                                        </div>
                                    </div>
                                ))
                            }
                            {
                                filteredUsers.length === 0 && <h1 className='text-lg opacity-60 mt-4 text-center italic ' >No users online</h1>
                            }
                        </div>
                    </div> :
                    <div className='h-[90%] md:h-[94%] lg:h-[92%] w-full' >
                        <div className='h-full w-full overflow-y-scroll' >
                            {
                                filteredGroups?.length > 0 && filteredGroups.map(value => (
                                    <div onClick={() => setSelectedUser(value)} key={value._id} className={` ${selectedUser?._id === value._id ? darkMode ? 'bg-[#2a2a2a] rounded-sm' : 'bg-[#b1b1b1] rounded' : ''} h-12 flex justify-start items-center cursor-pointer`} >
                                        <img src={groupImg} className='h-10 w-10 m-auto rounded-full bg-gray-400 object-cover' />
                                    </div>
                                ))
                            }
                            {
                                filteredUsers.length > 0 && filteredUsers.map(value => (
                                    <div onClick={() => setSelectedUser(value)} key={value._id} className={` ${selectedUser?._id === value._id ? darkMode ? 'bg-[#2a2a2a] rounded-sm' : 'bg-[#b1b1b1] rounded' : ''} h-12 flex justify-start items-center cursor-pointer`} >
                                        <div className='m-auto relative' >
                                            <img src={value.profilePic || defaultUserImage} className='h-10 w-10 m-auto rounded-full bg-gray-400 object-cover' />
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
            <button onClick={() => setIsModalOpen(true)} className={`fixed z-50 bottom-4 left-4 ${darkMode ? 'bg-green-600 text-black hover:bg-green-700 shadow-sm shadow-white ' : 'bg-purple-600 text-white shadow-md shadow-black hover:bg-purple-700'} p-3 rounded-full transition-all`}><CircleFadingPlus size={20} /></button>
            {
                isModalOpen ? <CreateGroup setIsModalOpen={setIsModalOpen} isModalOpen={isModalOpen} /> : null
            }
        </div>
    )
}

export default SideBar