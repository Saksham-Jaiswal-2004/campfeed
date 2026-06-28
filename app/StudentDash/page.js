"use client"
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
} from "@/components/ui/sidebar";
import React, { useState, useEffect } from 'react'
import { MdOutlineDashboard } from "react-icons/md";
import { IoIosCalendar } from "react-icons/io";
import { TbMessageReport } from "react-icons/tb";
import { MdOutlineChatBubbleOutline } from "react-icons/md";
import { GoPeople } from "react-icons/go";
import { IoSettingsOutline, IoSparklesSharp } from "react-icons/io5";
import { RiHome3Line } from "react-icons/ri";
import { MdNotificationsNone } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import Link from "next/link";
import Events from "@/components/Events";
import Announcements from "@/components/Announcements";
import Users from "@/components/Users";
import Settings from "@/components/Settings";
import PostAnnouncement from "@/components/PostAnnouncement";
import PostEvent from "@/components/PostEvent";
import { useUser } from "@/context/userContext";
import { useRouter } from "next/navigation";
import StudentDash from "@/components/StudentDash";
import UpcomingEvents from "@/components/UpcomingEvents";
import EventsList from "@/components/EventsList";
import AnnouncementList from "@/components/AnnouncementList";
import Notifications from "@/components/Notification";
import { LiaUniversitySolid } from "react-icons/lia";
import UserIssues from "@/components/UserIssues";
import CampusIssues from "@/components/CampusIssues";
import LogIssue from "@/components/LogIssue";
import EventPage from "@/components/EventPage";
import AnnouncementPage from "@/components/AnnouncementPage";
import IssuePage from "@/components/IssuePage";
import CampusIssuePage from "@/components/CampusIssuePage";
import { BsBookmarks } from "react-icons/bs";
import { LuTickets } from "react-icons/lu";
import { BiExpandVertical } from "react-icons/bi";
import Tickets from "@/components/Tickets";
import Loader from "@/components/ui/Loader";
import { toast } from "sonner"

const Page = () => {

  const [selectedView, setSelectedView] = useState("StudentDash")
  const [selectedId, setSelectedId] = useState()
  const { user, userData, login, logout, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/auth/Login");
        toast.warning("Login to access Dashboard")
      }
    }
  }, [loading, user, userData, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
    router.refresh;
  };

  if (loading || !userData) return <Loader />;

  const links = [
    { href: "/StudentDash", view: "StudentDash", label: "Dashboard", icon: <MdOutlineDashboard /> },
    { href: "/StudentDash", view: "UserIssues", label: "My Issues", icon: <TbMessageReport /> },
    { href: "/StudentDash", view: "Tickets", label: "My Tickets", icon: <LuTickets /> },
    { href: "/StudentDash", view: "Notifications", label: "Notifications", icon: <MdNotificationsNone /> },
    // { href: "/StudentDash", view: "Settings", label: "Settings", icon: <IoSettingsOutline /> },
  ];

  const links2 = [
    { href: "/StudentDash", view: "AllIssues", label: "Campus Issues", icon: <LiaUniversitySolid /> },
    { href: "/StudentDash", view: "EventList", label: "Events", icon: <IoIosCalendar /> },
    { href: "/StudentDash", view: "Announcements", label: "Anouncements", icon: <MdOutlineChatBubbleOutline /> },
  ];

  const links3 = [
    { href: "/Chatbot", view: "", label: "Campus AI", icon: <IoSparklesSharp /> },
  ];

  const home = { href: "/", label: "Back to Campus", icon: <RiHome3Line /> };
  const Logout = { href: "/", label: "Logout", icon: <IoIosLogOut /> };

  return (
    <Sidebar>
      <SidebarBody className="flex flex-col justify-between">
        <div className="px-5">
          <div className="logo cursor-pointer mb-5">
            <Link href={"/"} className='flex justify-center items-center gap-2'>
              <div className='h-8 w-8 rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-400 flex justify-center items-center'>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bot h-5 w-5 text-white"><path d="M12 8V4H8"></path><rect width="16" height="12" x="4" y="8" rx="2"></rect><path d="M2 14h2"></path><path d="M20 14h2"></path><path d="M15 13v2"></path><path d="M9 13v2"></path></svg>
              </div>
              <h1 className='text-2xl font-bold bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent'>CampFeed</h1>
            </Link>
          </div>

          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <SidebarLink key={link.view} link={link} onClick={() => { setSelectedView(link.view) }} />
            ))}
          </div>

          <hr className="my-4 border-gray-800" />

          <div className="flex flex-col gap-1">
            {links2.map((link) => (
              <SidebarLink key={link.view} link={link} onClick={() => { setSelectedView(link.view) }} />
            ))}
          </div>

          <hr className="my-4 border-gray-800" />

          <div className="flex flex-col gap-1">
            {links3.map((link) => (
              <SidebarLink key={link.view} href={link.href} link={link} onClick={() => { link.view !== "" ? setSelectedView(link.view) : "" }} />
            ))}
          </div>

          <hr className="my-4 border-gray-800" />

          <Link href={"/"}><SidebarLink key={home.href} link={home} /></Link>
          <SidebarLink key={Logout.href} link={Logout} onClick={handleLogout} />
        </div>

        <div className="relative w-full border-t border-t-gray-700 hover:bg-slate-900/40 transition-all ease-in-out duration-200 px-2 py-3 flex justify-between items-center gap-2 cursor-pointer">
          <div className="flex justify-center items-center gap-2">
            <img src={userData?.profilePic} alt={userData?.name} className="rounded-full w-10 h-10" />
            <p className="text-sm navText">{userData?.name.split(" ")[0].length <= 16 ? userData?.name.split(" ")[0] : userData.name.split(" ")[0].slice(0,14)+"..."}</p>
          </div>

          <BiExpandVertical className="w-[8%]" />

          {userData?.role === "Admin" && <p className="absolute top-[-30px] left-2 text-xs text-purple-600 bg-purple-600/20 border border-purple-800 px-2 py-1 rounded-full navText">Admin</p>}
          {userData?.role === "Faculty" && <p className="absolute top-[-30px] left-2 text-xs text-indigo-600 bg-indigo-600/20 border border-indigo-800 px-2 py-1 rounded-full navText">Faculty</p>}
          {userData?.role === "Student Club" && <p className="absolute top-[-30px] left-2 text-xs text-yellow-600 bg-yellow-600/20 border border-yellow-800 px-2 py-1 rounded-full navText">Student Club</p>}
        </div>
      </SidebarBody>

      <div className="min-h-screen h-fit overflow-y-scroll w-[86%] overflow-x-hidden fixed right-0 flex justify-center items-center">
        {selectedView === "StudentDash" && <StudentDash setSelectedView={setSelectedView} />}
        {selectedView === "UserIssues" && <UserIssues setSelectedView={setSelectedView} setSelectedId={setSelectedId} />}
        {selectedView === "AllIssues" && <CampusIssues setSelectedView={setSelectedView} setSelectedId={setSelectedId} />}
        {selectedView === "EventList" && <EventsList setSelectedView={setSelectedView} setSelectedId={setSelectedId} />}
        {selectedView === "Announcements" && <AnnouncementList  setSelectedView={setSelectedView} setSelectedId={setSelectedId} />}
        {selectedView === "Tickets" && <Tickets /> }
        {selectedView === "Notifications" && <Notifications />}
        {selectedView === "Users" && <Users />}
        {selectedView === "Settings" && <Settings />}
        {selectedView === "PostAnnouncement" && <PostAnnouncement />}
        {selectedView === "PostEvent" && <PostEvent />}
        {selectedView === "LogIssue" && <LogIssue setSelectedView={setSelectedView} />}
        {selectedView === "DetailedEvent" && <EventPage setSelectedView={setSelectedView} id={selectedId} /> }
        {selectedView === "DetailedIssue" && <IssuePage setSelectedView={setSelectedView} id={selectedId} /> }
        {selectedView === "DetailedCampusIssue" && <CampusIssuePage setSelectedView={setSelectedView} id={selectedId} /> }
        {selectedView === "DetailedAnnouncement" && <AnnouncementPage setSelectedView={setSelectedView} id={selectedId} /> }
      </div>
    </Sidebar>
  )
}

export default Page