"use client"
import React from 'react'
import { FaRegCalendar } from "react-icons/fa6";
import { CiChat1 } from "react-icons/ci";
import { AiOutlineRise } from "react-icons/ai";
import { FiUsers } from "react-icons/fi";
import { IoAddOutline } from "react-icons/io5";
import {
  collection,
  query,
  where,
  onSnapshot,
  Timestamp,
  orderBy,
  limit,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress"
import { useUser } from '@/context/userContext';
import { AiOutlineScan } from "react-icons/ai";
import Link from 'next/link';
import { MdNotificationsNone } from 'react-icons/md';

const Dash = ({ setSelectedView }) => {

  const [stats, setStats] = useState({
    totalEvents: 0,
    activeAnnouncements: 0,
    totalRsvps: 0,
    totalUsers: 0,
  });
  const { user, loading } = useUser();
  const [issues, setIssues] = useState([])

  useEffect(() => {
    if (!user) return;

    const issuesRef = collection(db, "issues");

    const q = query(
      issuesRef,
      orderBy("created_at", "desc"),
      limit(10)
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
      }
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    const unsubscribes = [];

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startTimestamp = Timestamp.fromDate(startOfMonth);

    // 🔁 Events this month
    const eventsQuery = query(
      collection(db, "events"),
      where("createdAt", ">=", startTimestamp)
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

    // 🔁 Active Announcements
    // const annQuery = query(
    //   collection(db, "announcements"),
    //   where("status", "==", "active")
    // );

    const unsubscribeAnnouncements = onSnapshot(collection(db, "announcements"), (snapshot) => {
      setStats((prev) => ({
        ...prev,
        activeAnnouncements: snapshot.size,
      }));
    });

    unsubscribes.push(unsubscribeAnnouncements);

    // 🔁 Users
    const unsubscribeUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      setStats((prev) => ({
        ...prev,
        totalUsers: snapshot.size,
      }));
    });

    unsubscribes.push(unsubscribeUsers);

    // Cleanup listeners on unmount
    return () => unsubscribes.forEach((unsub) => unsub());
  }, []);

  const unreadCount = 0;

  return (
    <div className='w-[84vw] min-h-screen h-fit flex flex-col justify-start items-center overflow-y-scroll'>
      <div className='flex gap-1 justify-between items-center w-full px-5 mt-6'>
        <div className='flex flex-col'>
          <h2 className='subtitle text-3xl'>Admin Dashboard</h2>
          <p className='contentText'>Manage your campus platform</p>
        </div>

        <div className='flex gap-4'>
          <button onClick = {() => {setSelectedView("Notifications")}} className='relative cursor-pointer btnText bg-indigo-600/20 hover:bg-indigo-700/30 text-gray-400 hover:text-white px-2 py-2 rounded-sm transition-all duration-200 ease-in-out flex justify-center items-center'>
            <MdNotificationsNone className='text-xl' />
            { unreadCount != 0 ? <div className={`absolute top-1 right-1 bg-green-500 h-2 w-2 rounded-full animate-pulse`}></div> : "" }
          </button>
          <Link href={"/Scanner"} className='relative cursor-pointer btnText bg-indigo-600/20 hover:bg-indigo-700/30 text-gray-400 hover:text-white px-2 py-2 rounded-sm transition-all duration-200 ease-in-out flex justify-center items-center'><AiOutlineScan className='text-lg' /></Link>
          <button onClick={() => { setSelectedView("PostEvent") }} className='cursor-pointer btnText bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-sm text-sm transition-all duration-200 ease-in-out flex justify-center items-center gap-2'><IoAddOutline className='text-lg' /> Add Event</button>
          <button onClick={() => { setSelectedView("PostAnnouncement") }} className='cursor-pointer btnText bg-indigo-600/30 hover:bg-indigo-600/50 px-4 py-2 rounded-sm text-sm transition-all duration-200 ease-in-out flex justify-center items-center gap-2'><IoAddOutline className='text-lg' /> New Announcement</button>
        </div>
      </div>

      <div className='flex gap-5 justify-center items-center w-full mt-5'>
        <div className='w-[23%] h-[135px] flex flex-col justify-center border border-gray-700 rounded-lg p-3 bg-[#020613]'>
          <div className='mb-5 flex justify-between pr-3'>
            <p className='contentText text-sm'>Pending Issues</p>
            <AiOutlineRise className='text-violet-600 text-xl' />
          </div>

          <p className='subtitle text-3xl mb-1 pl-2'>{stats.totalRsvps}</p>
          <p className='text-[#64748b] text-xs'><span className='text-green-500'>+5%</span> from last week</p>
        </div>

        <div className='w-[23%] h-[135px] flex flex-col justify-center border border-gray-700 rounded-lg p-3 bg-[#020613]'>
          <div className='mb-5 flex justify-between pr-3'>
            <p className='contentText text-sm'>Critical Issues</p>
            <FiUsers className='text-cyan-500 text-xl' />
          </div>

          <p className='subtitle text-3xl mb-1 pl-2'>{stats.totalUsers}</p>
          <p className='text-[#64748b] text-xs'><span className='text-green-500'>+5.2%</span> from last month</p>
        </div>

        <div className='w-[23%] h-[135px] flex flex-col justify-center border border-gray-700 rounded-lg p-3 bg-[#020613]'>
          <div className='mb-5 flex justify-between pr-3'>
            <p className='contentText text-sm'>Total Events This Month</p>
            <FaRegCalendar className='text-blue-600' />
          </div>

          <p className='subtitle text-3xl mb-1 pl-2'>{stats.totalEvents}</p>
          <p className='text-[#64748b] text-xs'><span className='text-green-500'>+12%</span> from last month</p>
        </div>

        <div className='w-[23%] h-[135px] flex flex-col justify-center border border-gray-700 rounded-lg p-3 bg-[#020613]'>
          <div className='mb-5 flex justify-between pr-3'>
            <p className='contentText text-sm'>Active Announcements</p>
            <CiChat1 className='text-green-500 text-xl' />
          </div>

          <p className='subtitle text-3xl mb-1 pl-2'>{stats.activeAnnouncements}</p>
          <p className='text-[#64748b] text-xs'><span className='text-green-500'>+3%</span> from last month</p>
        </div>
      </div>

      <div className='w-full min-h-[400px] h-fit flex justify-between items-center gap-4 mt-8 pr-5'>
        <div className='flex flex-col justify-center items-center gap-[1.18rem] w-[60%] h-full mx-6 px-4 py-6'>
          <div className='w-full flex justify-center items-center gap-1 contentText'>
            <p className='text-sm mr-4 w-[65%]'>Academic</p>
            <Progress value={35} className='bg-gray-900' />
            <p className='text-md ml-2'>35</p>
          </div>

          <div className='w-full flex justify-center items-center gap-1 contentText'>
            <p className='text-sm mr-4 w-[65%]'>Faculty / Department</p>
            <Progress value={56} className='bg-gray-900' />
            <p className='text-md ml-2'>56</p>
          </div>

          <div className='w-full flex justify-center items-center gap-1 contentText'>
            <p className='text-sm mr-4 w-[65%]'>Examination / Assessment</p>
            <Progress value={68} className='bg-gray-900' />
            <p className='text-md ml-2'>68</p>
          </div>

          <div className='w-full flex justify-center items-center gap-1 contentText'>
            <p className='text-sm mr-4 w-[65%]'>Administrative / Office</p>
            <Progress value={19} className='bg-gray-900' />
            <p className='text-md ml-2'>19</p>
          </div>

          <div className='w-full flex justify-center items-center gap-1 contentText'>
            <p className='text-sm mr-4 w-[65%]'>Hostel & Accomodation</p>
            <Progress value={26} className='bg-gray-900' />
            <p className='text-md ml-2'>26</p>
          </div>

          <div className='w-full flex justify-center items-center gap-1 contentText'>
            <p className='text-sm mr-4 w-[65%]'>IT & Digital</p>
            <Progress value={126} className='bg-gray-900' />
            <p className='text-md ml-2'>126</p>
          </div>

          <div className='w-full flex justify-center items-center gap-1 contentText'>
            <p className='text-sm mr-4 w-[65%]'>Campus Facilities / Transport</p>
            <Progress value={83} className='bg-gray-900' />
            <p className='text-md ml-2'>83</p>
          </div>

          <div className='w-full flex justify-center items-center gap-1 contentText'>
            <p className='text-sm mr-4 w-[65%]'>Safety, Security & Discipline</p>
            <Progress value={72} className='bg-gray-900' />
            <p className='text-md ml-2'>72</p>
          </div>

          <div className='w-full flex justify-center items-center gap-1 contentText'>
            <p className='text-sm mr-4 w-[65%]'>Others</p>
            <Progress value={46} className='bg-gray-900' />
            <p className='text-md ml-2'>46</p>
          </div>
        </div>

        <div className='w-[40%] h-[400px] overflow-y-scroll rounded-xl bg-[#020613] border px-2 border-gray-800'>
          <div className='flex justify-between items-center mb-1 px-4 py-4'>
            <h2 className='subtitle'>Latest Issues</h2>
            <button onClick={() => { setSelectedView("AllIssues") }} className='cursor-pointer btnText bg-indigo-600/20 hover:bg-indigo-600/30 px-3 py-2 rounded-sm text-xs transition-all duration-200 ease-in-out flex justify-center items-center gap-2'>View All</button>
          </div>

          <div className='flex flex-col justify-center items-center px-0 gap-1'>
            {issues.map((issue) => (
              <div key={issue.id} className='relative w-full flex-col border border-gray-800/60 cursor-pointer hover:bg-[#020818] rounded-sm px-5 py-2'>
                <h3 className='text-base'>{issue.title}</h3>
                <div className='flex gap-1 text-xs text-[#64748b]'>
                  <p>
                    {
                      issue.category_id === "CAT001" ? "Academic" :
                        issue.category_id === "CAT002" ? "Faculty/Department" :
                          issue.category_id === "CAT003" ? "Education & Assessment" :
                            issue.category_id === "CAT004" ? "Administrative/Office" :
                              issue.category_id === "CAT005" ? "Hostel/Accomodation" :
                                issue.category_id === "CAT006" ? "IT & Digital" :
                                  issue.category_id === "CAT007" ? "Campus Facilities/Transport" :
                                    issue.category_id === "CAT008" ? "Safety, Security & Discipline" :
                                      issue.category_id === "CAT009" ? "Others" : ""
                    }
                  </p>
                  <span>•</span>
                  <p>{issue.upvotes} Upvotes</p>
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
      </div>
    </div>
  )
}

export default Dash
