"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { CiSearch } from "react-icons/ci";
import { IoIosArrowDown } from "react-icons/io";
import { CgDanger } from "react-icons/cg";
import { MdOutlineInfo } from "react-icons/md";
import { FiCheckCircle } from "react-icons/fi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/context/userContext";
import DataSkeleton from './ui/DataSkeleton';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { announcementService } from '@/services/announcements.service';
import { useAnnouncementStore } from '@/store/announcementStore';

const AnnouncementList = ({ setSelectedView, setSelectedId }) => {
  const [role, setRole] = useState("Select Role");
  const [priority, setPriority] = useState("Select Priority");
  const [audience, setAudience] = useState("Select Audience");
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [expanded, setExpanded] = useState({});

  const announcements = useAnnouncementStore(s => s.announcements)
  const loading = useAnnouncementStore(s => s.loading)

  useEffect(() => {
    try {
      announcementService.fetchAnnouncements();
    } catch (err) {
      console.error("Error fetching announcements:", err);
    }
}, []);

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((announcement) => {
      const roleMatch = role === "All Roles" || role === "Select Role" || announcement.createdByUser?.role === role;
      const priorityMatch = priority === "All Priorities" || priority === "Select Priority" || announcement.priority === priority;
      const audienceMatch = audience === "All Audience" || audience === "Select Audience" || announcement.targetAudience === audience;
      const nameMatch = announcement.title?.toLowerCase().includes(searchQuery.toLowerCase());
      return roleMatch && priorityMatch && audienceMatch && nameMatch;
    });
  }, [announcements, role, priority, audience, searchQuery]);

  const handleReset = () => {
    setSearchQuery("")
    setRole("Select Role");
    setPriority("Select Priority");
    setAudience("Select Audience");
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  console.log("Announcements: ", announcements);

  return (
    <div className='w-full h-screen overflow-y-scroll flex flex-col justify-start items-center'>
      <div className='flex gap-1 justify-between items-center w-full px-5 mt-6'>
        <div className='flex flex-col'>
          <h2 className='subtitle text-3xl'>Latest Announcements</h2>
          <p className='contentText'>Stay updated with important campus news</p>
        </div>
      </div>

      <div className='flex gap-5 justify-center items-center w-full mt-5'>
        <div className='w-[23%] h-[135px] flex flex-col justify-center border border-gray-800 bg-[#020613] rounded-lg p-3'>
          <div className='mb-5 flex justify-between pr-3'>
            <p className='contentText text-sm'>Total Announcements </p>
          </div>

          <p className='subtitle text-3xl pl-2 mb-1 flex items-center gap-1'><span className='text-white text-4xl ml-1 mr-2'>•</span> {announcements.length}</p>
          <p className='text-[#64748b] text-xs'><span className='text-green-500'>+12%</span> from last month</p>
        </div>

        <div className='w-[23%] h-[135px] flex flex-col justify-center border border-gray-800 bg-[#020613] rounded-lg p-3'>
          <div className='mb-5 flex justify-between pr-3'>
            <p className='contentText text-sm'>High Priority</p>
          </div>

          <p className='subtitle text-3xl pl-2 mb-1 flex items-center gap-1'><span className='text-red-500 text-4xl ml-1 mr-2'>•</span> {announcements.filter(announcement => announcement.priority==="High").length}</p>
          <p className='text-[#64748b] text-xs'><span className='text-green-500'>+3%</span> from last month</p>
        </div>

        <div className='w-[23%] h-[135px] flex flex-col justify-center border border-gray-800 bg-[#020613] rounded-lg p-3'>
          <div className='mb-5 flex justify-between pr-3'>
            <p className='contentText text-sm'>Medium Priority</p>
          </div>

          <p className='subtitle text-3xl pl-2 mb-1 flex items-center gap-1'><span className='text-yellow-500 text-4xl ml-1 mr-2'>•</span> {announcements.filter(announcement => announcement.priority==="Medium").length}</p>
          <p className='text-[#64748b] text-xs'><span className='text-green-500'>+5%</span> from last month</p>
        </div>

        <div className='w-[23%] h-[135px] flex flex-col justify-center border border-gray-800 bg-[#020613] rounded-lg p-3'>
          <div className='mb-5 flex justify-between pr-3'>
            <p className='contentText text-sm'>Low Priority</p>
          </div>

          <p className='subtitle text-3xl pl-2 mb-1 flex items-center gap-1'><span className='text-green-500 text-4xl ml-1 mr-2'>•</span> {announcements.filter(announcement => announcement.priority==="Low").length}</p>
          <p className='text-[#64748b] text-xs'><span className='text-green-500'>+5.2%</span> from last month</p>
        </div>
      </div>

      <div className='flex justify-start w-full my-6 pl-3 relative'>
        <CiSearch className='absolute contentText top-[28%] left-[2.5%]' />
        <input
          type="search"
          name="announcements"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          id="announcements"
          placeholder='Search Announcements...'
          className='w-[40%] text-sm mx-2 contentText !text-white rounded-sm pl-8 pr-4 py-2 border border-gray-700 focus:!border-gray-500 outline-none'
        />

        <DropdownMenu>
          <DropdownMenuTrigger className="border border-gray-700 hover:bg-white/5 transition-all ease-in-out duration-200 px-2 mx-1 rounded-sm">{role}</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setRole("All Roles")}>All Roles</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRole("Admin")}>Admin</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRole("Faculty")}>Faculty</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRole("Student Club")}>Student Club</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="border border-gray-700 hover:bg-white/5 transition-all ease-in-out duration-200 px-2 mx-1 rounded-sm">{priority}</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setPriority("All Priorities")}>All Priorities</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPriority("High")}>High Priority</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPriority("Medium")}>Medium Priority</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPriority("Low")}>Low Priority</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="border border-gray-700 hover:bg-white/5 transition-all ease-in-out duration-200 px-2 mx-1 rounded-sm">{audience}</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setAudience("All Audience")}>All Audience</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setAudience("Students")}>Student</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setAudience("Faculty")}>Faculty</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setAudience("Student Clubs")}>Student Clubs</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setAudience("CSE Department")}>CSE Department</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setAudience("ECE Department")}>ECE Department</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setAudience("AI/ML Department")}>AI/ML Department</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setAudience("Cybersecurity Department")}>Cybersecurity Department</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <button
          className='contextText border border-gray-700 px-4 py-2 rounded-sm hover:bg-gray-700/20 transition-all duration-200 ease-in-out mx-2'
          onClick={handleReset}
        >
          Reset
        </button>
      </div>

      <div className='w-full h-fit p-4 rounded-lg'>
        <div className='mb-4'>
        </div>

        {loading ? (
          <div className='w-full h-full flex justify-center items-center'>
            <DataSkeleton />
          </div>
        ) : !loading && filteredAnnouncements.length === 0 ? (
          <div className='w-full h-full flex justify-center items-center navText text-3xl'>
            No Present Announcements
          </div>
        ) : (
          <div className='grid grid-cols-1 justify-center items-center gap-2 w-full mb-10'>
            {filteredAnnouncements.map((announcement) => (
              <div key={announcement.id} className='w-full h-[30vh] border border-gray-800 bg-[#020613] rounded-lg overflow-hidden group'>
                <button onClick={() => { setSelectedView("DetailedAnnouncement"); setSelectedId(announcement.id) }} className='cursor-pointer w-full h-full justify-start'>
                  <div className='w-full h-full flex flex-col justify-between p-5 hover:bg-gray-900/30 transition-all duration-200 ease-in-out'>
                    <div className='relative'>
                      <h3 className='subtitle text-lg mb-1 group-hover:text-indigo-500 transition-all duration-200 ease-in-out w-fit'>{announcement.title}</h3>
                      <p className='contentText text-xs w-[95%] flex gap-2 items-center'>
                        {announcement.createdBy?.name}
                        <span>•</span>
                        <span className='border border-gray-700 contentText py-[0.15rem] px-2 rounded-lg !text-white'>{announcement.createdBy?.role}</span>
                        <span>•</span>
                        {new Date(announcement.createdAt._seconds * 1000).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </p>
                      <div className='flex gap-2 text-xs mt-3'>
                        {announcement.tags?.map((tag, index) => (
                          <p key={index} className="border border-gray-700 bg-cyan-500/60 !text-white contentText py-1 px-2 rounded-lg">
                            {tag}
                          </p>
                        ))}
                      </div>

                      <div className='absolute top-0 right-0 flex gap-2 text-xs justify-center items-center contentText'>
                        <span className='border border-gray-700 contentText py-1 px-2 rounded-lg !text-white bg-blue-400/70'>{announcement.targetAudience}</span>
                        {announcement.priority === "High" && (
                          <p className='text-xs flex items-center gap-1 text-red-400 bg-red-500/20 p-1 rounded-lg border border-red-800/30'>
                            <CgDanger /> High Priority
                          </p>
                        )}
                        {announcement.priority === "Medium" && (
                          <p className='text-xs flex items-center gap-1 text-yellow-400 bg-yellow-500/20 p-1 rounded-lg border border-yellow-800/30'>
                            <MdOutlineInfo /> Medium Priority
                          </p>
                        )}
                        {announcement.priority === "Low" && (
                          <p className='text-xs flex items-center gap-1 text-green-400 bg-green-500/20 p-1 rounded-lg border border-green-800/30'>
                            <FiCheckCircle /> Low Priority
                          </p>
                        )}
                      </div>
                    </div>

                    <div className='flex w-full h-fit justify-start mt-3'>
                      <p className="contentText text-sm">
                        {expanded[announcement.id]
                          ? announcement.description
                          : announcement.description?.slice(0, 160) + (announcement.description?.length > 160 ? "..." : "")}
                      </p>
                    </div>

                    {announcement.description?.length > 160 && (
                      <div className='flex w-full h-fit justify-start'>
                        <button
                          onClick={() => toggleExpand(announcement.id)}
                          className='text-xs flex items-center gap-2 text-indigo-500 hover:text-indigo-700 mt-2'
                        >
                          {expanded[announcement.id] ? "Show Less" : "Read More"} <IoIosArrowDown />
                        </button>
                      </div>
                    )}
                  </div>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementList;