"use client"
import React, { useState, useEffect } from 'react'
import { CiSearch } from "react-icons/ci";
import { Progress } from "@/components/ui/progress"
import { SlClock } from "react-icons/sl";
import { IoLocationOutline } from "react-icons/io5";
import { GoPeople } from "react-icons/go";
import { FaRegCalendar } from "react-icons/fa6";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useUser } from "@/context/userContext";
import { useRouter } from "next/navigation";

const Page = () => {
    const [audience, setAudience] = useState("Select Audience")
    const { user, userData, loading } = useUser();
    const [events, setEvents] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/auth/Login");
        }
    }, [loading, user]);

    useEffect(() => {
        const fetchMyEvents = async () => {
            if (!user) return;

            try {
                const eventsRef = collection(db, "events");
                const snapshot = await getDocs(eventsRef);
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

    const searchedEvents = events.filter((event) => {
        const nameMatch = event.name?.toLowerCase().includes(searchQuery.toLowerCase()) || event.targetAudience?.toLowerCase().includes(searchQuery.toLowerCase())
        const roleMatch = audience === "Select Audience" || audience === "All Departments" || event.targetAudience === audience;

        return nameMatch && roleMatch;
    });

    const handleReset = () => {
        setSearchQuery("");
        setAudience("Select Audience")
    }

    return (
        <div className='w-full h-screen overflow-y-scroll flex flex-col justify-start items-center'>
            <Navbar />

            <div className='flex gap-1 justify-between items-center w-[92vw] px-5 mt-32'>
                <div className='flex flex-col'>
                    <h2 className='subtitle text-3xl'>Upcoming Events</h2>
                    <p className='contentText'>Discover and join exciting campus events</p>
                </div>
            </div>

            <div className='flex justify-start w-[92vw] my-6 relative'>
                <CiSearch className='absolute contentText top-[28%] left-[1.6%]' />
                <input type="search" name="events" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} id="events" placeholder='Search Events by Name and Target Audience...' className='w-[40%] text-sm mx-2 contentText !text-white rounded-sm pl-8 pr-4 py-2 border border-gray-700 focus:!border-gray-500 outline-none' />

                <DropdownMenu>
                    <DropdownMenuTrigger>{audience}</DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => { setAudience("All Departments") }}>All Departments</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setAudience("CSE") }}>CSE</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setAudience("ECE") }}>ECE</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setAudience("AI/ML") }}>AI/ML</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setAudience("Cybersecurity") }}>Cybersecurity</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <button className='contextText border border-gray-700 px-4 py-2 rounded-sm hover:bg-gray-700/20 transition-all duration-200 ease-in-out mx-2' onClick={() => { handleReset() }}>Reset</button>
            </div>

            <div className='w-[92vw] h-fit p-4 rounded-lg'>
                <div className='mb-4'>
                    <h2 className='navText text-xl'>Total Events - {events.length}</h2>
                </div>

                {fetching ? (
                    <div className='w-full h-full flex justify-center items-center navText text-3xl'>
                        Fetching All Events...
                    </div>
                ) : searchedEvents.length === 0 ? (
                    <div className='w-full h-full flex justify-center items-center navText text-3xl'>
                        No Upcoming Events
                    </div>
                ) : (
                    <div className='grid grid-cols-3 justify-center items-center gap-8 w-full mb-10'>
                        {searchedEvents.map((event, index) => (
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
                                        <Link href={""} className='w-full'><button className={`w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded-lg text-sm transition-all duration-200 ease-in-out ${event.registered >= event.capacity ? "!bg-indigo-900 cursor-not-allowed" : ""}`} disabled={event.registered >= event.capacity}>{event.registered >= event.capacity ? "Event Full" : "RSVP Now"}</button></Link>
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

export default Page
