"use client"
import React from 'react'
import { FaRegCalendar } from "react-icons/fa6";
import { CiChat1 } from "react-icons/ci";
import { AiOutlineRise } from "react-icons/ai";
import { FiUsers } from "react-icons/fi";
import { IoAddOutline } from "react-icons/io5";
import { TbMessageReport } from "react-icons/tb";
import { MdNotificationsNone } from "react-icons/md";
import {
  collection,
  query,
  where,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";

const StudentDash = ({setSelectedView}) => {

  const [stats, setStats] = useState({
    totalEvents: 0,
    activeAnnouncements: 0,
    totalRsvps: 0,
    totalUsers: 0,
  });

  const recentActivity = [
  { id: 1, 
    title: "WiFi down in hostel block A", 
    status: "Resolved", 
    location: "Hostel Block A", 
    time: "2 hours ago", 
    urgent: false 
  },
  {
    id: 2,
    title: "Broken AC in classroom 301",
    status: "In Progress",
    location: "Academic Block",
    time: "5 hours ago",
    urgent: true,
  },
  { id: 3, 
    title: "Mess food quality issue", 
    status: "Pending", 
    location: "Dining Hall", 
    time: "1 day ago", 
    urgent: false 
  },
]

  useEffect(() => {
    const unsubscribes = [];

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startTimestamp = Timestamp.fromDate(startOfMonth);

    // 🔁 Events this month
    const eventsQuery = query(
      collection(db, "events"),
      where("createdAt", ">=", startTimestamp)
    );

    const unsubscribeEvents = onSnapshot(eventsQuery, (snapshot) => {
      let totalRsvps = 0;

      snapshot.forEach((doc) => {
        totalRsvps += doc.data().registered || 0;
      });

      setStats((prev) => ({
        ...prev,
        totalEvents: snapshot.size,
        totalRsvps,
      }));
    });

    unsubscribes.push(unsubscribeEvents);

    // 🔁 Active Announcements
    // const annQuery = query(
    //   collection(db, "announcements"),
    //   where("status", "==", "active")
    // );

    const unsubscribeAnnouncements = onSnapshot(collection(db, "announcements"), (snapshot) => {
      setStats((prev) => ({
        ...prev,
        activeAnnouncements: snapshot.size,
      }));
    });

    unsubscribes.push(unsubscribeAnnouncements);

    // 🔁 Users
    const unsubscribeUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      setStats((prev) => ({
        ...prev,
        totalUsers: snapshot.size,
      }));
    });

    unsubscribes.push(unsubscribeUsers);

    // Cleanup listeners on unmount
    return () => unsubscribes.forEach((unsub) => unsub());
  }, []);

    return (
        <div className='w-[84vw] min-h-screen h-fit flex flex-col justify-start items-center'>
            <div className='flex gap-1 justify-between items-center w-full px-5 mt-6'>
                <div className='flex flex-col'>
                    <h2 className='subtitle text-3xl'>Campus Dashboard</h2>
                    <p className='contentText'>Raise Queries and see what&apos;s happening in your Campus</p>
                </div>

                <div className='flex gap-4'>
                    {/* <button onClick = {() => {setSelectedView("Notifications")}} className='cursor-pointer btnText bg-indigo-600/20 hover:bg-indigo-700/30 text-gray-200 hover:text-white px-3 py-2 rounded-sm text-sm transition-all duration-200 ease-in-out flex justify-center items-center gap-2'><MdNotificationsNone className='text-xl' /></button> */}
                    <button onClick = {() => {setSelectedView("AllIssues")}} className='cursor-pointer btnText bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-sm text-sm transition-all duration-200 ease-in-out flex justify-center items-center gap-2'><TbMessageReport className='text-lg' /> Issues</button>
                    <button onClick = {() => {setSelectedView("LogIssue")}} className='cursor-pointer btnText bg-indigo-600/30 hover:bg-indigo-600/50 px-4 py-2 rounded-sm text-sm transition-all duration-200 ease-in-out flex justify-center items-center gap-2'><IoAddOutline className='text-lg' /> Log an Issue</button>
                </div>
            </div>

            <div className='flex gap-5 justify-center items-center w-full mt-5'>
                <div className='w-[23%] h-[135px] flex flex-col justify-center border border-gray-800 bg-[#020613] rounded-lg p-3'>
                    <div className='mb-5 flex justify-between pr-3'>
                        <p className='contentText text-sm'>Total Events This Month</p>
                        <FaRegCalendar className='text-blue-600' />
                    </div>

                    <p className='subtitle text-3xl pl-2 mb-1'>{stats.totalEvents}</p>
                    <p className='text-[#64748b] text-xs'><span className='text-green-500'>+12%</span> from last month</p>
                </div>

                <div className='w-[23%] h-[135px] flex flex-col justify-center border border-gray-800 bg-[#020613] rounded-lg p-3'>
                    <div className='mb-5 flex justify-between pr-3'>
                        <p className='contentText text-sm'>Active Announcements</p>
                        <CiChat1 className='text-green-500 text-xl' />
                    </div>

                    <p className='subtitle text-3xl pl-2 mb-1'>{stats.activeAnnouncements}</p>
                    <p className='text-[#64748b] text-xs'><span className='text-green-500'>+3%</span> from last month</p>
                </div>

                <div className='w-[23%] h-[135px] flex flex-col justify-center border border-gray-800 bg-[#020613] rounded-lg p-3'>
                    <div className='mb-5 flex justify-between pr-3'>
                        <p className='contentText text-sm'>Total Issues Resolved</p>
                        <AiOutlineRise className='text-violet-600 text-xl' />
                    </div>

                    <p className='subtitle text-3xl pl-2 mb-1'>{stats.totalRsvps}</p>
                    <p className='text-[#64748b] text-xs'><span className='text-green-500'>+5%</span> from last week</p>
                </div>

                <div className='w-[23%] h-[135px] flex flex-col justify-center border border-gray-800 bg-[#020613] rounded-lg p-3'>
                    <div className='mb-5 flex justify-between pr-3'>
                        <p className='contentText text-sm'>Total Peers Connected</p>
                        <FiUsers className='text-cyan-500 text-xl' />
                    </div>

                    <p className='subtitle text-3xl pl-2 mb-1'>{stats.totalUsers}</p>
                    <p className='text-[#64748b] text-xs'><span className='text-green-500'>+5.2%</span> from last month</p>
                </div>
            </div>

            <div className='flex justify-center h-fit items-center gap-4 w-full mt-8'>
                <div className='w-[31.25%] h-[400px] rounded-xl bg-[#020613] border border-gray-800'>
                    <div className='flex justify-between items-center mb-4 px-8 py-4'>
                        <h2 className='subtitle'>Issue Logs</h2>
                        <button onClick = {() => {setSelectedView("AllIssues")}} className='cursor-pointer btnText bg-indigo-600/20 hover:bg-indigo-600/30 px-3 py-2 rounded-sm text-xs transition-all duration-200 ease-in-out flex justify-center items-center gap-2'>View All</button>
                    </div>

                    <div className='flex flex-col justify-center items-center px-2 gap-1'>
                        <div className='relative w-full flex-col border border-gray-800/60 cursor-pointer hover:bg-[#020818] rounded-sm px-5 py-2'>
                            <h3 className='text-base'>E-Lafda hogya college me</h3>
                            <div className='flex gap-1 text-xs text-[#64748b]'>
                                <p>Category</p>
                                <span>•</span>
                                <p>Upvotes</p>
                            </div>
                            <p className='absolute top-3 right-4 text-[0.65rem] contentText !text-green-500'>Priority</p>
                        </div>

                        <div className='relative w-full flex-col border border-gray-800/60 cursor-pointer hover:bg-[#020818] rounded-sm px-5 py-2'>
                            <h3 className='text-base'>E-Lafda hogya college me</h3>
                            <div className='flex gap-1 text-xs text-[#64748b]'>
                                <p>Category</p>
                                <span>•</span>
                                <p>Upvotes</p>
                            </div>
                            <p className='absolute top-3 right-4 text-[0.65rem] contentText !text-red-500'>Priority</p>
                        </div>
                        
                        <div className='relative w-full flex-col border border-gray-800/60 cursor-pointer hover:bg-[#020818] rounded-sm px-5 py-2'>
                            <h3 className='text-base'>E-Lafda hogya college me</h3>
                            <div className='flex gap-1 text-xs text-[#64748b]'>
                                <p>Category</p>
                                <span>•</span>
                                <p>Upvotes</p>
                            </div>
                            <p className='absolute top-3 right-4 text-[0.65rem] contentText !text-red-500'>Priority</p>
                        </div>

                        <div className='relative w-full flex-col border border-gray-800/60 cursor-pointer hover:bg-[#020818] rounded-sm px-5 py-2'>
                            <h3 className='text-base'>E-Lafda hogya college me</h3>
                            <div className='flex gap-1 text-xs text-[#64748b]'>
                                <p>Category</p>
                                <span>•</span>
                                <p>Upvotes</p>
                            </div>
                            <p className='absolute top-3 right-4 text-[0.65rem] contentText !text-yellow-500'>Priority</p>
                        </div>

                        <div className='relative w-full flex-col border border-gray-800/60 cursor-pointer hover:bg-[#020818] rounded-sm px-5 py-2'>
                            <h3 className='text-base'>E-Lafda hogya college me</h3>
                            <div className='flex gap-1 text-xs text-[#64748b]'>
                                <p>Category</p>
                                <span>•</span>
                                <p>Upvotes</p>
                            </div>
                            <p className='absolute top-3 right-4 text-[0.65rem] contentText !text-green-500'>Priority</p>
                        </div>
                    </div>
                </div>

                <div className='w-[31.25%] h-[400px] rounded-xl bg-[#020613] border border-gray-800'>
                    <div className='flex justify-between items-center mb-4 px-8 py-4'>
                        <h2 className='subtitle'>Announcements</h2>
                        <button onClick = {() => {setSelectedView("Announcements")}} className='cursor-pointer btnText bg-indigo-600/20 hover:bg-indigo-600/30 px-3 py-2 rounded-sm text-xs transition-all duration-200 ease-in-out flex justify-center items-center gap-2'>View All</button>
                    </div>

                    <div className='flex flex-col justify-center items-center px-2 gap-1'>
                        <div className='relative w-full flex-col border border-gray-800/60 cursor-pointer hover:bg-[#020818] rounded-sm px-5 py-2'>
                            <h3 className='text-base'>E-Lafda hogya college me</h3>
                            <div className='flex gap-1 text-xs text-[#64748b]'>
                                <p>Department</p>
                                <span>•</span>
                                <p>Time</p>
                            </div>
                            <p className='absolute top-3 right-4 text-[0.65rem] contentText !text-green-500'>Priority</p>
                        </div>

                        <div className='relative w-full flex-col border border-gray-800/60 cursor-pointer hover:bg-[#020818] rounded-sm px-5 py-2'>
                            <h3 className='text-base'>E-Lafda hogya college me</h3>
                            <div className='flex gap-1 text-xs text-[#64748b]'>
                                <p>Department</p>
                                <span>•</span>
                                <p>Time</p>
                            </div>
                            <p className='absolute top-3 right-4 text-[0.65rem] contentText !text-red-500'>Priority</p>
                        </div>
                        
                        <div className='relative w-full flex-col border border-gray-800/60 cursor-pointer hover:bg-[#020818] rounded-sm px-5 py-2'>
                            <h3 className='text-base'>E-Lafda hogya college me</h3>
                            <div className='flex gap-1 text-xs text-[#64748b]'>
                                <p>Department</p>
                                <span>•</span>
                                <p>Time</p>
                            </div>
                            <p className='absolute top-3 right-4 text-[0.65rem] contentText !text-yellow-500'>Priority</p>
                        </div>

                        <div className='relative w-full flex-col border border-gray-800/60 cursor-pointer hover:bg-[#020818] rounded-sm px-5 py-2'>
                            <h3 className='text-base'>E-Lafda hogya college me</h3>
                            <div className='flex gap-1 text-xs text-[#64748b]'>
                                <p>Department</p>
                                <span>•</span>
                                <p>Time</p>
                            </div>
                            <p className='absolute top-3 right-4 text-[0.65rem] contentText !text-green-500'>Priority</p>
                        </div>

                        <div className='relative w-full flex-col border border-gray-800/60 cursor-pointer hover:bg-[#020818] rounded-sm px-5 py-2'>
                            <h3 className='text-base'>E-Lafda hogya college me</h3>
                            <div className='flex gap-1 text-xs text-[#64748b]'>
                                <p>Department</p>
                                <span>•</span>
                                <p>Time</p>
                            </div>
                            <p className='absolute top-3 right-4 text-[0.65rem] contentText !text-red-500'>Priority</p>
                        </div>
                    </div>
                </div>

                <div className='w-[31.25%] h-[400px] rounded-xl bg-[#020613] border border-gray-800'>
                    <div className='flex justify-between items-center mb-4 px-8 py-4'>
                        <h2 className='subtitle'>Events</h2>
                        <button onClick = {() => {setSelectedView("EventList")}} className='cursor-pointer btnText bg-indigo-600/20 hover:bg-indigo-600/30 px-3 py-2 rounded-sm text-xs transition-all duration-200 ease-in-out flex justify-center items-center gap-2'>View All</button>
                    </div>

                    <div className='flex flex-col justify-center items-center px-2 gap-1'>
                        <div className='relative w-full flex-col border border-gray-800/60 cursor-pointer hover:bg-[#020818] rounded-sm px-5 py-2'>
                            <h3 className='text-base'>E-Lafda hogya college me</h3>
                            <div className='flex gap-1 text-xs text-[#64748b]'>
                                <p>Date</p>
                                <span>•</span>
                                <p>Time</p>
                                <span>•</span>
                                <p>Venue</p>
                            </div>
                        </div>

                        <div className='relative w-full flex-col border border-gray-800/60 cursor-pointer hover:bg-[#020818] rounded-sm px-5 py-2'>
                            <h3 className='text-base'>E-Lafda hogya college me</h3>
                            <div className='flex gap-1 text-xs text-[#64748b]'>
                                <p>Date</p>
                                <span>•</span>
                                <p>Time</p>
                                <span>•</span>
                                <p>Venue</p>
                            </div>
                        </div>
                        
                        <div className='relative w-full flex-col border border-gray-800/60 cursor-pointer hover:bg-[#020818] rounded-sm px-5 py-2'>
                            <h3 className='text-base'>E-Lafda hogya college me</h3>
                            <div className='flex gap-1 text-xs text-[#64748b]'>
                                <p>Date</p>
                                <span>•</span>
                                <p>Time</p>
                                <span>•</span>
                                <p>Venue</p>
                            </div>
                        </div>

                        <div className='relative w-full flex-col border border-gray-800/60 cursor-pointer hover:bg-[#020818] rounded-sm px-5 py-2'>
                            <h3 className='text-base'>E-Lafda hogya college me</h3>
                            <div className='flex gap-1 text-xs text-[#64748b]'>
                                <p>Date</p>
                                <span>•</span>
                                <p>Time</p>
                                <span>•</span>
                                <p>Venue</p>
                            </div>
                        </div>

                        <div className='relative w-full flex-col border border-gray-800/60 cursor-pointer hover:bg-[#020818] rounded-sm px-5 py-2'>
                            <h3 className='text-base'>E-Lafda hogya college me</h3>
                            <div className='flex gap-1 text-xs text-[#64748b]'>
                                <p>Date</p>
                                <span>•</span>
                                <p>Time</p>
                                <span>•</span>
                                <p>Venue</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StudentDash
