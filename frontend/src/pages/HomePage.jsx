import React from 'react'
import { MessageSquare, X } from 'lucide-react'
import SideBar from '../Components/SideBar';
import ChatContainer from '../Components/ChatContainer';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';

function HomePage() {
  const { selectedUser } = useChatStore();
  const { sideBar, setSideBar } = useAuthStore();

  return (
    <div className={` ${sideBar ? ' relative' : ''} h-full w-full lg:w-[90%] flex m-auto `} >
      {/* Side Bar */}
      <div className={`h-full ${sideBar ? 'absolute md:static z-30 w-[60%] md:w-1/3 lg:w-1/5' : 'invisible md:visible w-0 md:w-[9%] lg:w-[7%]'} rounded-md bg-green-400`}>
        <SideBar />
      </div>

      {/* Chat Section */}
      <div className={`h-full ${sideBar ? 'absolute md:static z-20 w-full md:w-2/3 lg:w-4/5' : 'w-full md:w-[91%] lg:w-[93%]'}`} >
        {
          selectedUser ?
            <div className='h-full w-full '>
              <ChatContainer />
            </div>
            :
            <div className='h-full flex justify-center items-center relative'>
              {
                !sideBar &&
                <button onClick={() => setSideBar()} className='visible md:invisible absolute top-4 right-4' >
                  <X />
                </button>
              }
              <div className='w-[95%] text-center flex flex-col justify-center items-center' >
                <div className='animate-bounce' >
                  <MessageSquare className='size-7 animate-pulse' />
                </div>
                <h1 className='text-2xl font-bold py-1'>Welcome to QuickChat!</h1>
                <p className='text-sm opacity-50 font-semibold'>Select the conversation from the sidebar to start chating.</p>
                <p className='text-xs opacity-50 font-semibold invisible md:visible'>Click the user icon to toggle the SideBar.</p>
              </div>
            </div>
        }
      </div>
    </div >
  )
}

export default HomePage