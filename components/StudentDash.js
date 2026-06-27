"use client"
import React from 'react'
import { FaRegCalendar } from "react-icons/fa6";
import { CiChat1 } from "react-icons/ci";
import { FiUsers, FiArrowUpRight, FiSearch, FiShield, FiClock, FiBookmark, FiTrendingUp } from "react-icons/fi";
import { IoAddOutline } from "react-icons/io5";
import { MdNotificationsNone } from "react-icons/md";
import {
  collection,
  query,
  onSnapshot,
  limit,
  orderBy,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { useUser } from '@/context/userContext';
import { useNotificationStore } from '@/store/notificationStore';
import { IoSparklesSharp } from "react-icons/io5";
import { HiOutlineAcademicCap } from "react-icons/hi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { PiExam } from "react-icons/pi";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { MdOutlineHotel } from "react-icons/md";
import { PiNetworkFill } from "react-icons/pi";
import { MdOutlineMiscellaneousServices } from "react-icons/md";
import { MdOutlineSecurity } from "react-icons/md";
import { AiOutlineIssuesClose } from "react-icons/ai";
import { GoDotFill } from "react-icons/go";
import { cn } from '@/lib/utils';

const StudentDash = ({ setSelectedView }) => {
  const { user, userData } = useUser();
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [issues, setIssues] = useState([]);
  const [greeting, setGreeting] = useState(null);

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

        const data = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events: ", err);
      }
    };

    fetchMyEvents();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "issues"),
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
      }
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    const unsubscribes = [];

    const unsubscribeEvents = onSnapshot(collection(db, "events"), (snapshot) => {
      setStats((prev) => ({
        ...prev,
        totalEvents: snapshot.size,
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

    const unsubscribeAnnouncements = onSnapshot(collection(db, "announcements"), (snapshot) => {
      setStats((prev) => ({
        ...prev,
        activeAnnouncements: snapshot.size,
      }));
    });

    unsubscribes.push(unsubscribeAnnouncements);

    const unsubscribeIssues = onSnapshot(collection(db, "issues"), (snapshot) => {
      setStats((prev) => ({
        ...prev,
        totalIssuesResolved: snapshot.size,
      }));
    });

    unsubscribes.push(unsubscribeIssues);

    return () => unsubscribes.forEach((unsub) => unsub());
  }, []);

  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const firstName = userData?.name?.split(" ")?.[0] || 'Student';

  const categories = [
    { id: "CAT001", name: "Academic", icon: HiOutlineAcademicCap, color: "text-blue-500", bg: "bg-blue-100" },
    { id: "CAT002", name: "Faculty / Department", icon: FaChalkboardTeacher, color: "text-cyan-500", bg: "bg-cyan-100" },
    { id: "CAT003", name: "Examination & Assessment", icon: PiExam, color: "text-amber-500", bg: "bg-amber-100" },
    { id: "CAT004", name: "Administrative / Office", icon: MdOutlineAdminPanelSettings, color: "text-emerald-500", bg: "bg-emerald-100" },
    { id: "CAT005", name: "Hostel & Accomodation", icon: MdOutlineHotel, color: "text-red-500", bg: "bg-red-100" },
    { id: "CAT006", name: "IT & Digital", icon: PiNetworkFill, color: "text-teal-500", bg: "bg-teal-100" },
    { id: "CAT007", name: "Campus Facilities / Transport", icon: MdOutlineMiscellaneousServices, color: "text-purple-500", bg: "bg-purple-100" },
    { id: "CAT008", name: "Safety, Security & Discipline", icon: MdOutlineSecurity, color: "text-pink-500", bg: "bg-pink-100" },
    { id: "CAT009", name: "Others", icon: AiOutlineIssuesClose, color: "text-indigo-500", bg: "bg-indigo-100" },
  ];

  const priorityTone = {
    critical: 'text-red-400 border-red-500/20 bg-red-500/10',
    high: 'text-orange-300 border-orange-500/20 bg-orange-500/10',
    medium: 'text-yellow-300 border-yellow-500/20 bg-yellow-500/10',
    low: 'text-emerald-300 border-emerald-500/20 bg-emerald-500/10',
  };

  const announcementTone = {
    High: 'text-red-300 border-red-500/20 bg-red-500/10',
    Medium: 'text-yellow-300 border-yellow-500/20 bg-yellow-500/10',
    Low: 'text-emerald-300 border-emerald-500/20 bg-emerald-500/10',
  };

  const formatDate = (value) => {
    if (!value?.toDate) return 'Recently updated';

    return new Date(value.toDate()).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const categoryLabel = (categoryId) => {
    const categories = {
      CAT001: 'Academic',
      CAT002: 'Faculty / Department',
      CAT003: 'Education & Assessment',
      CAT004: 'Administrative / Office',
      CAT005: 'Hostel / Accommodation',
      CAT006: 'IT & Digital',
      CAT007: 'Campus Facilities / Transport',
      CAT008: 'Safety, Security & Discipline',
      CAT009: 'Others',
    };

    return categories[categoryId] || 'Campus Support';
  };

  const recentNotifications = [
    {
      title: 'Your issue "WiFi Connection in Hostel" was updated',
      time: '10m ago',
      tone: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'New announcement: Internal Hackathon 2025',
      time: '1h ago',
      tone: 'text-amber-300 bg-amber-500/10 border-amber-500/20',
    },
    {
      title: 'Reminder: InnovateX starts tomorrow',
      time: '3h ago',
      tone: 'text-sky-300 bg-sky-500/10 border-sky-500/20',
    },
    {
      title: 'Faculty replied to your recent comment',
      time: '5h ago',
      tone: 'text-violet-300 bg-violet-500/10 border-violet-500/20',
    },
  ];

  useEffect(() => {
    const hour = new Date().getHours();

    if (hour >= 0 && hour < 12) {
      setGreeting('Good Morning');
    } else if (hour >= 12 && hour < 17) {
      setGreeting('Good Afternoon');
    } else if (hour >= 17 && hour < 21) {
      setGreeting('Good Evening');
    } else {
      setGreeting('Good Night');
    }
  }, []);

  return (
    <div className='relative w-full h-screen overflow-hidden text-white'>
      <div className='relative w-full bg-slate-950/70 shadow-[0_24px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl overflow-y-scroll h-screen'>
        <div className='flex flex-col gap-4 p-5 lg:p-6'>
          <div className='flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between'>
            <div className='space-y-1'>
              <div>
                <h2 className='subtitle text-3xl md:text-4xl'>{greeting}, {firstName}</h2>
                <p className='contentText mt-1 max-w-2xl text-sm md:text-base text-slate-400'>
                  Here&apos;s what&apos;s happening in your campus today.
                </p>
              </div>
            </div>

            <div className='flex flex-wrap items-center gap-3'>
              <button onClick={() => { setSelectedView("Notifications") }} className='relative flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-slate-300 transition-all duration-200 hover:border-sky-500/40 hover:text-white'>
                <MdNotificationsNone className='text-xl' />
                {unreadCount != 0 ? <span className='absolute right-2 top-2 h-2 w-2 rounded-full bg-green-500 animate-pulse' /> : null}
              </button>

              <button onClick={() => { setSelectedView("LogIssue") }} className='flex cursor-pointer items-center gap-2 rounded-lg bg-linear-to-r from-indigo-600 to-cyan-600 px-4 py-3 text-sm font-medium transition-all duration-200 hover:opacity-90'>
                <IoAddOutline className='text-lg' />
                Report Issue
              </button>

              <button onClick={() => { setSelectedView("EventList") }} className='hidden md:flex cursor-pointer items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-slate-300 transition-all duration-200 hover:border-slate-600 hover:text-white'>
                <FaRegCalendar className='text-base' />
                Browse Events
              </button>

              <button className='hidden lg:flex cursor-pointer items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/5 px-4 py-3 text-sm text-cyan-300 transition-all duration-200 hover:bg-cyan-500/15'>
                <IoSparklesSharp className='text-lg' />
                Ask Campus AI
              </button>
            </div>
          </div>

          <div className='grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4'>
            <div className='h-fit rounded-2xl border border-slate-800 bg-[#020613] px-4 py-6 shadow-lg shadow-sky-950/10'>
              <div className='flex items-center justify-between gap-3'>
                <div>
                  <p className='text-xs uppercase tracking-[0.2em] text-slate-500'>Issues awaiting updates</p>
                  <div className='mt-2 flex items-end gap-2'>
                    <span className='text-3xl font-semibold'>{issues.length || 2}</span>
                    <span className='text-sm text-slate-400'>Issues awaiting updates</span>
                  </div>
                </div>
                <div className='rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-3 text-cyan-300'>
                  <FiTrendingUp className='text-xl' />
                </div>
              </div>
            </div>

            <div className='h-fit rounded-2xl border border-slate-800 bg-[#020613] px-4 py-6 shadow-lg shadow-emerald-950/10'>
              <div className='flex items-center justify-between gap-3'>
                <div>
                  <p className='text-xs uppercase tracking-[0.2em] text-slate-500'>Events this week</p>
                  <div className='mt-2 flex items-end gap-2'>
                    <span className='text-3xl font-semibold'>{stats.totalEvents}</span>
                    <span className='text-sm text-slate-400'>Events this week</span>
                  </div>
                </div>
                <div className='rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-emerald-300'>
                  <FaRegCalendar className='text-xl' />
                </div>
              </div>
            </div>

            <div className='h-fit rounded-2xl border border-slate-800 bg-[#020613] px-4 py-6 shadow-lg shadow-amber-950/10'>
              <div className='flex items-center justify-between gap-3'>
                <div>
                  <p className='text-xs uppercase tracking-[0.2em] text-slate-500'>New announcement</p>
                  <div className='mt-2 flex items-end gap-2'>
                    <span className='text-3xl font-semibold'>{stats.activeAnnouncements}</span>
                    <span className='text-sm text-slate-400'>New announcement</span>
                  </div>
                </div>
                <div className='rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3 text-amber-300'>
                  <CiChat1 className='text-xl' />
                </div>
              </div>
            </div>

            <div className='h-fit rounded-2xl border border-slate-800 bg-[#020613] px-4 py-6 shadow-lg shadow-violet-950/10'>
              <div className='flex items-center justify-between gap-3'>
                <div>
                  <p className='text-xs uppercase tracking-[0.2em] text-slate-500'>Issues resolved</p>
                  <div className='mt-2 flex items-end gap-2'>
                    <span className='text-3xl font-semibold'>{stats.totalIssuesResolved}</span>
                    <span className='text-sm text-slate-400'>Issues resolved this month</span>
                  </div>
                </div>
                <div className='rounded-2xl border border-violet-500/20 bg-violet-500/10 p-3 text-violet-300'>
                  <FiUsers className='text-xl' />
                </div>
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 gap-4 xl:grid-cols-[1.45fr_0.95fr]'>
            <div className='space-y-4'>
              <section className='rounded-2xl border border-slate-800 bg-[#020613] p-5'>
                <div className='flex items-center justify-between gap-3'>
                  <div>
                    <h3 className='subtitle text-xl'>My Open Requests</h3>
                    <p className='text-sm text-slate-400'>Keep track of the things you asked the campus team to fix.</p>
                  </div>
                  <button onClick={() => { setSelectedView("AllIssues") }} className='text-sm text-indigo-300 hover:text-indigo-200'>View All</button>
                </div>

                <div className='mt-4 space-y-2'>
                  {issues.length ? issues.slice(0, 3).map((issue) => {
                    const category = categories.find((cat) => cat.id === issue.category_id) ?? categories[categories.length - 1];
                    return (
                    <div key={issue.id} className='rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-2 transition-all hover:border-slate-700 hover:bg-slate-900'>
                      <div className='flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
                        <div
                          className={cn(
                            "h-16 w-16 rounded-xl flex items-center justify-center",
                            category.bg,
                          )}
                        >
                          <category.icon className={cn("h-8 w-8", category.color)} />
                        </div>
                        <div className='space-y-2 w-[70%]'>
                          <div className='flex flex-wrap items-center gap-2'>
                            <span className='text-base font-semibold'>{issue.title}</span>
                            <span className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${priorityTone[issue.priority] || 'text-slate-300 border-slate-700 bg-slate-800/70'}`}>
                              {issue.priority ? issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1) : 'Open'}
                            </span>
                          </div>
                          <div className='flex flex-wrap items-center gap-2 text-xs text-slate-400'>
                            <span>{categoryLabel(issue.category_id)}</span>
                            <span>•</span>
                            <span>{issue.upvotes || 0} upvotes</span>
                            <span>•</span>
                            <span>Reported {formatDate(issue.created_at)}</span>
                          </div>
                        </div>
                        <div className='rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2 text-xs text-slate-400'>
                          <div className='flex items-center gap-2 text-sky-300'>
                            <FiClock />
                            In progress
                          </div>
                          <p className='mt-1'>Last update</p>
                          <p className='mt-1'>Today, 09:15 AM</p>
                        </div>
                      </div>
                    </div>
                  )}) : (
                    <div className='rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-6 text-sm text-slate-400'>
                      No open requests yet. This space is reserved for live issue cards.
                    </div>
                  )}
                </div>

                <div className='mt-4 flex items-center justify-between rounded-2xl border border-indigo-500/20 bg-linear-to-r from-indigo-500/10 to-violet-500/10 px-4 py-4'>
                  <div>
                    <p className='text-sm font-medium text-white'>We&apos;re on it! Your issues are important to us.</p>
                    <p className='text-xs text-slate-400'>Track progress and get notified on every update.</p>
                  </div>
                  <button onClick={() => { setSelectedView("LogIssue") }} className='rounded-xl border border-indigo-400/50 bg-transparent px-4 py-2 text-sm text-indigo-200 transition hover:bg-indigo-500/10'>
                    Report New Issue
                  </button>
                </div>
              </section>

              <section className='grid grid-cols-1 w-full'>
                <div className='w-full! rounded-2xl border border-slate-800 bg-[#020613] p-5'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <h3 className='subtitle text-xl'>Latest Announcements</h3>
                      <p className='text-sm text-slate-400'>Important updates from campus teams and departments.</p>
                    </div>
                    <button onClick={() => { setSelectedView("Announcements") }} className='text-sm text-indigo-300 hover:text-indigo-200'>View All</button>
                  </div>

                  <div className='mt-4 space-y-3'>
                    {announcements.length ? announcements.slice(0, 3).map((announcement) => (
                      <div key={announcement.id} className=' relative rounded-2xl border border-slate-800 bg-slate-900/60 p-4'>
                        <div className='flex flex-wrap items-center gap-2'>
                          <h4 className='font-medium'>{announcement.title}</h4>
                          <div className='absolute top-1 right-2 flex justify-center items-center gap-1'>
                            <span className='border border-gray-700 contentText py-0.5 px-2 rounded-lg !text-[11px] bg-indigo-600/70'>{announcement.targetAudience || 'All students'}</span>
                            {announcement.priority ? <span className={`rounded-full flex justify-center items-center border px-2 py-0.5 text-[11px] ${announcementTone[announcement.priority] || 'text-slate-300 border-slate-700 bg-slate-800/70'}`}>{announcement.priority} Priority</span> : null}
                          </div>
                        </div>
                        <p className='mt-2 text-xs text-slate-400 flex gap-1 justify-start items-center'>
                          {announcement.createdBy?.name} <GoDotFill /> <span className='border border-gray-700 py-[0.15rem] px-2 rounded-lg'>{announcement.createdBy?.role}</span> <GoDotFill /> {formatDate(announcement.createdAt)}
                        </p>
                      </div>
                    )) : (
                      <div className='rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-5 text-sm text-slate-400'>
                        Latest announcements will appear here.
                      </div>
                    )}
                  </div>
                </div>
              </section>
            </div>

            <div className='space-y-4'>
              <div className='rounded-2xl border border-slate-800 bg-[#020613] p-5'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <h3 className='subtitle text-xl'>Campus Pulse</h3>
                      <p className='text-sm text-slate-400'>Quick highlights and community signals.</p>
                    </div>
                    <FiBookmark className='text-slate-500' />
                  </div>

                  <div className='mt-4 grid grid-cols-2 gap-3'>
                    <div className='rounded-2xl border border-slate-800 bg-slate-900/60 p-4'>
                      <p className='text-xs uppercase tracking-[0.2em] text-slate-500'>Trending Issue</p>
                      <p className='mt-2 text-xl font-semibold'>InnovateX</p>
                      <p className='mt-1 text-xs text-slate-400'>120+ interested</p>
                    </div>
                    <div className='rounded-2xl border border-slate-800 bg-slate-900/60 p-4'>
                      <p className='text-xs uppercase tracking-[0.2em] text-slate-500'>Top Event</p>
                      <p className='mt-2 text-xl font-semibold'>Robotics</p>
                      <p className='mt-1 text-xs text-slate-400'>24 new members</p>
                    </div>
                    <div className='rounded-2xl border border-slate-800 bg-slate-900/60 p-4'>
                      <p className='text-xs uppercase tracking-[0.2em] text-slate-500'>Issues resolved</p>
                      <p className='mt-2 text-xl font-semibold'>{stats.totalIssuesResolved}</p>
                      <p className='mt-1 text-xs text-emerald-300'>+12% from yesterday</p>
                    </div>
                    <div className='rounded-2xl border border-slate-800 bg-slate-900/60 p-4'>
                      <p className='text-xs uppercase tracking-[0.2em] text-slate-500'>Latest Announcement</p>
                      <p className='mt-2 text-xl font-semibold'>Hackathon</p>
                      <p className='mt-1 text-xs text-slate-400'>34 new replies</p>
                    </div>
                  </div>
                </div>

              <section className='rounded-2xl border border-slate-800 bg-[#020613] p-5'>
                <div className='flex items-center justify-between'>
                  <div>
                    <h3 className='subtitle text-xl'>Upcoming Events</h3>
                    <p className='text-sm text-slate-400'>What you can RSVP to next.</p>
                  </div>
                  <button onClick={() => { setSelectedView("EventList") }} className='text-sm text-indigo-300 hover:text-indigo-200'>View All</button>
                </div>

                <div className='mt-4 space-y-3'>
                  {events.length ? events.slice(0, 3).map((event) => (
                    <div key={event.id} className='rounded-2xl border border-slate-800 bg-slate-900/60 p-4'>
                      <div className='flex items-between justify-start gap-3'>
                        <div className='flex flex-col justify-center items-center text-xs border border-gray-700 bg-slate-950/60 px-3 py-1 rounded-lg'>
                          <span className='text-[11px] uppercase tracking-[0.2em] font-semibold text-indigo-500'>{new Date(event.startDate?.toDate?.() || Date.now()).toLocaleString("en-GB", { month: 'short' }).toUpperCase()}</span>
                          <span className='text-2xl font-bold'>{new Date(event.startDate?.toDate?.() || Date.now()).getDate()}</span>
                        </div>

                        <div className='flex flex-col justify-center items-start'>
                          <h4 className='mt-2 font-medium'>{event.name}</h4>
                          <p className='mt-1 text-xs text-slate-400'>{formatDate(event.startDate)} • {event.venue || 'Innovation Lab'}</p>
                        </div>
                      </div>

                      <div className='mt-3 flex items-center justify-between'>
                        <div className='text-xs text-slate-400'>120 going</div>
                        <button className='rounded-lg bg-linear-to-r from-indigo-600 to-cyan-600 px-4 py-2 text-xs font-medium text-white'>RSVP</button>
                      </div>
                    </div>
                  )) : (
                    <div className='rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-5 text-sm text-slate-400'>
                      Upcoming event cards will appear here.
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDash
