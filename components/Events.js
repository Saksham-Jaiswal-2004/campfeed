"use client";
import React, { useEffect, useState } from "react";
import { IoAddOutline, IoLocationOutline } from "react-icons/io5";
import { SlClock } from "react-icons/sl";
import { GoPeople } from "react-icons/go";
import { FaRegCalendar, FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { CiSearch } from "react-icons/ci";
import { Progress } from "@/components/ui/progress";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { toast } from "sonner"
import { useUser } from "@/context/userContext";
import {
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link";
import BlockSkeleton from "./ui/BlockSkeleton";

const Events = ({ setSelectedView }) => {
  const { user, userData } = useUser();
  const [events, setEvents] = useState([]);
  const [audience, setAudience] = useState("Select Audience")
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyEvents = async () => {
      if (!user) return;

      try {
        const eventsRef = collection(db, "events");
        const q = query(eventsRef, where("createdBy", "==", user.uid));
        const snapshot = await (userData.role === "Admin" ? getDocs(eventsRef) : getDocs(q));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events: ", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, [user]);

  const searchedEvents = events.filter((event) =>
    event.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.targetAudience?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const deleteEvent = async (id) => {
    try {
      const eventRef = doc(db, "events", id);
      await deleteDoc(eventRef);
      toast("Event Deleted Successfully, Refresh to update")
      return { success: true };
    } catch (error) {
      toast("Failed To Delete Event")
      console.error("❌ Error deleting Event:", error);
      return { success: false, error: error.message };
    }
  };

  const handleReset = () => {
    setSearchQuery("");
    setAudience("Select Audience")
  }

  return (
    <div className="w-[84vw] h-screen overflow-y-scroll flex flex-col justify-start items-center">
      <div className="flex gap-1 justify-between items-center w-full px-5 mt-6">
        <div className="flex flex-col">
          <h2 className="subtitle text-3xl">Manage {userData.role === "Admin" ? "All" : "Your"} Events</h2>
          <p className="contentText">Create and manage campus events</p>
        </div>

        <button
          onClick={() => {
            setSelectedView("PostEvent");
          }}
          className="cursor-pointer btnText bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-sm text-sm transition-all duration-200 ease-in-out flex justify-center items-center gap-2"
        >
          <IoAddOutline className="text-lg" /> Add Event
        </button>
      </div>

      <div className='flex justify-start w-full 400 my-6 pl-3 relative'>
        <CiSearch className='absolute contentText top-[29%] left-[2.5%]' />
        <input type="search" name="events" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} id="events" placeholder='Search Events by Name and Target Audience...' className='w-[40%] text-sm mx-2 contentText !text-white rounded-sm pl-8 pr-4 py-2 border border-gray-700 focus:!border-gray-500 outline-none' />

        <DropdownMenu>
          <DropdownMenuTrigger className="border border-gray-700 hover:bg-white/5 transition-all ease-in-out duration-200 px-2 mx-1 rounded-sm">{audience}</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => { setAudience("All Departments") }}>All Departments</DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setAudience("CSE Department") }}>CSE Department</DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setAudience("ECE Department") }}>ECE Department</DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setAudience("AI/ML Department") }}>AI/ML Department</DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setAudience("Cybersecurity Department") }}>Cybersecurity Department</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <button className='contextText border border-gray-700 px-4 py-2 rounded-sm hover:bg-gray-700/20 transition-all duration-200 ease-in-out mx-2' onClick={() => { handleReset() }}>Reset</button>
      </div>

      {loading ? (
        <div className="w-full h-full flex flex-wrap gap-10 justify-center items-center">
          <BlockSkeleton />
          <BlockSkeleton />
          <BlockSkeleton />
        </div>
      ) : events.length === 0 ? (
        <p className="contentText mt-10">No events found.</p>
      ) : (
        <div className='grid grid-cols-3 justify-center items-center gap-8 w-full mb-10'>
          {searchedEvents.map((event, index) => (
            <div key={index} className='w-full h-[550px] cursor-pointer border border-gray-800 bg-[#020613] rounded-xl overflow-hidden group'>
              <div className='h-[40%] w-full bg-gray-800 overflow-hidden flex justify-center'>
                <img src="/images/Skeleton.png" alt="" className='h-full w-full group-hover:scale-105 transition-all duration-200 ease-in-out object-cover' />
              </div>

              <div className='h-[60%] w-full flex flex-col justify-between p-5 relative'>
                <div>
                  <h3 className='subtitle text-lg mb-1 group-hover:text-indigo-500 transition-all duration-200 ease-in-out'>{event.name}</h3>
                  <p className='contentText text-xs mt-2 w-[95%]'>{event.description}</p>
                  <div className='flex gap-2 text-xs mt-2'>
                    {event.tags?.map((tag, index) => (
                      <p
                        key={index}
                        className="border border-gray-700 contentText py-1 px-2 text-xs rounded-lg"
                      >
                        {tag}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center items-center gap-3 contentText absolute top-6 right-4">
                  <button className="bg-gray-300/5 hover:text-gray-300 hover:bg-gray-300/10 pr-2 pl-3 py-2 rounded-sm flex justify-center items-center">
                    <FaRegEdit className="" />
                  </button>
                  <button onClick={() => { deleteEvent(event.id) }} className="bg-red-500/10 text-red-900 hover:text-red-700 hover:bg-red-500/20 px-2 py-2 rounded-sm">
                    <RiDeleteBin6Line className="" />
                  </button>
                </div>

                <div className='flex flex-col w-full justify-center items-center gap-2'>
                  <div className='flex flex-col items-start w-full px-2 gap-2'>
                    <p className='flex justify-center items-center gap-2 text-xs navText text-[#8194ad]'><FaRegCalendar className='text-base' /> {new Date(event.startDate.toDate()).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}</p>
                    <p className='flex justify-center items-center gap-2 text-xs navText text-[#8194ad]'><SlClock className='text-base' /> {new Date(event.startDate.toDate()).toLocaleString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}</p>
                    <p className='flex justify-center items-center gap-2 text-xs navText text-[#8194ad]'><IoLocationOutline className='text-base' /> {event.venue}</p>
                    <p className='flex justify-center items-center gap-2 text-xs navText text-[#8194ad]'><GoPeople className='text-base' /> {event.registered}/{event.capacity} Registered</p>
                  </div>
                  <div className='w-full px-2'>
                    <Progress value={(event.registered / event.capacity) * 100} />
                  </div>
                  <button className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded-lg text-sm transition-all duration-200 ease-in-out" onClick={() => { setSelectedView("DetailedEvent"); setSelectedId(event.id) }}>
                    View Event
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* //   <div className="grid grid-cols- md:grid-cols-2 lg:grid-cols-3 gap-4 w-full px-5 my-8 h-fit"> */
        //     {searchedEvents.map((event) => (
        //       <div
        //         key={event.id}
        //         className="w-full h-[350px] border border-gray-700 rounded-md overflow-hidden relative"
        //       >
        //         <div className="h-full w-full flex flex-col justify-between p-5">
        //           <div>
        //             <h3 className="subtitle text-lg mb-1">{event.name}</h3>
        //             <p className="contentText text-sm w-[95%]">
        //               {event.description}
        //             </p>
        //             <div className="flex gap-2 text-xs mt-2 flex-wrap">
        //               {event.tags?.map((tag, index) => (
        //                 <p
        //                   key={index}
        //                   className="border border-gray-700 contentText py-1 px-2 rounded-lg"
        //                 >
        //                   {tag}
        //                 </p>
        //               ))}
        //             </div>

        //             <div className="flex justify-center items-center gap-3 contentText absolute top-6 right-5">
        //               <button>
        //                 <FaRegEdit className="hover:text-cyan-600 transition-all duration-200 ease-in-out" />
        //               </button>
        //               <button onClick={() => { deleteEvent(event.id) }}>
        //                 <RiDeleteBin6Line className="hover:text-red-600 transition-all duration-200 ease-in-out" />
        //               </button>
        //             </div>
        //           </div>

        //           <div className="flex flex-col w-full justify-center items-center gap-2">
        //             <div className="flex flex-col items-start w-full px-2 gap-2">
        //               <p className="flex items-center gap-2 text-xs navText text-[#8194ad]">
        //                 <FaRegCalendar className="text-base" />{" "}
        //                 {new Date(event.startDate.toDate()).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", })}
        //               </p>
        //               <p className="flex items-center gap-2 text-xs navText text-[#8194ad]">
        //                 <SlClock className="text-base" />{" "}
        //                 {new Date(event.startDate.toDate()).toLocaleString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: true, })}
        //               </p>
        //               <p className="flex items-center gap-2 text-xs navText text-[#8194ad]">
        //                 <IoLocationOutline className="text-base" /> {event.venue}
        //               </p>
        //               <p className="flex items-center gap-2 text-xs navText text-[#8194ad]">
        //                 <GoPeople className="text-base" />{" "}
        //                 {event.registered || 0}/{event.capacity} Registered
        //               </p>
        //             </div>

        //             <div className="w-full px-2">
        //               <Progress
        //                 value={
        //                   event.capacity
        //                     ? ((event.registered || 0) / event.capacity) * 100
        //                     : 0
        //                 }
        //               />
        //             </div>
        //             <Link href={`/Events/${event.id}`} className="w-full">
        //               <button className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded-lg text-sm transition-all duration-200 ease-in-out">
        //                 View Event
        //               </button>
        //             </Link>
        //           </div>
        //         </div>
        //       </div>
        //     ))}
        //   </div>
        // )}
      }
    </div>
  );
};

export default Events;