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
import { useUser } from "@/context/userContext";

const Events = ({ setSelectedView }) => {
  const { user, userData } = useUser();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyEvents = async () => {
      if (!user) return;

      try {
        const eventsRef = collection(db, "events");
        const q = query(eventsRef, where("createdBy", "==", user.uid));
        const snapshot = await  (userData.role === "Admin" ? getDocs(eventsRef) : getDocs(q));
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

  return (
    <div className="w-[84vw] h-screen overflow-y-scroll flex flex-col justify-start items-center">
      <div className="flex gap-1 justify-between items-center w-full px-5 mt-6">
        <div className="flex flex-col">
          <h2 className="subtitle text-3xl">Manage {userData.role==="Admin"?"All":"Your"} Events</h2>
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

      <div className="flex justify-start w-full px-5 mt-6 relative">
        <CiSearch className="absolute contentText top-[28%] left-[2.6%]" />
        <input
          type="search"
          name="events"
          id="events"
          placeholder="Search Events..."
          className="w-[40%] text-sm contentText !text-white rounded-sm pl-8 pr-4 py-2 border border-gray-700 focus:!border-gray-500 outline-none"
        />
      </div>

      {loading ? (
        <p className="contentText mt-10">Loading your events...</p>
      ) : events.length === 0 ? (
        <p className="contentText mt-10">No events found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full px-5 my-8 h-fit">
          {events.map((event) => (
            <div
              key={event.id}
              className="w-full h-[350px] border border-gray-700 rounded-md overflow-hidden relative"
            >
              <div className="h-full w-full flex flex-col justify-between p-5">
                <div>
                  <h3 className="subtitle text-lg mb-1">{event.name}</h3>
                  <p className="contentText text-sm w-[95%]">
                    {event.description}
                  </p>
                  <div className="flex gap-2 text-xs mt-2 flex-wrap">
                    {event.tags?.map((tag, index) => (
                      <p
                        key={index}
                        className="border border-gray-700 contentText py-1 px-2 rounded-lg"
                      >
                        {tag}
                      </p>
                    ))}
                  </div>

                  <div className="flex justify-center items-center gap-3 contentText absolute top-6 right-5">
                    <button>
                      <FaRegEdit className="hover:text-cyan-600 transition-all duration-200 ease-in-out" />
                    </button>
                    <button>
                      <RiDeleteBin6Line className="hover:text-red-600 transition-all duration-200 ease-in-out" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col w-full justify-center items-center gap-2">
                  <div className="flex flex-col items-start w-full px-2 gap-2">
                    <p className="flex items-center gap-2 text-xs navText text-[#8194ad]">
                      <FaRegCalendar className="text-base" />{" "}
                      {new Date(event.startDate?.seconds * 1000).toLocaleDateString()}
                    </p>
                    <p className="flex items-center gap-2 text-xs navText text-[#8194ad]">
                      <SlClock className="text-base" />{" "}
                      {new Date(event.startDate?.seconds * 1000).toLocaleTimeString()}
                    </p>
                    <p className="flex items-center gap-2 text-xs navText text-[#8194ad]">
                      <IoLocationOutline className="text-base" /> {event.venue}
                    </p>
                    <p className="flex items-center gap-2 text-xs navText text-[#8194ad]">
                      <GoPeople className="text-base" />{" "}
                      {event.registered || 0}/{event.capacity} Registered
                    </p>
                  </div>

                  <div className="w-full px-2">
                    <Progress
                      value={
                        event.capacity
                          ? ((event.registered || 0) / event.capacity) * 100
                          : 0
                      }
                    />
                  </div>

                  <button className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded-lg text-sm transition-all duration-200 ease-in-out">
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