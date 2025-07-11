"use client"
import React, { useState } from 'react'
import { CiSearch } from "react-icons/ci";
import { IoAddOutline } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { CgDanger } from "react-icons/cg";
import { MdOutlineInfo } from "react-icons/md";
import { FiCheckCircle } from "react-icons/fi";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";

const Announcements = ({setSelectedView}) => {

  return (
    <div className='w-[84vw] h-screen overflow-y-scroll flex flex-col justify-start items-center'>
      <div className='flex gap-1 justify-between items-center w-full px-5 mt-6'>
        <div className='flex flex-col'>
          <h2 className='subtitle text-3xl'>Manage Anouncements</h2>
          <p className='contentText'>Create and manage campus announcements</p>
        </div>

        <div className='flex gap-4'>
          <button onClick={() => {setSelectedView("PostAnnouncement")}} className='cursor-pointer btnText bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-sm text-sm transition-all duration-200 ease-in-out flex justify-center items-center gap-2'><IoAddOutline className='text-lg' /> Post Anouncement</button>
        </div>
      </div>

      <div className='flex justify-start w-full px-2 mt-6 relative'>
        <CiSearch className='absolute contentText top-[28%] left-[1.6%]' />
        <input type="search" name="events" id="events" placeholder='Search Anouncements...' className='w-[40%] text-sm contentText !text-white rounded-sm pl-8 pr-4 py-2 border border-gray-700 focus:!border-gray-500 outline-none' />
      </div>

      <div className='grid grid-cols-1 justify-center items-center gap-4 w-[82vw] my-6'>
        {/* Card 1 */}
        <div className='w-[100%] h-[220px] border border-gray-700 rounded-xl overflow-hidden'>
          <div className='w-full h-full flex flex-col justify-between p-5'>
            <div className='relative'>
              <h3 className='subtitle text-lg mb-1'>New Library Hours Effective Immediately</h3>
              <p className='contentText text-xs w-[95%] flex gap-2 items-center'>Library Administration <span>•</span> <span className='border border-gray-700 contentText py-[0.15rem] px-2 rounded-lg !text-white'>Admin</span> <span>•</span> Jan 15, 04:00 PM</p>
              <div className='flex gap-2 text-xs mt-3'>
                <p className='border border-gray-700 bg-cyan-500/60 !text-white contentText py-1 px-2 rounded-lg'>Library</p>
                <p className='border border-gray-700 bg-cyan-500/60 !text-white contentText py-1 px-2 rounded-lg'>Study</p>
                <p className='border border-gray-700 bg-cyan-500/60 !text-white contentText py-1 px-2 rounded-lg'>Hours</p>
              </div>

              <div className='absolute top-0 right-0 flex gap-2 text-xs justify-center items-center contentText'>
                <p className='flex justify-center items-center gap-1 text-red-400 bg-red-500/20 p-1 rounded-lg border border-red-800/30'><CgDanger /> High Priority</p>
                <span className='border border-gray-700 contentText py-1 px-2 rounded-lg !text-white bg-blue-400/70'>All Students</span>
                <button><FaRegEdit className='hover:text-cyan-600 transition-all duration-200 ease-in-out text-lg mx-1 ml-2' /></button>
                <button><RiDeleteBin6Line className='hover:text-red-600 transition-all duration-200 ease-in-out text-lg mx-1 mr-2' /></button>
              </div>
            </div>

            <div className='flex w-full h-fit justify-start'>
              <p className="contentText text-sm">The central library will now be open 24/7 during exam weeks. Students can access study halls and digital resources at any time. Please carry your student ID for entry after 10 PM.</p>
            </div>

            <div className='flex w-full h-fit justify-start'>
              <button className='text-xs flex justify-center items-end gap-2 text-indigo-500 hover:text-indigo-700'>Read More <IoIosArrowDown /></button>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className='w-[100%] h-[220px] border border-gray-700 rounded-xl overflow-hidden'>
          <div className='w-full h-full flex flex-col justify-between p-5'>
            <div className='relative'>
              <h3 className='subtitle text-lg mb-1'>GSoC 2025 Application Workshop</h3>
              <p className='contentText text-xs w-[95%] flex gap-2 items-center'>Dr. Sarah Johnson <span>•</span> <span className='border border-gray-700 contentText py-[0.15rem] px-2 rounded-lg !text-white'>Faculty</span> <span>•</span> Jan 14, 07:45 PM</p>
              <div className='flex gap-2 text-xs mt-3'>
                <p className='border border-gray-700 bg-cyan-500/60 !text-white contentText py-1 px-2 rounded-lg'>GSOC</p>
                <p className='border border-gray-700 bg-cyan-500/60 !text-white contentText py-1 px-2 rounded-lg'>Workshop</p>
                <p className='border border-gray-700 bg-cyan-500/60 !text-white contentText py-1 px-2 rounded-lg'>Career</p>
              </div>

              <div className='absolute top-0 right-0 flex gap-2 text-xs justify-center items-center contentText'>
                <p className='text-xs flex justify-center items-center gap-1 text-yellow-400 bg-yellow-500/20 p-1 rounded-lg border border-yellow-800/30'><MdOutlineInfo /> Medium Priority</p>
                <span className='border border-gray-700 contentText py-1 px-2 rounded-lg !text-white bg-blue-400/70'>3rd Year</span>
                <button><FaRegEdit className='hover:text-cyan-600 transition-all duration-200 ease-in-out text-lg mx-1 ml-2' /></button>
                <button><RiDeleteBin6Line className='hover:text-red-600 transition-all duration-200 ease-in-out text-lg mx-1 mr-2' /></button>
              </div>
            </div>

            <div className='flex w-full h-fit justify-start'>
              <p className="contentText text-sm">Join us for an intensive workshop on Google Summer of Code applications. Learn about project selection, proposal writing, and tips from previous GSoC participants.</p>
            </div>

            <div className='flex w-full h-fit justify-start'>
              <button className='text-xs flex justify-center items-end gap-2 text-indigo-500 hover:text-indigo-700'>Read More <IoIosArrowDown /></button>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className='w-[100%] h-[220px] border border-gray-700 rounded-xl overflow-hidden'>
          <div className='w-full h-full flex flex-col justify-between p-5'>
            <div className='relative'>
              <h3 className='subtitle text-lg mb-1'>Campus WiFi Maintenance</h3>
              <p className='contentText text-xs w-[95%] flex gap-2 items-center'>IT Department <span>•</span> <span className='border border-gray-700 contentText py-[0.15rem] px-2 rounded-lg !text-white'>Admin</span> <span>•</span> Jan 13, 02:30 PM</p>
              <div className='flex gap-2 text-xs mt-3'>
                <p className='border border-gray-700 bg-cyan-500/60 !text-white contentText py-1 px-2 rounded-lg'>WiFi</p>
                <p className='border border-gray-700 bg-cyan-500/60 !text-white contentText py-1 px-2 rounded-lg'>Maintainence</p>
                <p className='border border-gray-700 bg-cyan-500/60 !text-white contentText py-1 px-2 rounded-lg'>IT</p>
              </div>

              <div className='absolute top-0 right-0 flex gap-2 text-xs justify-center items-center contentText'>
                <p className='text-xs flex justify-center items-center gap-1 text-green-400 bg-green-500/20 p-1 rounded-lg border border-green-800/30'><FiCheckCircle /> Low Priority</p>
                <span className='border border-gray-700 contentText py-1 px-2 rounded-lg !text-white bg-blue-400/70'>All Students</span>
                <button><FaRegEdit className='hover:text-cyan-600 transition-all duration-200 ease-in-out text-lg mx-1 ml-2' /></button>
                <button><RiDeleteBin6Line className='hover:text-red-600 transition-all duration-200 ease-in-out text-lg mx-1 mr-2' /></button>
              </div>
            </div>

            <div className='flex w-full h-fit justify-start'>
              <p className="contentText text-sm">Scheduled maintenance on campus WiFi infrastructure will occur this weekend. Expect intermittent connectivity issues between 2 AM - 6 AM on Saturday and Sunday.</p>
            </div>

            <div className='flex w-full h-fit justify-start'>
              <button className='text-xs flex justify-center items-end gap-2 text-indigo-500 hover:text-indigo-700'>Read More <IoIosArrowDown /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Announcements
