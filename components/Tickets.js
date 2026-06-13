"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useUser } from "@/context/userContext";
import { useRouter } from "next/navigation";
import { useNotificationStore } from '@/store/notificationStore';
import { TbMessageReport } from "react-icons/tb";
import { CiClock2 } from "react-icons/ci";
import { markAsReadDB, markAllAsReadDB } from '@/services/notification.service';
import { FaRegFolderOpen } from "react-icons/fa6";

const Tickets = () => {
  const [view, setView] = useState("ALL");
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/Login");
    }
  }, [loading, user]);

  //   const notifications = useNotificationStore((s) => s.notifications);
  //   const setNotifications = useNotificationStore((s) => s.setNotifications);
  //   const markAsRead = useNotificationStore((s) => s.markAsRead);
  //   const markAll = useNotificationStore((s) => s.markAllAsRead);

  //   const handleMarkAsRead = async (id) => {
  //     const previous = useNotificationStore.getState().notifications;
  //     markAsRead(id);
  //     try {
  //       await markAsReadDB(id);
  //     } catch {
  //       setNotifications(previous);
  //     }
  //   };

  //   const handleMarkAll = async () => {
  //     const previous = useNotificationStore.getState().notifications;
  //     markAll();
  //     try {
  //       await markAllAsReadDB(user.uid);
  //     } catch {
  //       setNotifications(previous);
  //     }
  //   };

  return (
    <div className='w-full h-screen overflow-y-scroll flex flex-col justify-start items-center px-5'>
      <div className='flex gap-1 justify-between items-center w-full mt-6'>
        <div className='flex flex-col'>
          <h2 className='subtitle text-3xl'>Your Event Tickets</h2>
          <p className='contentText'>Manage and view all your event tickets</p>
        </div>
      </div>

      <div className='flex gap-5 justify-between items-center w-full my-5'>
        <div className='w-[24%] h-[135px] flex flex-col justify-center border border-gray-800 bg-[#020613] rounded-lg p-3'>
          <div className='mb-5 flex justify-between pr-3'>
            <p className='contentText text-sm'>Total Tickets</p>
          </div>

          <p className='subtitle text-3xl pl-2 mb-1 flex items-center gap-1'><span className='text-white text-4xl ml-1 mr-2'>•</span> 0</p>
          <p className='text-[#64748b] text-xs'><span className='text-green-500'>+12%</span> from last month</p>
        </div>

        <div className='w-[24%] h-[135px] flex flex-col justify-center border border-gray-800 bg-[#020613] rounded-lg p-3'>
          <div className='mb-5 flex justify-between pr-3'>
            <p className='contentText text-sm'>Active Tickets</p>
          </div>

          <p className='subtitle text-3xl pl-2 mb-1 flex items-center gap-1'><span className='text-green-500 text-4xl ml-1 mr-2'>•</span> 0</p>
          <p className='text-[#64748b] text-xs'><span className='text-green-500'>+3%</span> from last month</p>
        </div>

        <div className='w-[24%] h-[135px] flex flex-col justify-center border border-gray-800 bg-[#020613] rounded-lg p-3'>
          <div className='mb-5 flex justify-between pr-3'>
            <p className='contentText text-sm'>Used Tickets</p>
          </div>

          <p className='subtitle text-3xl pl-2 mb-1 flex items-center gap-1'><span className='text-blue-500 text-4xl ml-1 mr-2'>•</span> 0</p>
          <p className='text-[#64748b] text-xs'><span className='text-green-500'>+5%</span> from last month</p>
        </div>

        <div className='w-[24%] h-[135px] flex flex-col justify-center border border-gray-800 bg-[#020613] rounded-lg p-3'>
          <div className='mb-5 flex justify-between pr-3'>
            <p className='contentText text-sm'>Cancelled / Expired Tickets</p>
          </div>

          <p className='subtitle text-3xl pl-2 mb-1 flex items-center gap-1'><span className='text-red-500 text-4xl ml-1 mr-2'>•</span> 0</p>
          <p className='text-[#64748b] text-xs'><span className='text-green-500'>+5.2%</span> from last month</p>
        </div>
      </div>

      <div className='flex justify-between w-full relative'>
        <div className='flex justify-between items-center w-[40%] bg-indigo-900/20 rounded-sm px-2 py-1'>
          <p className={`${view === "ALL" ? "bg-indigo-800/80" : "hover:bg-indigo-800/20"} w-[19%] flex justify-center items-center px-2 py-1 rounded-sm cursor-pointer`} onClick={() => setView("ALL")}>All</p>
          <p className={`${view === "ACTIVE" ? "bg-indigo-800/80" : "hover:bg-indigo-800/20"} w-[19%] flex justify-center items-center px-2 py-1 rounded-sm cursor-pointer`} onClick={() => setView("ACTIVE")}>Active</p>
          <p className={`${view === "USED" ? "bg-indigo-800/80" : "hover:bg-indigo-800/20"} w-[19%] flex justify-center items-center px-2 py-1 rounded-sm cursor-pointer`} onClick={() => setView("USED")}>Used</p>
          <p className={`${view === "CANCELLED" ? "bg-indigo-800/80" : "hover:bg-indigo-800/20"} w-[19%] flex justify-center items-center px-2 py-1 rounded-sm cursor-pointer`} onClick={() => setView("CANCELLED")}>Cancelled</p>
          <p className={`${view === "EXPIRED" ? "bg-indigo-800/80" : "hover:bg-indigo-800/20"} w-[19%] flex justify-center items-center px-2 py-1 rounded-sm cursor-pointer`} onClick={() => setView("EXPIRED")}>Expired</p>
        </div>

        {/* <button onClick={() => handleMarkAll()} className='cursor-pointer btnText bg-indigo-600/30 hover:bg-indigo-600/50 px-4 py-2 rounded-sm text-sm transition-all duration-200 ease-in-out flex justify-center items-center gap-2' >Mark All as Read</button> */}
      </div>

      <div className='w-full h-fit py-4 mt-2'>
        <div className='min-h-[210px] h-fit w-[100%] px-1 flex flex-wrap justify-between items-center gap-y-5'>
          <div className='bg-[#081849]/10 hover:bg-[#081849]/20 border border-gray-800 w-[49%] h-[300px] rounded-lg px-8 py-5'>
            <div className='relative w-full h-[30%]'>
              <p className='contentText text-sm'>Event Ticket</p>
              <h2 className='subtitle text-2xl mt-3'>IIIT Kalyani ka pehla event</h2>

              <p className='absolute top-0 right-0 border border-green-500 bg-green-500/20 text-sm text-green-500 px-2 py-1 rounded-xl'>Active</p>
            </div>

            <hr className='border-gray-500 border-dashed' />

            <div className='relative w-full h-[70%] flex justify-center items-start pt-5'>
              <div className='w-1/2 flex flex-col gap-4'>
                <div>
                  <p className='text-sm text-gray-400'>Date</p>
                  <p className='text-lg'>26/05/2026</p>
                </div>

                <div>
                  <p className='text-sm text-gray-400'>Venue</p>
                  <p className='text-lg'>Room G-02</p>
                </div>
              </div>

              <div className='w-1/2'>
                <div>
                  <p className='text-sm text-gray-400'>Time</p>
                  <p className='text-lg'>06:30 pm</p>
                </div>
              </div>

              <div className='absolute bottom-0 right-0'>
                <p className='text-sm text-gray-600'>Ticket ID</p>
                <p className='text-sm text-gray-500'>3TSN01W1ZxfLZ75yN5Sm</p>
              </div>
            </div>
          </div>

          <div className='bg-[#081849]/10 hover:bg-[#081849]/20 border border-gray-800 w-[49%] h-[300px] rounded-lg px-8 py-5'>
            <div className='relative w-full h-[30%]'>
              <p className='contentText text-sm'>Event Ticket</p>
              <h2 className='subtitle text-2xl mt-3'>IIIT Kalyani ka dusra event</h2>

              <p className='absolute top-0 right-0 border border-blue-500 bg-blue-500/20 text-sm text-blue-500 px-2 py-1 rounded-xl'>Used</p>
            </div>

            <hr className='border-gray-500 border-dashed' />

            <div className='relative w-full h-[70%] flex justify-center items-start pt-5'>
              <div className='w-1/2 flex flex-col gap-4'>
                <div>
                  <p className='text-sm text-gray-400'>Date</p>
                  <p className='text-lg'>26/05/2026</p>
                </div>

                <div>
                  <p className='text-sm text-gray-400'>Venue</p>
                  <p className='text-lg'>Room G-02</p>
                </div>
              </div>

              <div className='w-1/2'>
                <div>
                  <p className='text-sm text-gray-400'>Time</p>
                  <p className='text-lg'>06:30 pm</p>
                </div>
              </div>

              <div className='absolute bottom-0 right-0'>
                <p className='text-sm text-gray-600'>Ticket ID</p>
                <p className='text-sm text-gray-500'>3TSN01W1ZxfLZ75yN5Sm</p>
              </div>
            </div>
          </div>

          <div className='bg-[#081849]/10 hover:bg-[#081849]/20 border border-gray-800 w-[49%] h-[300px] rounded-lg px-8 py-5'>
            <div className='relative w-full h-[30%]'>
              <p className='contentText text-sm'>Event Ticket</p>
              <h2 className='subtitle text-2xl mt-3'>IIIT Kalyani ka teesra event</h2>

              <p className='absolute top-0 right-0 border border-red-500 bg-red-500/20 text-sm text-red-500 px-2 py-1 rounded-xl'>Cancelled</p>
            </div>

            <hr className='border-gray-500 border-dashed' />

            <div className='relative w-full h-[70%] flex justify-center items-start pt-5'>
              <div className='w-1/2 flex flex-col gap-4'>
                <div>
                  <p className='text-sm text-gray-400'>Date</p>
                  <p className='text-lg'>26/05/2026</p>
                </div>

                <div>
                  <p className='text-sm text-gray-400'>Venue</p>
                  <p className='text-lg'>Room G-02</p>
                </div>
              </div>

              <div className='w-1/2'>
                <div>
                  <p className='text-sm text-gray-400'>Time</p>
                  <p className='text-lg'>06:30 pm</p>
                </div>
              </div>

              <div className='absolute bottom-0 right-0'>
                <p className='text-sm text-gray-600'>Ticket ID</p>
                <p className='text-sm text-gray-500'>3TSN01W1ZxfLZ75yN5Sm</p>
              </div>
            </div>
          </div>

          <div className='bg-[#081849]/10 hover:bg-[#081849]/20 border border-gray-800 w-[49%] h-[300px] rounded-lg px-8 py-5'>
            <div className='relative w-full h-[30%]'>
              <p className='contentText text-sm'>Event Ticket</p>
              <h2 className='subtitle text-2xl mt-3'>IIIT Kalyani ka chautha event</h2>

              <p className='absolute top-0 right-0 border border-gray-500 bg-gray-500/20 text-sm text-gray-500 px-2 py-1 rounded-xl'>Expired</p>
            </div>

            <hr className='border-gray-500 border-dashed' />

            <div className='relative w-full h-[70%] flex justify-center items-start pt-5'>
              <div className='w-1/2 flex flex-col gap-4'>
                <div>
                  <p className='text-sm text-gray-400'>Date</p>
                  <p className='text-lg'>26/05/2026</p>
                </div>

                <div>
                  <p className='text-sm text-gray-400'>Venue</p>
                  <p className='text-lg'>Room G-02</p>
                </div>
              </div>

              <div className='w-1/2'>
                <div>
                  <p className='text-sm text-gray-400'>Time</p>
                  <p className='text-lg'>06:30 pm</p>
                </div>
              </div>

              <div className='absolute bottom-0 right-0'>
                <p className='text-sm text-gray-600'>Ticket ID</p>
                <p className='text-sm text-gray-500'>3TSN01W1ZxfLZ75yN5Sm</p>
              </div>
            </div>
          </div>

          <div className='bg-[#081849]/10 hover:bg-[#081849]/20 border border-gray-800 w-[49%] h-[300px] rounded-lg px-8 py-5'>
            <div className='relative w-full h-[30%]'>
              <p className='contentText text-sm'>Event Ticket</p>
              <h2 className='subtitle text-2xl mt-3'>IIIT Kalyani ka panchwa event</h2>

              <p className='absolute top-0 right-0 border border-green-500 bg-green-500/20 text-sm text-green-500 px-2 py-1 rounded-xl'>Active</p>
            </div>

            <hr className='border-gray-500 border-dashed' />

            <div className='relative w-full h-[70%] flex justify-center items-start pt-5'>
              <div className='w-1/2 flex flex-col gap-4'>
                <div>
                  <p className='text-sm text-gray-400'>Date</p>
                  <p className='text-lg'>26/05/2026</p>
                </div>

                <div>
                  <p className='text-sm text-gray-400'>Venue</p>
                  <p className='text-lg'>Room G-02</p>
                </div>
              </div>

              <div className='w-1/2'>
                <div>
                  <p className='text-sm text-gray-400'>Time</p>
                  <p className='text-lg'>06:30 pm</p>
                </div>
              </div>

              <div className='absolute bottom-0 right-0'>
                <p className='text-sm text-gray-600'>Ticket ID</p>
                <p className='text-sm text-gray-500'>3TSN01W1ZxfLZ75yN5Sm</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tickets;