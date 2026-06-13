"use client"
import React from 'react'
import { FaRegCalendar } from "react-icons/fa6";
import { CiChat1 } from "react-icons/ci";
import { AiOutlineRise } from "react-icons/ai";
import { FiUsers } from "react-icons/fi";
import { IoAddOutline } from "react-icons/io5";
import { TbMessageReport } from "react-icons/tb";
import { MdNotificationsNone } from "react-icons/md";
import {
  collection,
  query,
  where,
  onSnapshot,
  Timestamp,
  limit,
  orderBy,
  getDocs,
  doc,
  getDoc
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { useUser } from '@/context/userContext';
import { CgDanger } from "react-icons/cg";
import { MdOutlineInfo } from "react-icons/md";
import { FiCheckCircle } from "react-icons/fi";
import { div } from 'motion/react-client';
import { useNotificationStore } from '@/store/notificationStore';

const StudentDash = ({setSelectedView}) => {
      const { user, loading } = useUser();
      const [announcements, setAnnouncements] = useState([]);
      const [events, setEvents] = useState([])
      const [issues, setIssues] = useState([])
      const [fetching, setFetching] = useState(true);

  const [stats, setStats] = useState({
    totalEvents: 0,
    activeAnnouncements: 0,
    totalIssuesResolved: 0,
    totalUsers: 0,
  });

  useEffect(() => {
      const fetchMyAnnouncements = async () => {
        if (!user) return;
  
        try {
          const q = query(
                          collection(db, "announcements"),
                          orderBy("createdAt", "desc"),
                          limit(5)
                        );
                    
          const snapshot = await getDocs(q);
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

    useEffect(() => {
            const fetchMyEvents = async () => {
                if (!user) return;
    
                try {
                    const q = query(
                      collection(db, "events"),
                      orderBy("startDate", "desc"),
                      limit(5)
                    );
              
                    const snapshot = await getDocs(q);
              
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

    useEffect(() => {
      if (!user) return;
    
      const issuesRef = collection(db, "issues");
    
      const q = query(
        issuesRef,
        orderBy("created_at", "desc"),
        limit(5)
      );
    
      const unsubscribe = onSnapshot(q, async (snapshot) => {
        try {
          const issuesWithUser = await Promise.all(
            snapshot.docs.map(async (docSnap) => {
              const issueData = docSnap.data();
              let createdByData = {};
    
              try {
                const userRef = doc(db, "users", issueData.student_id);
                const userSnap = await getDoc(userRef);
    
                if (userSnap.exists()) {
                  createdByData = userSnap.data();
                }
              } catch (error) {
                console.error("Error fetching user for issue:", error);
              }
    
              return {
                id: docSnap.id,
                ...issueData,
                createdByUser: createdByData,
              };
            })
          );
    
          setIssues(issuesWithUser);
        } catch (err) {
          console.error("Error fetching issues:", err);
        } finally {
          setFetching(false);
        }
      });
    
      return () => unsubscribe();
    }, [user]);

  useEffect(() => {
    const unsubscribes = [];

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startTimestamp = Timestamp.fromDate(startOfMonth);

    const eventsQuery = query(
      collection(db, "events"),
      // where("createdAt", ">=", startTimestamp)
    );

    const unsubscribeEvents = onSnapshot(eventsQuery, (snapshot) => {
      let totalRsvps = 0;

      snapshot.forEach((doc) => {
        totalRsvps += doc.data().registered || 0;
      });

      setStats((prev) => ({
        ...prev,
        totalEvents: snapshot.size,
        totalRsvps,
      }));
    });

    unsubscribes.push(unsubscribeEvents);

    const unsubscribeUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      setStats((prev) => ({
        ...prev,
        totalUsers: snapshot.size,
      }));
    });

    unsubscribes.push(unsubscribeUsers);

    return () => unsubscribes.forEach((unsub) => unsub());
  }, []);

  useEffect(() => {
    const unsubscribes = [];

    // Get total count of all announcements in database
    const unsubscribeAnnouncements = onSnapshot(collection(db, "announcements"), (snapshot) => {
      setStats((prev) => ({
        ...prev,
        activeAnnouncements: snapshot.size,
      }));
    });

    unsubscribes.push(unsubscribeAnnouncements);

    // Get total count of all issues in database
    const unsubscribeIssues = onSnapshot(collection(db, "issues"), (snapshot) => {
      setStats((prev) => ({
        ...prev,
        totalIssuesResolved: snapshot.size,
      }));
    });

    unsubscribes.push(unsubscribeIssues);

    return () => unsubscribes.forEach((unsub) => unsub());
  }, []);

  const unreadCount = useNotificationStore(
    (state) => state.unreadCount
  );

  async function token() {
    if(!loading && user)
      console.log("User Token: ", await user.getIdToken())
  }

    return (
        <div className='w-[84vw] min-h-screen h-fit flex flex-col justify-start items-center'>
            <div className='flex gap-1 justify-between items-center w-full px-5 mt-6'>
                <div className='flex flex-col'>
                    <h2 className='subtitle text-3xl'>Campus Dashboard</h2>
                    <p className='contentText'>Raise Queries and see what&apos;s happening in your Campus</p>
                </div>

                <div className='flex gap-4'>
                    <button onClick = {() => {setSelectedView("Notifications")}} className='relative cursor-pointer btnText bg-indigo-600/20 hover:bg-indigo-700/30 text-gray-400 hover:text-white px-2 py-2 rounded-sm transition-all duration-200 ease-in-out flex justify-center items-center'>
                    {/* <button onClick = {() => {}} className='relative cursor-pointer btnText bg-indigo-600/20 hover:bg-indigo-700/30 text-gray-400 hover:text-white px-2 py-2 rounded-sm transition-all duration-200 ease-in-out flex justify-center items-center'> */}
                      <MdNotificationsNone className='text-xl' />
                      { unreadCount != 0 ? <div className={`absolute top-1 right-1 bg-green-500 h-2 w-2 rounded-full animate-pulse`}></div> : "" }
                    </button>
                    {/* <button onClick = {() => {setSelectedView("AllIssues")}} className='cursor-pointer btnText bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-sm text-sm transition-all duration-200 ease-in-out flex justify-center items-center gap-2'><TbMessageReport className='text-lg' /> Issues</button> */}
                    <button onClick = {() => {token()}} className='cursor-pointer btnText bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-sm text-sm transition-all duration-200 ease-in-out flex justify-center items-center gap-2'><TbMessageReport className='text-lg' /> Issues</button>
                    <button onClick = {() => {setSelectedView("LogIssue")}} className='cursor-pointer btnText bg-indigo-600/30 hover:bg-indigo-600/50 px-4 py-2 rounded-sm text-sm transition-all duration-200 ease-in-out flex justify-center items-center gap-2'><IoAddOutline className='text-lg' /> Log an Issue</button>
                </div>
            </div>

            <div className='flex gap-5 justify-center items-center w-full mt-5'>
                <div className='w-[23%] h-[135px] flex flex-col justify-center border border-gray-800 bg-[#020613] rounded-lg p-3'>
                    <div className='mb-5 flex justify-between pr-3'>
                        <p className='contentText text-sm'>Total Events</p>
                        <FaRegCalendar className='text-blue-600' />
                    </div>

                    <p className='subtitle text-3xl pl-2 mb-1'>{stats.totalEvents}</p>
                    <p className='text-[#64748b] text-xs'><span className='text-green-500'>+12%</span> from last month</p>
                </div>

                <div className='w-[23%] h-[135px] flex flex-col justify-center border border-gray-800 bg-[#020613] rounded-lg p-3'>
                    <div className='mb-5 flex justify-between pr-3'>
                        <p className='contentText text-sm'>Active Announcements</p>
                        <CiChat1 className='text-green-500 text-xl' />
                    </div>

                    <p className='subtitle text-3xl pl-2 mb-1'>{stats.activeAnnouncements}</p>
                    <p className='text-[#64748b] text-xs'><span className='text-green-500'>+3%</span> from last month</p>
                </div>

                <div className='w-[23%] h-[135px] flex flex-col justify-center border border-gray-800 bg-[#020613] rounded-lg p-3'>
                    <div className='mb-5 flex justify-between pr-3'>
                        <p className='contentText text-sm'>Total Issues Submitted</p>
                        <AiOutlineRise className='text-violet-600 text-xl' />
                    </div>

                    <p className='subtitle text-3xl pl-2 mb-1'>{stats.totalIssuesResolved}</p>
                    <p className='text-[#64748b] text-xs'><span className='text-green-500'>+5%</span> from last week</p>
                </div>

                <div className='w-[23%] h-[135px] flex flex-col justify-center border border-gray-800 bg-[#020613] rounded-lg p-3'>
                    <div className='mb-5 flex justify-between pr-3'>
                        <p className='contentText text-sm'>Total Peers Connected</p>
                        <FiUsers className='text-cyan-500 text-xl' />
                    </div>

                    <p className='subtitle text-3xl pl-2 mb-1'>{stats.totalUsers}</p>
                    <p className='text-[#64748b] text-xs'><span className='text-green-500'>+5.2%</span> from last month</p>
                </div>
            </div>

            <div className='flex justify-center h-fit items-center gap-4 w-full mt-8'>
                <div className='w-[31.25%] h-[400px] rounded-xl bg-[#020613] border border-gray-800'>
                    <div className='flex justify-between items-center mb-4 px-8 py-4'>
                        <h2 className='subtitle'>Issue Logs</h2>
                        <button onClick = {() => {setSelectedView("AllIssues")}} className='cursor-pointer btnText bg-indigo-600/20 hover:bg-indigo-600/30 px-3 py-2 rounded-sm text-xs transition-all duration-200 ease-in-out flex justify-center items-center gap-2'>View All</button>
                    </div>

                    <div className='flex flex-col justify-center items-center px-2 gap-1'>
                        {issues.map((issue) => (
                        <div key={issue.id} className='relative w-full flex-col border border-gray-800/60 cursor-pointer hover:bg-[#020818] rounded-sm px-5 py-2'>
                            <h3 className='text-base'>{issue.title}</h3>
                            <div className='flex gap-1 text-xs text-[#64748b]'>
                                <p>
                                    {
                                      issue.category_id==="CAT001"?"Academic":
                                      issue.category_id==="CAT002"?"Faculty/Department":
                                      issue.category_id==="CAT003"?"Education & Assessment":
                                      issue.category_id==="CAT004"?"Administrative/Office":
                                      issue.category_id==="CAT005"?"Hostel/Accomodation":
                                      issue.category_id==="CAT006"?"IT & Digital":
                                      issue.category_id==="CAT007"?"Campus Facilities/Transport":
                                      issue.category_id==="CAT008"?"Safety, Security & Discipline":
                                      issue.category_id==="CAT009"?"Others": ""
                                    }
                                </p>
                                <span>•</span>
                                <p>{issue.upvotes}</p>
                            </div>
                            {issue.priority === "critical" && (
                              <p className='absolute top-3 right-4 text-[0.65rem] text-red-500 '>
                                Critical Priority
                              </p>
                            )}
                            {issue.priority === "high" && (
                              <p className='absolute top-3 right-4 text-[0.65rem] text-orange-500 '>
                                High Priority
                              </p>
                            )}
                            {issue.priority === "medium" && (
                              <p className='absolute top-3 right-4 text-[0.65rem] text-yellow-500 '>
                                Medium Priority
                              </p>
                            )}
                            {issue.priority === "low" && (
                              <p className='absolute top-3 right-4 text-[0.65rem] text-green-500 '>
                                Low Priority
                              </p>
                            )}
                        </div>
                        ))}
                    </div>
                </div>

                <div className='w-[31.25%] h-[400px] rounded-xl bg-[#020613] border border-gray-800'>
                    <div className='flex justify-between items-center mb-4 px-8 py-4'>
                        <h2 className='subtitle'>Announcements</h2>
                        <button onClick = {() => {setSelectedView("Announcements")}} className='cursor-pointer btnText bg-indigo-600/20 hover:bg-indigo-600/30 px-3 py-2 rounded-sm text-xs transition-all duration-200 ease-in-out flex justify-center items-center gap-2'>View All</button>
                    </div>

                    <div className='flex flex-col justify-center items-center px-2 gap-1'>
                        {announcements.map((announcement) => (
                        <div key={announcement.id} className='relative w-full flex-col border border-gray-800/60 cursor-pointer hover:bg-[#020818] rounded-sm px-5 py-2'>
                            <h3 className='text-base'>{announcement.title}</h3>
                            <div className='flex gap-1 text-xs text-[#64748b]'>
                                <p>{announcement.targetAudience}</p>
                                <span>•</span>
                                <p>{new Date(announcement.createdAt.toDate()).toLocaleString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                })}</p>
                            </div>
                            {announcement.priority === "High" && (
                              <p className='absolute top-3 right-4 text-[0.65rem] text-red-500 '>
                                High Priority
                              </p>
                            )}
                            {announcement.priority === "Medium" && (
                              <p className='absolute top-3 right-4 text-[0.65rem] text-yellow-500 '>
                                Medium Priority
                              </p>
                            )}
                            {announcement.priority === "Low" && (
                              <p className='absolute top-3 right-4 text-[0.65rem] text-green-500 '>
                                Low Priority
                              </p>
                            )}
                        </div>
                        ))}
                    </div>
                </div>

                <div className='w-[31.25%] h-[400px] rounded-xl bg-[#020613] border border-gray-800'>
                    <div className='flex justify-between items-center mb-4 px-8 py-4'>
                        <h2 className='subtitle'>Events</h2>
                        <button onClick = {() => {setSelectedView("EventList")}} className='cursor-pointer btnText bg-indigo-600/20 hover:bg-indigo-600/30 px-3 py-2 rounded-sm text-xs transition-all duration-200 ease-in-out flex justify-center items-center gap-2'>View All</button>
                    </div>

                    <div className='flex flex-col justify-center items-center px-2 gap-1'>
                        {events.map((event) => (
                        <div key={event.id} className='relative w-full flex-col border border-gray-800/60 cursor-pointer hover:bg-[#020818] rounded-sm px-5 py-2'>
                            <h3 className='text-base'>{event.name}</h3>
                            <div className='flex gap-1 text-xs text-[#64748b]'>
                                <p>
                                    {new Date(event.startDate.toDate()).toLocaleString("en-GB", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: true,
                                    })}
                                </p>
                                <span>•</span>
                                <p>{event.venue}</p>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StudentDash
