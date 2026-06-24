"use client";
import React, { useEffect, useState } from "react";
import { IoAddOutline, IoLocationOutline } from "react-icons/io5";
import { SlClock } from "react-icons/sl";
import { GoPeople } from "react-icons/go";
import { FaRegCalendar, FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { CiSearch } from "react-icons/ci";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner"
import { useUser } from "@/context/userContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import BlockSkeleton from "./ui/BlockSkeleton";
import { useEventStore } from "@/store/eventStore";
import { eventService } from "@/services/events.service";
import DeleteIssueModal from "./DeleteIssueModal";

const Events = ({ setSelectedView, setSelectedId }) => {
  const { user, userData } = useUser();
  const [audience, setAudience] = useState("Select Audience")
  const [deleting, setDeleting] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [searchQuery, setSearchQuery] = useState("");

  const events = useEventStore((s) => s.events);
  const loading = useEventStore((s) => s.loading);

  useEffect(() => {
    try {
        eventService.fetchEvents();
      } catch (err) {
        console.error("Error fetching events: ", err);
      }
  }, []);

  const searchedEvents = events.filter((event) =>
    event.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.targetAudience?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <div key={index} className={`w-full h-[550px] cursor-pointer border border-gray-800 ${deleting && event.id === deleteId ? "bg-gray-800" : "bg-[#020613]"} rounded-xl overflow-hidden group`}>
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
                    <FaRegEdit className="text-sm" />
                  </button>
                  <DeleteIssueModal
                    entityType={"Event"}
                    entity={event}
                    onSuccess={() => {
                      toast.success("Event Deleted Successfully!")
                      console.log("Event deleted successfully");
                    }}
                    onError={(error) => {
                      console.error("Failed to delete Event:", error);
                      toast.error("Failed to Delete Event!")
                    }}
                  />
                </div>

                <div className='flex flex-col w-full justify-center items-center gap-2'>
                  <div className='flex flex-col items-start w-full px-2 gap-2'>
                    <p className='flex justify-center items-center gap-2 text-xs navText text-[#8194ad]'><FaRegCalendar className='text-base' /> {new Date(event.startDate._seconds * 1000).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}</p>
                    <p className='flex justify-center items-center gap-2 text-xs navText text-[#8194ad]'><SlClock className='text-base' /> {new Date(event.startDate._seconds * 1000).toLocaleString("en-GB", {
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
                  <button className={`w-full ${ deleting && event.id === deleteId ? "bg-gray-600 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"} py-2 rounded-lg text-sm transition-all duration-200 ease-in-out`} disabled={deleting && event.id === deleteId} onClick={() => { setSelectedView("DetailedEvent"); setSelectedId(event.id) }}>
                    View Event
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;