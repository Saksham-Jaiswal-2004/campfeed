"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useUser } from "@/context/userContext";
import { useRouter } from "next/navigation";
import { useNotificationStore } from '@/store/notificationStore';
import { TbMessageReport } from "react-icons/tb";
import { CiClock2 } from "react-icons/ci";
import { markAsReadDB, markAllAsReadDB } from '@/services/notification.service';
import { FaRegFolderOpen } from "react-icons/fa6";
import { IoNotificationsOffSharp } from "react-icons/io5";

const Notifications = () => {
  const [view, setView] = useState("ALL");
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/Login");
    }
  }, [loading, user]);

  const notifications = useNotificationStore((s) => s.notifications);
  const setNotifications = useNotificationStore((s) => s.setNotifications);
  const markAsRead = useNotificationStore((s) => s.markAsRead);
  const markAll = useNotificationStore((s) => s.markAllAsRead);

  const handleMarkAsRead = async (id) => {
    const previous = useNotificationStore.getState().notifications;
    markAsRead(id);
    try {
      await markAsReadDB(id);
    } catch {
      setNotifications(previous);
    }
  };

  const handleMarkAll = async () => {
    const previous = useNotificationStore.getState().notifications;
    markAll();
    try {
      await markAllAsReadDB(user.uid);
    } catch {
      setNotifications(previous);
    }
  };

  const filteredNotifications = notifications.filter((notification) =>
    view === "ALL"
      ? true
      : notification.type?.includes(view)
  );

  return (
    <div className='w-full h-screen overflow-y-scroll flex flex-col justify-start items-center px-5'>
      <div className='flex gap-1 justify-between items-center w-full mt-6 mb-8'>
        <div className='flex flex-col'>
          <h2 className='subtitle text-3xl'>Latest Notifications</h2>
          <p className='contentText'>Latest updates and concerns for you</p>
        </div>
      </div>

      <div className='flex justify-between w-full relative'>
        <div className='flex justify-between items-center w-[75%] bg-indigo-900/20 rounded-sm px-2 py-1'>
          <p className={`${view === "ALL" ? "bg-indigo-800/80" : "hover:bg-indigo-800/20"} w-[16%] flex justify-center items-center px-2 py-1 rounded-sm cursor-pointer gap-2`} onClick={() => setView("ALL")}>All <span className='bg-indigo-300/15 px-2 py-1 rounded-full text-sm'>{filteredNotifications.length}</span></p>
          <p className={`${view === "ISSUE" ? "bg-indigo-800/80" : "hover:bg-indigo-800/20"} w-[16%] flex justify-center items-center px-2 py-1 rounded-sm cursor-pointer gap-2`} onClick={() => setView("ISSUE")}>Issue  <span className='bg-indigo-300/15 px-2 py-1 rounded-full text-sm'>{filteredNotifications.length}</span></p>
          <p className={`${view === "COMMENT" ? "bg-indigo-800/80" : "hover:bg-indigo-800/20"} w-[16%] flex justify-center items-center px-2 py-1 rounded-sm cursor-pointer gap-2`} onClick={() => setView("COMMENT")}>Comments  <span className='bg-indigo-300/15 px-2 py-1 rounded-full text-sm'>{filteredNotifications.length}</span></p>
          <p className={`${view === "ANNOUNCEMENT" ? "bg-indigo-800/80" : "hover:bg-indigo-800/20"} w-[16%] flex justify-center items-center px-2 py-1 rounded-sm cursor-pointer gap-2`} onClick={() => setView("ANNOUNCEMENT")}>Announcement  <span className='bg-indigo-300/15 px-2 py-1 rounded-full text-sm'>{filteredNotifications.length}</span></p>
          <p className={`${view === "EVENT" ? "bg-indigo-800/80" : "hover:bg-indigo-800/20"} w-[16%] flex justify-center items-center px-2 py-1 rounded-sm cursor-pointer gap-2`} onClick={() => setView("EVENT")}>Events  <span className='bg-indigo-300/15 px-2 py-1 rounded-full text-sm'>{filteredNotifications.length}</span></p>
          <p className={`${view === "SYSTEM" ? "bg-indigo-800/80" : "hover:bg-indigo-800/20"} w-[16%] flex justify-center items-center px-2 py-1 rounded-sm cursor-pointer gap-2`} onClick={() => setView("SYSTEM")}>System  <span className='bg-indigo-300/15 px-2 py-1 rounded-full text-sm'>{filteredNotifications.length}</span></p>
        </div>

        <button onClick={() => handleMarkAll()} className='cursor-pointer btnText bg-indigo-600/30 hover:bg-indigo-600/50 px-4 py-2 rounded-sm text-sm transition-all duration-200 ease-in-out flex justify-center items-center gap-2' >Mark All as Read</button>
      </div>

      <div className='w-full h-fit py-4 mt-2'>
        <div className='min-h-[70vh] h-fit w-[75%] px-1 flex flex-col gap-2'>
          {filteredNotifications.length > 0 ? (filteredNotifications.map((notification) => (
            <div key={notification.id} className={`relative cursor-pointer w-full h-[12vh] py-5 flex justify-start items-center rounded-md! overflow-hidden ${notification.isRead ? "bg-gray-800/45 hover:bg-gray-800/55 border-l-6 border-gray-600/80" : "bg-indigo-800/15 hover:bg-indigo-800/25 border-l-6 border-blue-600/80"}`}>
              <div className='w-[12%] h-full flex justify-center items-center'>
                <div className={`flex justify-center items-center p-3 rounded-xl ${notification.isRead ? "bg-white/10" : "bg-indigo-800/30"}`}>
                  <TbMessageReport className='text-xl' />
                </div>
              </div>

              <div className='w-[73%] h-full flex flex-col justify-center items-start gap-0 px-2'>
                <p className={`subtitle text-lg ${notification.isRead ? "text-white" : "text-blue-500"}`}>{notification.title}</p>
                <p className='contentText text-xs'>{notification.message}</p>
              </div>

              <div className='w-[18%] text-xs h-full flex gap-1 justify-center items-start'>
                <p className='flex justify-center items-center gap-1'><CiClock2 className='text-base' />{new Date(notification.createdAt).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", })}</p>
              </div>

              <div onClick={() => handleMarkAsRead(notification.id)} className='absolute top-12 right-2 rounded-md flex justify-end items-center p-1 text-xs bg-white/10 hover:bg-blue-500/20 hover:text-blue-500'>
                <FaRegFolderOpen className='text-base' />
              </div>
            </div>
          ))) : (
            <div className='w-full h-[60vh] flex flex-col justify-center items-center text-gray-500!'>
              <IoNotificationsOffSharp className='text-3xl mb-1' />
              <p className='text-xl'>You&apos;re all caught up</p>
              <p className='text-base'>No current Notifications</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;