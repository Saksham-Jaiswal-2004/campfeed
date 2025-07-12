import React from 'react'
import Navbar from '@/components/Navbar'
import { IoMdSend } from "react-icons/io";

const page = () => {
  return (
    <div className="min-h-[100vh] h-fit flex justify-center items-center">
      <Navbar />

      <div className='w-full h-screen flex justify-center items-end pb-4 gap-8'>
        <div className='w-[70%] h-[87%] border border-gray-700 rounded-lg flex flex-col justify-center items-center'>
          <div className='w-full h-[90%]'></div>

          <div className='w-full h-[10%] flex justify-center items-center gap-3'>
            <input type="text" name="" id="" placeholder='Ask me anything about campus life...' className='text-sm w-[90%] h-[75%] rounded-2xl outline-none px-4 border border-gray-800 focus:border-gray-700 bg-[#161a24] contentText' />
            <button className='contentText bg-indigo-600 hover:bg-indigo-700 px-4 py-[0.6rem] rounded-xl transition-all duration-200 ease-in-out'><IoMdSend className='text-lg' /></button>
          </div>
        </div>

        <div className='w-[22%] h-[87%] rounded-lg flex flex-col justify-start items-center gap-3'>
          <div className='border border-gray-700 px-5 py-4 rounded-lg w-[95%]'>
            <h2 className='subtitle text-lg mb-3'>Quick Questions</h2>

            <div className='contentText flex flex-col w-full gap-2'>
              <p className='cursor-pointer border rounded-md p-2 text-sm border-gray-700 hover:text-white hover:bg-gray-700/20'>Next GDG Event?</p>
              <p className='cursor-pointer border rounded-md p-2 text-sm border-gray-700 hover:text-white hover:bg-gray-700/20'>How to register for GSoC?</p>
              <p className='cursor-pointer border rounded-md p-2 text-sm border-gray-700 hover:text-white hover:bg-gray-700/20'>Placement Roadmap</p>
              <p className='cursor-pointer border rounded-md p-2 text-sm border-gray-700 hover:text-white hover:bg-gray-700/20'>Library Hours?</p>
            </div>
          </div>

          <div className='border border-gray-700 px-5 py-3 rounded-lg w-[95%]'>
            <h2 className='subtitle text-lg mb-3'>Popular Topics</h2>

            <div className='contentText flex flex-col w-full gap-1'>
              <p className='cursor-pointer rounded-md px-6 py-2 text-xs border-gray-700 hover:text-white hover:bg-gray-700/20'>Upcoming Events</p>
              <p className='cursor-pointer rounded-md px-6 py-2 text-xs border-gray-700 hover:text-white hover:bg-gray-700/20'>Placement Drives</p>
              <p className='cursor-pointer rounded-md px-6 py-2 text-xs border-gray-700 hover:text-white hover:bg-gray-700/20'>Academic Deadlines</p>
              <p className='cursor-pointer rounded-md px-6 py-2 text-xs border-gray-700 hover:text-white hover:bg-gray-700/20'>Club Activities</p>
              <p className='cursor-pointer rounded-md px-6 py-2 text-xs border-gray-700 hover:text-white hover:bg-gray-700/20'>Library Services</p>
              <p className='cursor-pointer rounded-md px-6 py-2 text-xs border-gray-700 hover:text-white hover:bg-gray-700/20'>Campus Facilities</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page
