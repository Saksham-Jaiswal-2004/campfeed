"use client"
import React, { useState } from 'react'
import { CiSearch } from "react-icons/ci";
import { IoIosArrowDown } from "react-icons/io";
import { CgDanger } from "react-icons/cg";
import { MdOutlineInfo } from "react-icons/md";
import { FiCheckCircle } from "react-icons/fi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import users from '@/Data/users'
import announcements from '@/Data/announcements';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

const Page = () => {
  const [role, setRole] = useState("Select Role")
  const [priority, setPriority] = useState("Select Priority")

  const filteredAnnouncements = announcements.filter((announcement) => {
    const roleMatch = role === "All Roles" || role === "Select Role" || announcement.role === role;
    const priorityMatch = priority === "All Priorities" || priority === "Select Priority" || announcement.priority === priority;
    return roleMatch && priorityMatch;
  });

  const handleReset = () => {
    setRole("Select Role");
    setPriority("Select Priority")
  }

  return (
    <div className='w-full h-screen overflow-y-scroll flex flex-col justify-start items-center'>
      <Navbar />

      <div className='flex gap-1 justify-between items-center w-[92vw] px-5 mt-32'>
        <div className='flex flex-col'>
          <h2 className='subtitle text-3xl'>Latest Announcements</h2>
          <p className='contentText'>Stay updated with important campus news</p>
        </div>
      </div>

      <div className='flex justify-start w-[92vw] my-6 relative'>
        <CiSearch className='absolute contentText top-[28%] left-[1.6%]' />
        <input type="search" name="announcements" id="announcements" placeholder='Search Announcements...' className='w-[40%] text-sm mx-2 contentText !text-white rounded-sm pl-8 pr-4 py-2 border border-gray-700 focus:!border-gray-500 outline-none' />

        <DropdownMenu>
          <DropdownMenuTrigger>{role}</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setRole("All Roles")}>All Roles</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRole("Admin")}>Admin</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRole("Faculty")}>Faculty</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRole("Student Club")}>Student Club</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger>{priority}</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => { setPriority("All Priorities") }}>All Priorities</DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setPriority("High") }}>High Priority</DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setPriority("Medium") }}>Medium Priority</DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setPriority("Low") }}>Low Priority</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <button className='contextText border border-gray-700 px-4 py-2 rounded-sm hover:bg-gray-700/20 transition-all duration-200 ease-in-out mx-2' onClick={() => { handleReset() }}>Reset</button>
      </div>

      <div className='w-[92vw] h-fit p-4 rounded-lg'>
        <div className='mb-4'>
          <h2 className='navText text-xl'>Total Announcements - {filteredAnnouncements.length}</h2>
        </div>

        <div className='grid grid-cols-1 justify-center items-center gap-8 w-full mb-10'>
          {filteredAnnouncements.map((announcement, index) => (
            <div key={index} className='w-[100%] h-[220px] border border-gray-700 rounded-xl overflow-hidden'>
              <div className='w-full h-full flex flex-col justify-between p-5'>
                <div className='relative'>
                  <h3 className='subtitle text-lg mb-1'>{announcement.title}</h3>
                  <p className='contentText text-xs w-[95%] flex gap-2 items-center'>{announcement.createdBy} <span>•</span> <span className='border border-gray-700 contentText py-[0.15rem] px-2 rounded-lg !text-white'>{announcement.role}</span> <span>•</span> {new Date(announcement.dateTime).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true })}</p>
                  <div className='flex gap-2 text-xs mt-3'>
                    <p className='border border-gray-700 bg-cyan-500/60 !text-white contentText py-1 px-2 rounded-lg'>{announcement.tags[0]}</p>
                    <p className='border border-gray-700 bg-cyan-500/60 !text-white contentText py-1 px-2 rounded-lg'>{announcement.tags[1]}</p>
                    <p className='border border-gray-700 bg-cyan-500/60 !text-white contentText py-1 px-2 rounded-lg'>{announcement.tags[2]}</p>
                  </div>

                  <div className='absolute top-0 right-0 flex gap-2 text-xs justify-center items-center contentText'>
                    <span className='border border-gray-700 contentText py-1 px-2 rounded-lg !text-white bg-blue-400/70'>{announcement.targetAudience}</span>
                    {announcement.priority == "High" && <p className='text-xs flex justify-center items-center gap-1 text-red-400 bg-red-500/20 p-1 rounded-lg border border-red-800/30'><CgDanger /> High Priority</p>}
                    {announcement.priority == "Medium" && <p className='text-xs flex justify-center items-center gap-1 text-yellow-400 bg-yellow-500/20 p-1 rounded-lg border border-yellow-800/30'><MdOutlineInfo /> Medium Priority</p>}
                    {announcement.priority == "Low" && <p className='text-xs flex justify-center items-center gap-1 text-green-400 bg-green-500/20 p-1 rounded-lg border border-green-800/30'><FiCheckCircle /> Low Priority</p>}
                  </div>
                </div>

                <div className='flex w-full h-fit justify-start'>
                  <p className="contentText text-sm">{announcement.description}</p>
                </div>

                <div className='flex w-full h-fit justify-start'>
                  <button className='text-xs flex justify-center items-end gap-2 text-indigo-500 hover:text-indigo-700'>Read More <IoIosArrowDown /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Page
