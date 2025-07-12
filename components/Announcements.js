"use client"
import React, { useState, useEffect } from 'react'
import { CiSearch } from "react-icons/ci";
import { IoAddOutline } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { CgDanger } from "react-icons/cg";
import { MdOutlineInfo } from "react-icons/md";
import { FiCheckCircle } from "react-icons/fi";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useUser } from "@/context/userContext";

const Announcements = ({ setSelectedView }) => {

  const { user, userData } = useUser();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyAnnouncements = async () => {
      if (!user) return;

      try {
        const announcementsRef = collection(db, "announcements");
        const q = query(announcementsRef, where("createdBy", "==", user.uid));
        const snapshot = await (userData.role === "Admin" ? getDocs(announcementsRef) : getDocs(q));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAnnouncements(data);
      } catch (err) {
        console.error("Error fetching announcements: ", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyAnnouncements();
  }, [user]);

  return (
    <div className='w-[84vw] h-screen overflow-y-scroll flex flex-col justify-start items-center'>
      <div className='flex gap-1 justify-between items-center w-full px-5 mt-6'>
        <div className='flex flex-col'>
          <h2 className='subtitle text-3xl'>Manage {userData.role === "Admin" ? "All" : "Your"} Anouncements</h2>
          <p className='contentText'>Create and manage campus announcements</p>
        </div>

        <div className='flex gap-4'>
          <button onClick={() => { setSelectedView("PostAnnouncement") }} className='cursor-pointer btnText bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-sm text-sm transition-all duration-200 ease-in-out flex justify-center items-center gap-2'><IoAddOutline className='text-lg' /> Post Anouncement</button>
        </div>
      </div>

      <div className='flex justify-start w-full px-2 mt-6 relative'>
        <CiSearch className='absolute contentText top-[28%] left-[1.6%]' />
        <input type="search" name="anouncements" id="anouncements" placeholder='Search Anouncements...' className='w-[40%] text-sm contentText !text-white rounded-sm pl-8 pr-4 py-2 border border-gray-700 focus:!border-gray-500 outline-none' />
      </div>

      {loading ? (
        <p className="contentText mt-10">Loading your announcements...</p>
      ) : announcements.length === 0 ? (
        <p className="contentText mt-10">No announcements found.</p>
      ) : (
        <div className='grid grid-cols-1 justify-center items-center gap-4 w-[82vw] my-6'>
          {announcements.map((announcement) => (
            <div key={announcement.id} className='w-[100%] h-[220px] border border-gray-700 rounded-xl overflow-hidden'>
              <div className='w-full h-full flex flex-col justify-between p-5'>
                <div className='relative'>
                  <h3 className='subtitle text-lg mb-1'>{announcement.title}</h3>
                  <p className='contentText text-xs w-[95%] flex gap-2 items-center'>{userData.username} <span>•</span> <span className='border border-gray-700 contentText py-[0.15rem] px-2 rounded-lg !text-white'>{userData.role}</span> <span>•</span> {new Date(announcement.createdAt.toDate()).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true, })}</p>
                  <div className='flex gap-2 text-xs mt-3'>
                    {announcement.tags?.map((tag, index) => (
                      <p key={index} className="border border-gray-700 bg-cyan-500/60 !text-white contentText py-1 px-2 rounded-lg">
                        {tag}
                      </p>
                    ))}
                  </div>

                  <div className='absolute top-0 right-0 flex gap-2 text-xs justify-center items-center contentText'>
                    {announcement.priority === "High" && <p className='flex justify-center items-center gap-1 text-red-400 bg-red-500/20 p-1 rounded-lg border border-red-800/30'><CgDanger /> High Priority</p>}
                    {announcement.priority === "Medium" && <p className='flex justify-center items-center gap-1 text-yellow-400 bg-yellow-500/20 p-1 rounded-lg border border-yellow-800/30'><MdOutlineInfo /> Medium Priority</p>}
                    {announcement.priority === "Low" && <p className='flex justify-center items-center gap-1 text-green-400 bg-green-500/20 p-1 rounded-lg border border-green-800/30'><FiCheckCircle /> Low Priority</p>}
                    <span className='border border-gray-700 contentText py-1 px-2 rounded-lg !text-white bg-blue-400/70'>{announcement.targetAudience}</span>
                    <button><FaRegEdit className='hover:text-cyan-600 transition-all duration-200 ease-in-out text-lg mx-1 ml-2' /></button>
                    <button><RiDeleteBin6Line className='hover:text-red-600 transition-all duration-200 ease-in-out text-lg mx-1 mr-2' /></button>
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
      )}
    </div>
  )
}

export default Announcements
