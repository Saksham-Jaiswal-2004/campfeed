import React from 'react'
import { IoIosArrowForward } from "react-icons/io";
import { Progress } from "@/components/ui/progress"
import { SlClock } from "react-icons/sl";
import { IoLocationOutline } from "react-icons/io5";
import { GoPeople } from "react-icons/go";
import { FaRegCalendar } from "react-icons/fa6";

const UpcomingEvents = () => {
    return (
        <div className='h-fit w-full flex flex-col justify-center items-center mt-14 px-14'>
            <div className='flex justify-between items-center w-full'>
                <div>
                    <h2 className='subtitle text-3xl'>Upcoming Events</h2>
                    <p className='contentText'>Don&apos;t miss out on these exciting campus events</p>
                </div>

                <button className='border border-gray-700 px-4 py-2 rounded-sm text-sm flex justify-center items-center gap-3 hover:bg-gray-700/20 transition-all duration-200 ease-in-out'>View All <IoIosArrowForward /></button>
            </div>

            <div className='flex justify-center items-center gap-8 w-full my-10'>
                {/* Card 1 */}
                <div className='w-[32%] h-[550px] border border-gray-700 rounded-xl overflow-hidden'>
                    <div className='h-[40%] w-full bg-gray-800'></div>

                    <div className='h-[60%] w-full flex flex-col justify-between p-5'>
                        <div>
                            <h3 className='subtitle text-lg mb-1'>GDG Devfest 2025</h3>
                            <p className='contentText text-sm w-[95%]'>Annual developer conference with workshops and networking</p>
                            <div className='flex gap-2 text-xs mt-2'>
                                <p className='border border-gray-700 contentText py-1 px-2 rounded-lg'>GDG</p>
                                <p className='border border-gray-700 contentText py-1 px-2 rounded-lg'>Workshop</p>
                                <p className='border border-gray-700 contentText py-1 px-2 rounded-lg'>Networking</p>
                            </div>
                        </div>

                        <div className='flex flex-col w-full justify-center items-center gap-2'>
                            <div className='flex flex-col items-start w-full px-2 gap-2'>
                                <p className='flex justify-center items-center gap-2 text-xs navText text-[#8194ad]'><FaRegCalendar className='text-base' /> 15 Feb, 2025</p>
                                <p className='flex justify-center items-center gap-2 text-xs navText text-[#8194ad]'><SlClock className='text-base' /> 09:00 AM</p>
                                <p className='flex justify-center items-center gap-2 text-xs navText text-[#8194ad]'><IoLocationOutline className='text-base' /> Main Auditorium</p>
                                <p className='flex justify-center items-center gap-2 text-xs navText text-[#8194ad]'><GoPeople className='text-base' /> 245/300 Registered</p>
                            </div>
                            <div className='w-full px-2'>
                                <Progress value={(245/300)*100} />
                            </div>
                            <button className='w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded-lg text-sm transition-all duration-200 ease-in-out'>Register Now</button>
                        </div>
                    </div>
                </div>

                {/* Card 2 */}
                <div className='w-[32%] h-[550px] border border-gray-700 rounded-xl overflow-hidden'>
                    <div className='h-[40%] w-full bg-gray-800'></div>

                    <div className='h-[60%] w-full flex flex-col justify-between p-5'>
                        <div>
                            <h3 className='subtitle text-lg mb-1'>Placement Drive - TCS</h3>
                            <p className='contentText text-sm w-[95%]'>On-campus recruitment drive for final year students</p>
                            <div className='flex gap-2 text-xs mt-2'>
                                <p className='border border-gray-700 contentText py-1 px-2 rounded-lg'>TCS</p>
                                <p className='border border-gray-700 contentText py-1 px-2 rounded-lg'>Placement</p>
                                <p className='border border-gray-700 contentText py-1 px-2 rounded-lg'>Career</p>
                            </div>
                        </div>

                        <div className='flex flex-col w-full justify-center items-center gap-2'>
                            <div className='flex flex-col items-start w-full px-2 gap-2'>
                                <p className='flex justify-center items-center gap-2 text-xs navText text-[#8194ad]'><FaRegCalendar className='text-base' /> 18 Feb, 2025</p>
                                <p className='flex justify-center items-center gap-2 text-xs navText text-[#8194ad]'><SlClock className='text-base' /> 10:00 AM</p>
                                <p className='flex justify-center items-center gap-2 text-xs navText text-[#8194ad]'><IoLocationOutline className='text-base' /> Placement Cell</p>
                                <p className='flex justify-center items-center gap-2 text-xs navText text-[#8194ad]'><GoPeople className='text-base' /> 89/100 Registered</p>
                            </div>
                            <div className='w-full px-2'>
                                <Progress value={(89/100)*100} />
                            </div>
                            <button className='w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded-lg text-sm transition-all duration-200 ease-in-out'>Register Now</button>
                        </div>
                    </div>
                </div>

                {/* Card 3 */}
                <div className='w-[32%] h-[550px] border border-gray-700 rounded-xl overflow-hidden'>
                    <div className='h-[40%] w-full bg-gray-800'></div>

                    <div className='h-[60%] w-full flex flex-col justify-between p-5'>
                        <div>
                            <h3 className='subtitle text-lg mb-1'>Status Code 2</h3>
                            <p className='contentText text-sm w-[95%]'>36-hour coding marathon with exciting prizes</p>
                            <div className='flex gap-2 text-xs mt-2'>
                                <p className='border border-gray-700 contentText py-1 px-2 rounded-lg'>Hackathon</p>
                                <p className='border border-gray-700 contentText py-1 px-2 rounded-lg'>Coding</p>
                                <p className='border border-gray-700 contentText py-1 px-2 rounded-lg'>Competition</p>
                            </div>
                        </div>

                        <div className='flex flex-col w-full justify-center items-center gap-2'>
                            <div className='flex flex-col items-start w-full px-2 gap-2'>
                                <p className='flex justify-center items-center gap-2 text-xs navText text-[#8194ad]'><FaRegCalendar className='text-base' /> 23 Aug, 2025</p>
                                <p className='flex justify-center items-center gap-2 text-xs navText text-[#8194ad]'><SlClock className='text-base' /> 08:00 AM</p>
                                <p className='flex justify-center items-center gap-2 text-xs navText text-[#8194ad]'><IoLocationOutline className='text-base' />IISER Kolkata</p>
                                <p className='flex justify-center items-center gap-2 text-xs navText text-[#8194ad]'><GoPeople className='text-base' /> 240/500 Registered</p>
                            </div>
                            <div className='w-full px-2'>
                                <Progress value={(240/500)*100} />
                            </div>
                            <button className='w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded-lg text-sm transition-all duration-200 ease-in-out'>Register Now</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UpcomingEvents
