import React from 'react'
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { CgDanger } from "react-icons/cg";
import { MdOutlineInfo } from "react-icons/md";
import { FiCheckCircle } from "react-icons/fi";
import Link from 'next/link';

const LatestAnnouncements = () => {
  return (
    <div className='h-fit w-full flex flex-col justify-center items-center mt-14 px-14'>
                <div className='flex justify-between items-center w-full'>
                    <div>
                        <h2 className='subtitle text-3xl'>Latest Announcements</h2>
                        <p className='contentText'>Stay updated with important campus news</p>
                    </div>
    
                    <Link href={"/Announcements"}><button className='border border-gray-700 px-4 py-2 rounded-sm text-sm flex justify-center items-center gap-3 hover:bg-gray-700/20 transition-all duration-200 ease-in-out'>View All <IoIosArrowForward /></button></Link>
                </div>
    
                <div className='flex flex-col justify-center items-center gap-6 w-full my-10'>  
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
                                
                                <p className='absolute top-0 right-0 text-xs flex justify-center items-center gap-1 text-red-400 bg-red-500/20 p-1 rounded-lg border border-red-800/30'><CgDanger /> High Priority</p>
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

                                <p className='absolute top-0 right-0 text-xs flex justify-center items-center gap-1 text-yellow-400 bg-yellow-500/20 p-1 rounded-lg border border-yellow-800/30'><MdOutlineInfo /> Medium Priority</p>
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

                                <p className='absolute top-0 right-0 text-xs flex justify-center items-center gap-1 text-green-400 bg-green-500/20 p-1 rounded-lg border border-green-800/30'><FiCheckCircle /> Low Priority</p>
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

export default LatestAnnouncements
