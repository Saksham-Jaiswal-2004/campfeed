"use client"
import Navbar from '@/components/Navbar'
import React, { useEffect } from 'react'
import { FaRegCalendar } from "react-icons/fa6";
import { CiChat1 } from "react-icons/ci";
import { AiOutlineRise } from "react-icons/ai";
import { FiUsers } from "react-icons/fi";
import UpcomingEvents from '@/components/UpcomingEvents';
import LatestAnnouncements from '@/components/LatestAnnouncements';
import { useUser } from "@/context/userContext";
import { useRouter } from "next/navigation";

const Page = () => {

    const { user, userData, login, logout, loading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/auth/Login");
        }
    }, [loading, user]);

    if (loading || !userData) return <div className="h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-[100vh] h-fit flex flex-col justify-start items-center">
            <Navbar />
            <div className='mt-24 flex flex-col gap-1 justify-center items-center'>
                <h2 className='subtitle text-3xl'>Campus Overview</h2>
                <p className='contentText'>Real-time insights into campus activity</p>
            </div>

            <div className='flex gap-5 justify-center items-center w-full mt-8'>
                <div className='w-[22%] h-[120px] flex flex-col justify-center border border-gray-700 rounded-lg p-3'>
                    <div className='mb-2 flex justify-between pr-3'>
                        <p className='contentText text-sm'>Total events this month</p>
                        <FaRegCalendar className='text-blue-600' />
                    </div>

                    <p className='subtitle text-3xl'>24</p>
                    <p className='text-[#64748b] text-xs'><span className='text-green-500'>+12%</span> from last month</p>
                </div>

                <div className='w-[22%] h-[120px] flex flex-col justify-center border border-gray-700 rounded-lg p-3'>
                    <div className='mb-2 flex justify-between pr-3'>
                        <p className='contentText text-sm'>Active Announcements</p>
                        <CiChat1 className='text-green-500 text-xl' />
                    </div>

                    <p className='subtitle text-3xl'>8</p>
                    <p className='text-[#64748b] text-xs'><span className='text-green-500'>+3%</span> from last month</p>
                </div>

                <div className='w-[22%] h-[120px] flex flex-col justify-center border border-gray-700 rounded-lg p-3'>
                    <div className='mb-2 flex justify-between pr-3'>
                        <p className='contentText text-sm'>Total RSVP&apos;s this month</p>
                        <AiOutlineRise className='text-violet-600 text-xl' />
                    </div>

                    <p className='subtitle text-3xl'>624</p>
                    <p className='text-[#64748b] text-xs'><span className='text-green-500'>+19%</span> from last month</p>
                </div>

                <div className='w-[22%] h-[120px] flex flex-col justify-center border border-gray-700 rounded-lg p-3'>
                    <div className='mb-2 flex justify-between pr-3'>
                        <p className='contentText text-sm'>Active Users</p>
                        <FiUsers className='text-cyan-500 text-xl' />
                    </div>

                    <p className='subtitle text-3xl'>2341</p>
                    <p className='text-[#64748b] text-xs'><span className='text-green-500'>+5.2%</span> from last month</p>
                </div>
            </div>

            <UpcomingEvents />
            <LatestAnnouncements />
        </div>
    )
}

export default Page
