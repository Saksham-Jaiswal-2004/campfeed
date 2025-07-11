import React from 'react'
import { FaRegCalendar } from "react-icons/fa6";
import { CiChat1 } from "react-icons/ci";
import { AiOutlineRise } from "react-icons/ai";
import { FiUsers } from "react-icons/fi";
import { IoAddOutline } from "react-icons/io5";

const Dash = ({setSelectedView}) => {
    return (
        <div className='w-[84vw] min-h-screen h-fit flex flex-col justify-start items-center'>
            <div className='flex gap-1 justify-between items-center w-full px-5 mt-6'>
                <div className='flex flex-col'>
                    <h2 className='subtitle text-3xl'>Admin Dashboard</h2>
                    <p className='contentText'>Manage your campus platform</p>
                </div>

                <div className='flex gap-4'>
                    <button onClick = {() => {setSelectedView("PostEvent")}} className='cursor-pointer btnText bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-sm text-sm transition-all duration-200 ease-in-out flex justify-center items-center gap-2'><IoAddOutline className='text-lg' /> Add Event</button>
                    <button onClick = {() => {setSelectedView("PostAnnouncement")}} className='cursor-pointer btnText bg-indigo-600/30 hover:bg-indigo-600/50 px-4 py-2 rounded-sm text-sm transition-all duration-200 ease-in-out flex justify-center items-center gap-2'><IoAddOutline className='text-lg' /> New Announcement</button>
                </div>
            </div>

            <div className='flex gap-5 justify-center items-center w-full mt-5'>
                <div className='w-[23%] h-[120px] flex flex-col justify-center border border-gray-700 rounded-lg p-3'>
                    <div className='mb-2 flex justify-between pr-3'>
                        <p className='contentText text-sm'>Total events this month</p>
                        <FaRegCalendar className='text-blue-600' />
                    </div>

                    <p className='subtitle text-3xl'>24</p>
                    <p className='text-[#64748b] text-xs'><span className='text-green-500'>+12%</span> from last month</p>
                </div>

                <div className='w-[23%] h-[120px] flex flex-col justify-center border border-gray-700 rounded-lg p-3'>
                    <div className='mb-2 flex justify-between pr-3'>
                        <p className='contentText text-sm'>Announcements</p>
                        <CiChat1 className='text-green-500 text-xl' />
                    </div>

                    <p className='subtitle text-3xl'>8</p>
                    <p className='text-[#64748b] text-xs'><span className='text-green-500'>+3%</span> from last month</p>
                </div>

                <div className='w-[23%] h-[120px] flex flex-col justify-center border border-gray-700 rounded-lg p-3'>
                    <div className='mb-2 flex justify-between pr-3'>
                        <p className='contentText text-sm'>Engagement</p>
                        <AiOutlineRise className='text-violet-600 text-xl' />
                    </div>

                    <p className='subtitle text-3xl'>89%</p>
                    <p className='text-[#64748b] text-xs'><span className='text-green-500'>+5%</span> from last week</p>
                </div>

                <div className='w-[23%] h-[120px] flex flex-col justify-center border border-gray-700 rounded-lg p-3'>
                    <div className='mb-2 flex justify-between pr-3'>
                        <p className='contentText text-sm'>Active Users</p>
                        <FiUsers className='text-cyan-500 text-xl' />
                    </div>

                    <p className='subtitle text-3xl'>2341</p>
                    <p className='text-[#64748b] text-xs'><span className='text-green-500'>+5.2%</span> from last month</p>
                </div>
            </div>
        </div>
    )
}

export default Dash
