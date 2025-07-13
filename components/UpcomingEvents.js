"use state"
import React, { useState, useEffect } from 'react'
import { IoIosArrowForward } from "react-icons/io";
import { Progress } from "@/components/ui/progress"
import { SlClock } from "react-icons/sl";
import { IoLocationOutline } from "react-icons/io5";
import { GoPeople } from "react-icons/go";
import { FaRegCalendar } from "react-icons/fa6";
import Link from 'next/link';
import { db } from "@/lib/firebase";
import { collection, where, getDocs } from "firebase/firestore";
import { query, orderBy, limit } from "firebase/firestore";
import { useUser } from "@/context/userContext";

const UpcomingEvents = () => {

    const { user, userData, loading } = useUser();
    const [events, setEvents] = useState([]);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        const fetchMyEvents = async () => {
            if (!user) return;

            try {
                const eventsRef = collection(db, "events");
                const recentQuery = query(eventsRef, orderBy("createdAt"), limit(3));
                const snapshot = await getDocs(recentQuery);
                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setEvents(data);
            } catch (err) {
                console.error("Error fetching events: ", err);
            } finally {
                setFetching(false);
            }
        };

        fetchMyEvents();
    }, [user]);

    return (
        <div className='h-fit w-full flex flex-col justify-center items-center mt-14 px-14'>
            <div className='flex justify-between items-center w-full'>
                <div>
                    <h2 className='subtitle text-3xl'>Upcoming Events</h2>
                    <p className='contentText'>Don&apos;t miss out on these exciting campus events</p>
                </div>

                <Link href={"/Events"}><button className='border border-gray-700 px-4 py-2 rounded-sm text-sm flex justify-center items-center gap-3 hover:bg-gray-700/20 transition-all duration-200 ease-in-out'>View All <IoIosArrowForward /></button></Link>
            </div>

            <div className='flex justify-center items-center gap-8 w-full my-10'>
                {fetching ? (
                    <div className='w-full h-full flex justify-center items-center navText text-3xl'>
                        Fetching All Events...
                    </div>
                ) : events.length === 0 ? (
                    <div className='w-full h-full flex justify-center items-center navText text-3xl'>
                        No Upcoming Events
                    </div>
                ) : (
                    <div className='grid grid-cols-3 justify-center items-center gap-8 w-full mb-10'>
                        {events.map((event, index) => (
                            <div key={index} className='w-full h-[550px] cursor-pointer border border-gray-700 rounded-xl overflow-hidden'>
                                <div className='h-[40%] w-full bg-gray-800'></div>

                                <div className='h-[60%] w-full flex flex-col justify-between p-5'>
                                    <div>
                                        <h3 className='subtitle text-lg mb-1'>{event.name}</h3>
                                        <p className='contentText text-sm w-[95%]'>{event.description}</p>
                                        <div className='flex gap-2 text-xs mt-2'>
                                            {event.tags?.map((tag, index) => (
                                                <p
                                                    key={index}
                                                    className="border border-gray-700 contentText py-1 px-2 rounded-lg"
                                                >
                                                    {tag}
                                                </p>
                                            ))}
                                        </div>
                                    </div>

                                    <div className='flex flex-col w-full justify-center items-center gap-2'>
                                        <div className='flex flex-col items-start w-full px-2 gap-2'>
                                            <p className='flex justify-center items-center gap-2 text-xs navText text-[#8194ad]'><FaRegCalendar className='text-base' /> {new Date(event.startDate.toDate()).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", })}</p>
                                            <p className='flex justify-center items-center gap-2 text-xs navText text-[#8194ad]'><SlClock className='text-base' /> {new Date(event.startDate.toDate()).toLocaleString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: true, })}</p>
                                            <p className='flex justify-center items-center gap-2 text-xs navText text-[#8194ad]'><IoLocationOutline className='text-base' /> {event.venue}</p>
                                            <p className='flex justify-center items-center gap-2 text-xs navText text-[#8194ad]'><GoPeople className='text-base' /> {event.registered}/{event.capacity} Registered</p>
                                        </div>
                                        <div className='w-full px-2'>
                                            <Progress value={(event.registered / event.capacity) * 100} />
                                        </div>
                                        <Link href={`/Events/${event.id}`} className='w-full'><button className={`w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded-lg text-sm transition-all duration-200 ease-in-out ${event.registered >= event.capacity ? "!bg-indigo-900 cursor-not-allowed" : ""}`} disabled={event.registered >= event.capacity}>{event.registered >= event.capacity ? "Event Full" : "View Event"}</button></Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default UpcomingEvents
