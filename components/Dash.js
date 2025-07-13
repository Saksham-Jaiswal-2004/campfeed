"use client"
import React from 'react'
import { FaRegCalendar } from "react-icons/fa6";
import { CiChat1 } from "react-icons/ci";
import { AiOutlineRise } from "react-icons/ai";
import { FiUsers } from "react-icons/fi";
import { IoAddOutline } from "react-icons/io5";
import {
  collection,
  query,
  where,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";

const Dash = ({setSelectedView}) => {

    const [stats, setStats] = useState({
    totalEvents: 0,
    activeAnnouncements: 0,
    totalRsvps: 0,
    totalUsers: 0,
  });

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
                        <p className='contentText text-sm'>Total Events This Month</p>
                        <FaRegCalendar className='text-blue-600' />
                    </div>

                    <p className='subtitle text-3xl pl-2'>{stats.totalEvents}</p>
                    {/* <p className='text-[#64748b] text-xs'><span className='text-green-500'>+12%</span> from last month</p> */}
                </div>

                <div className='w-[23%] h-[120px] flex flex-col justify-center border border-gray-700 rounded-lg p-3'>
                    <div className='mb-2 flex justify-between pr-3'>
                        <p className='contentText text-sm'>Active Announcements</p>
                        <CiChat1 className='text-green-500 text-xl' />
                    </div>

                    <p className='subtitle text-3xl pl-2'>{stats.activeAnnouncements}</p>
                    {/* <p className='text-[#64748b] text-xs'><span className='text-green-500'>+3%</span> from last month</p> */}
                </div>

                <div className='w-[23%] h-[120px] flex flex-col justify-center border border-gray-700 rounded-lg p-3'>
                    <div className='mb-2 flex justify-between pr-3'>
                        <p className='contentText text-sm'>RSVP&apos;s This Month</p>
                        <AiOutlineRise className='text-violet-600 text-xl' />
                    </div>

                    <p className='subtitle text-3xl pl-2'>{stats.totalRsvps}</p>
                    {/* <p className='text-[#64748b] text-xs'><span className='text-green-500'>+5%</span> from last week</p> */}
                </div>

                <div className='w-[23%] h-[120px] flex flex-col justify-center border border-gray-700 rounded-lg p-3'>
                    <div className='mb-2 flex justify-between pr-3'>
                        <p className='contentText text-sm'>Total Users</p>
                        <FiUsers className='text-cyan-500 text-xl' />
                    </div>

                    <p className='subtitle text-3xl pl-2'>{stats.totalUsers}</p>
                    {/* <p className='text-[#64748b] text-xs'><span className='text-green-500'>+5.2%</span> from last month</p> */}
                </div>
            </div>
        </div>
    )
}

export default Dash
