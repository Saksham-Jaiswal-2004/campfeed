"use client"
import React, { useState, useEffect } from 'react'
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { CgDanger } from "react-icons/cg";
import { MdOutlineInfo } from "react-icons/md";
import { FiCheckCircle } from "react-icons/fi";
import Link from 'next/link';
import { db } from "@/lib/firebase";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { query, orderBy, limit } from "firebase/firestore";
import { useUser } from "@/context/userContext";

const LatestAnnouncements = () => {

    const { user, loading } = useUser();
    const [announcements, setAnnouncements] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [expanded, setExpanded] = useState({});

    useEffect(() => {
        const fetchMyAnnouncements = async () => {
            if (!user) return;

            try {
                const announcementsRef = collection(db, "announcements");
                const recentQuery = query(announcementsRef, orderBy("createdAt"), limit(3));
                const snapshot = await getDocs(recentQuery);
                const announcementsWithUser = await Promise.all(
                    snapshot.docs.map(async (docSnap) => {
                        const announcementData = docSnap.data();
                        let createdByData = {};

                        try {
                            const userRef = doc(db, "users", announcementData.createdBy);
                            const userSnap = await getDoc(userRef);
                            if (userSnap.exists()) {
                                createdByData = userSnap.data();
                            }
                        } catch (error) {
                            console.error("Error fetching user for announcement:", error);
                        }

                        return {
                            id: docSnap.id,
                            ...announcementData,
                            createdByUser: createdByData,
                        };
                    })
                );

                setAnnouncements(announcementsWithUser);
            } catch (err) {
                console.error("Error fetching announcements: ", err);
            } finally {
                setFetching(false);
            }
        };

        fetchMyAnnouncements();
    }, [user]);

    return (
        <div className='h-fit w-full flex flex-col justify-center items-center mt-14 px-14'>
            <div className='flex justify-between items-center w-full'>
                <div>
                    <h2 className='subtitle text-3xl'>Latest Announcements</h2>
                    <p className='contentText'>Stay updated with important campus news</p>
                </div>

                <Link href={"/Announcements"}><button className='border border-gray-700 px-4 py-2 rounded-sm text-sm flex justify-center items-center gap-3 hover:bg-gray-700/20 transition-all duration-200 ease-in-out'>View All <IoIosArrowForward /></button></Link>
            </div>

            <div className='flex flex-col justify-center items-center gap-6 w-full my-10'>
                {fetching ? (
                    <div className='w-full h-full flex justify-center items-center navText text-3xl'>
                        Fetching All Announcements...
                    </div>
                ) : announcements.length === 0 ? (
                    <div className='w-full h-full flex justify-center items-center navText text-3xl'>
                        No Present Announcements
                    </div>
                ) : (
                    <div className='grid grid-cols-1 justify-center items-center gap-8 w-full mb-10'>
                        {announcements.map((announcement) => (
                            <div key={announcement.id} className='w-full h-fit border border-gray-700 rounded-xl overflow-hidden'>
                                <div className='w-full h-full flex flex-col justify-between p-5'>
                                    <div className='relative'>
                                        <h3 className='subtitle text-lg mb-1'>{announcement.title}</h3>
                                        <p className='contentText text-xs w-[95%] flex gap-2 items-center'>
                                            {announcement.createdByUser?.username}
                                            <span>•</span>
                                            <span className='border border-gray-700 contentText py-[0.15rem] px-2 rounded-lg !text-white'>{announcement.createdByUser?.role}</span>
                                            <span>•</span>
                                            {new Date(announcement.createdAt.toDate()).toLocaleString("en-GB", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: true,
                                            })}
                                        </p>
                                        <div className='flex gap-2 text-xs mt-3'>
                                            {announcement.tags?.map((tag, index) => (
                                                <p key={index} className="border border-gray-700 bg-cyan-500/60 !text-white contentText py-1 px-2 rounded-lg">
                                                    {tag}
                                                </p>
                                            ))}
                                        </div>

                                        <div className='absolute top-0 right-0 flex gap-2 text-xs justify-center items-center contentText'>
                                            <span className='border border-gray-700 contentText py-1 px-2 rounded-lg !text-white bg-blue-400/70'>{announcement.targetAudience}</span>
                                            {announcement.priority === "High" && (
                                                <p className='text-xs flex items-center gap-1 text-red-400 bg-red-500/20 p-1 rounded-lg border border-red-800/30'>
                                                    <CgDanger /> High Priority
                                                </p>
                                            )}
                                            {announcement.priority === "Medium" && (
                                                <p className='text-xs flex items-center gap-1 text-yellow-400 bg-yellow-500/20 p-1 rounded-lg border border-yellow-800/30'>
                                                    <MdOutlineInfo /> Medium Priority
                                                </p>
                                            )}
                                            {announcement.priority === "Low" && (
                                                <p className='text-xs flex items-center gap-1 text-green-400 bg-green-500/20 p-1 rounded-lg border border-green-800/30'>
                                                    <FiCheckCircle /> Low Priority
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className='flex w-full h-fit justify-start mt-3'>
                                        <p className="contentText text-sm">
                                            {expanded[announcement.id]
                                                ? announcement.description
                                                : announcement.description?.slice(0, 160) + (announcement.description?.length > 160 ? "..." : "")}
                                        </p>
                                    </div>

                                    {announcement.description?.length > 160 && (
                                        <div className='flex w-full h-fit justify-start'>
                                            <button
                                                onClick={() => toggleExpand(announcement.id)}
                                                className='text-xs flex items-center gap-2 text-indigo-500 hover:text-indigo-700 mt-2'
                                            >
                                                {expanded[announcement.id] ? "Show Less" : "Read More"} <IoIosArrowDown />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default LatestAnnouncements
