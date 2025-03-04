import React, { useEffect, useRef, useState } from 'react'
import chatBgImg from '../assets/sideImage.png'
import defaultImage from '../assets/profilePic.webp'
import groupImg from '../assets/groupAvatar.jpg'
import { ArrowLeft, Beer, Image, Send, X } from 'lucide-react'
import { createPortal } from 'react-dom';
import { useChatStore } from '../store/useChatStore'
import { useAuthStore } from '../store/useAuthStore';
import { useGroupStore } from '../store/useGroupStore'
import { toast } from 'react-toastify';

function ChatContainer() {
    const { getMessages, setSelectedUser, selectedUser, sendMessage, messages, subscribeToMessages, unsubscribeToMessages } = useChatStore();
    const { onlineUsers, authUser, darkMode, setSideBar, sideBar } = useAuthStore();
    const { groups, deleteGroup, getAllGroups } = useGroupStore();

    const [text, setText] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [showDltModel, setShowDltModel] = useState(false)
    const [selectedGroupId, setSelectedGroupId] = useState('');
    const [selectedGroup, setSelectedGroup] = useState([]);
    const imageRef = useRef();
    const messagesEndRef = useRef();

    const handleOnImageChange = (e) => {
        const file = e.target.files[0];
        if (!file.type.startsWith("image/")) {
            toast.error('Please select an image file', { theme: 'dark' });
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        }
        reader.readAsDataURL(file);
    }

    const removeImage = () => {
        setImagePreview(null);
        if (imageRef.current) imageRef.current.value = "";
    }

    const scrollToBottom = () => {
        const chatContainer = messagesEndRef.current?.parentElement;
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    };
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const messageData = {
            text,
            image: imagePreview
        }
        setText('');
        setImagePreview(null);
        sendMessage(messageData);
        getMessages(selectedUser._id)
    }

    useEffect(() => {
        getMessages(selectedUser._id);
        subscribeToMessages();
        return () => unsubscribeToMessages();
    }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeToMessages])

    const convertTime = (timeStamp) => {
        const newTime = new Date(timeStamp);
        const hours = newTime.getHours();
        const minutes = newTime.getMinutes();
        return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`
    }

    const handleDeleteGroup = (groupId) => {
        setSelectedGroupId(groupId);
        setShowDltModel(true)
    }

    const handleDelete = async () => {
        setShowDltModel(false);
        await deleteGroup(selectedGroupId)
        await getAllGroups()
        setSelectedUser(null)
    };

    useEffect(() => {
        const groupData = groups.filter(group => group._id === selectedUser._id ? group : null)[0]?.members
        setSelectedGroup(groupData);
    }, [selectedUser])

    return (
        <div className={`h-full md:h-full w-full relative flex flex-col justify-center items-center ${darkMode ? 'bg-[#090909]' : 'bg-[#b1b1b1]'} `}>
            {/* Top Section (Video Call) */}
            <div className={`h-[6%] md:h-14 w-[95%] absolute z-30 top-3 flex justify-between pb-2 items-center px-2 rounded-md ${darkMode ? 'border-b bg-[#090909]' : 'bg-[#b1b1b1] border-b-2 border-gray-500 shadow-b-md shadow-black/10'}`} >
                <div className='flex justify-start items-center' >
                    {
                        !sideBar &&
                        <button onClick={() => setSideBar()} className=' md:hidden ' >
                            <ArrowLeft />
                        </button>
                    }
                    {
                        groups.some(group => group._id === selectedUser._id)
                            ? <img src={groupImg} className='h-10 w-10 mr-3 object-cover rounded-full bg-gray-400' />
                            : <img src={selectedUser?.profilePic || defaultImage} className='h-10 w-10 mr-3 object-cover rounded-full bg-gray-400' />
                    }
                    <div>
                        <h1 className='font-semibold' >{selectedUser ? selectedUser.fullName || selectedUser.groupName : "User"}</h1>
                        {
                            selectedUser && groups?.map((group, ind) => group._id === selectedUser._id && (
                                <div key={ind} className='flex'>
                                    {
                                        group.members?.slice(0, 4).map((member, index) => (
                                            <h1 key={index} className='md:hidden pr-2 text-xs opacity-50'>{member.fullName}</h1>
                                        ))
                                    }
                                    {
                                        group.members?.slice(0, 8).map((member, index) => (
                                            <h1 key={index} className='hidden md:block pr-2 text-xs opacity-50'>{member.fullName}</h1>
                                        ))
                                    }
                                </div>
                            ))
                        }
                        {
                            selectedUser.fullName && <h1 className='text-xs font-semibold' >{onlineUsers?.includes(selectedUser._id) ? <span className='text-green-700 ' >Online</span> : <span className='opacity-50' >Offline</span>}</h1>
                        }
                    </div>
                </div>
                <div className='flex gap-4' >
                    {
                        groups?.map(group => group._id === selectedUser._id && (
                            group.admin === authUser._id ? <button key={group._id} onClick={() => handleDeleteGroup(group._id)} className='font-semibold text-red-700 hover:text-red-800 transition-all' ><Beer className='size-5' />  </button> : null
                        ))
                    }
                    <button onClick={() => setSelectedUser(null)} className='text-xl font-semibold' >X</button>
                </div>
            </div>

            {/* CHat section */}
            <div className={`h-[86%] md:h-[88%] lg:h-[83%] w-[95%] md:mb-4 absolute flex flex-col md:gap-2 overflow-auto p-2 md:p-4 z-20`}>
                {
                    messages.length > 0 ? messages.map((val, ind) => (
                        <div key={ind} className={`flex flex-col my-1 ${val.senderId === authUser._id ? 'justify-end' : ''}`}>
                            <div className={`text-xs opacity-60 ${val.senderId === authUser._id ? '' : 'flex '}`} >
                                {
                                    selectedGroup && <h1 className={`pl-1 md:pl-14 font-bold ${val.senderId === authUser._id ? 'invisible' : ''}`} >~{selectedGroup?.find(member => member._id === val.senderId)?.fullName}</h1>
                                }
                                <h1 className={`text-xs pb-0.5 ${val.senderId === authUser._id ? ' text-end pr-1 md:pr-14' : selectedGroup ? 'pl-1 md:pl-2' : 'pl-1 md:pl-14'}`} >{convertTime(val.createdAt)}</h1>
                            </div>
                            <div className={`flex ${val.senderId === authUser._id ? 'justify-end' : ''}`} >
                                {
                                    val.senderId !== authUser._id && (selectedGroup ?
                                        selectedGroup.find(member => member._id === val.senderId) &&
                                        <>
                                            <img key={val.senderId} src={selectedGroup.find(member => member._id === val.senderId)?.profilePic || defaultImage} className='invisible md:visible h-0 w-0 md:h-10 md:w-10 object-cover rounded-full mx-0 md:mx-2 bg-gray-700' />
                                        </>
                                        : <img src={selectedUser.profilePic || defaultImage} className='invisible md:visible h-0 w-0 md:h-10 md:w-10 object-cover rounded-full mx-0 md:mx-2 bg-gray-700' />
                                    )
                                }
                                <div className={`flex flex-col gap-1 rounded-md ${val.senderId === authUser._id ? 'items-end ' : ''}`}>
                                    <img src={val.image} className={`h-32 w-32 mb-1 rounded-md object-cover ${darkMode ? 'shadow-md shadow-white/10' : 'shadow-md shadow-black/90'} ${val.image ? 'visible' : 'hidden'}`} />
                                    <h1 className={`max-w-80 md:max-w-96 p-2 text-sm md:text-base rounded-md ${val.senderId === authUser._id ? darkMode ? 'bg-[#036825] shadow-md shadow-white/10' : 'bg-[#9442ff] md:bg-[#6E00FF] text-white shadow-md shadow-black/70 md:shadow-black/90' : darkMode ? 'bg-[#272727] shadow-md shadow-white/15' : 'bg-white shadow-md shadow-black/60 md:shadow-purple-400'} ${val.text ? 'visible' : 'hidden'}`} >{val.text}</h1>
                                </div>
                                {
                                    val.senderId === authUser._id && <img src={authUser.profilePic || defaultImage} className='invisible md:visible h-0 w-0 md:h-10 md:w-10 object-cover rounded-full mx-0 md:mx-2 bg-gray-700' />
                                }
                            </div>
                        </div>
                    )) : null
                }

                <div ref={messagesEndRef} className='hidden'></div>
            </div>

            {/* Input Field */}
            <div className={`${imagePreview ? 'h-[28%] md:h-48' : 'h-[8%] md:h-16'} w-[95%] md:w-[90%] absolute bottom-0`} >
                <div className={`h-[70%] md:h-[63%] w-36 bg-red-400 absolute z-30 rounded-md overflow-hidden ${imagePreview ? 'visible' : 'hidden'}`} >
                    <img src={imagePreview} className='h-full w-full z-10 object-cover' />
                    <button onClick={removeImage} className='absolute top-1 right-1 z-20 bg-black text-white rounded-full ' > <X className='size-4' /> </button>
                </div>
                <form onSubmit={handleSendMessage} className={`${imagePreview ? 'h-[30%] md:h-[35%]' : 'h-[95%] md:h-full'} w-full absolute bottom-0 z-30`} >
                    <div className={`h-[80%] w-full rounded-md overflow-hidden flex justify-center items-center ${darkMode ? 'bg-[#282828] shadow-md shadow-white/20' : 'bg-white shadow-md shadow-black/50'}`} >
                        <div className='h-full w-[82%] lg:w-[90%] flex justify-center items-center ' >
                            <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder='Type a message...' className={`h-full md:h-[80%] w-full md:w-[98%] ml-auto md:rounded-lg pl-3 border-none outline-none ${darkMode ? 'bg-[#282828] md:bg-[#3C3C3C]' : 'bg-white md:bg-[#d0d0d0]'}`} />
                        </div>
                        <div className='w-[18%] lg:w-[10%] flex justify-center items-center' >
                            <button onClick={() => imageRef.current.click()} type='button' className='h-11 w-12 flex justify-center items-center' ><Image className={`size-6 ${darkMode ? 'text-green-400' : ''}`} /></button>
                            <input type="file" ref={imageRef} accept="image/*" onChange={handleOnImageChange} className='hidden' />
                            <button type='submit' disabled={!text && !imagePreview} className='h-11 w-12 flex justify-center items-center' > <Send className={`size-6 ${!text && !imagePreview ? darkMode ? 'text-gray-500' : 'text-purple-400' : darkMode ? 'text-white' : 'text-purple-800'}`} /></button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Delete Group Confirmation */}
            {
                showDltModel && createPortal(
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                            <h2 className="text-lg font-semibold">Are you sure?</h2>
                            <p className="text-gray-600 text-sm">Do you really want to delete this group? This action cannot be undone.</p>
                            <div className="mt-4 flex justify-end space-x-3">
                                <button onClick={() => setShowDltModel(false)} className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
                                <button onClick={handleDelete} className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700">Confirm</button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )
            }

            {/* Background image */}
            <div className='h-full w-full absolute flex justify-center items-center' >
                <img src={chatBgImg} className={` ${darkMode ? 'opacity-35' : 'opacity-70'}`} />
            </div>
        </div >
    )
}

export default ChatContainer