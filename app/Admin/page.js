"use client"
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
} from "@/components/ui/sidebar";
import React, { useState, useEffect } from 'react'
import { MdOutlineDashboard } from "react-icons/md";
import { IoIosCalendar } from "react-icons/io";
import { MdOutlineChatBubbleOutline } from "react-icons/md";
import { GoPeople } from "react-icons/go";
import { IoSettingsOutline } from "react-icons/io5";
import { RiHome3Line } from "react-icons/ri";
import { IoIosLogOut } from "react-icons/io";
import Link from "next/link";
import Dash from "@/components/Dash";
import Events from "@/components/Events";
import Announcements from "@/components/Announcements";
import Users from "@/components/Users";
import Settings from "@/components/Settings";
import PostAnnouncement from "@/components/PostAnnouncement";
import PostEvent from "@/components/PostEvent";
import { useUser } from "@/context/userContext";
import { useRouter } from "next/navigation";

const Page = () => {

  const [selectedView, setSelectedView] = useState("Dash")
  const { user, userData, login, logout, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/auth/Login");
      } else if (userData?.role === "Student") {
        router.push("/");
      }
    }
  }, [loading, user, userData]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
    router.refresh;
  };

  if (loading || !userData) return <div className="h-screen flex items-center justify-center title text-3xl">Authenticating...</div>;

  const links = [
    { href: "/Admin", view: "Dash", label: "Dashboard", icon: <MdOutlineDashboard /> },
    { href: "/Admin", view: "Events", label: "Events", icon: <IoIosCalendar /> },
    { href: "/Admin", view: "Announcements", label: "Anouncements", icon: <MdOutlineChatBubbleOutline /> },
    { href: "/Admin", view: "Users", label: "Users", icon: <GoPeople /> },
    { href: "/Admin", view: "Settings", label: "Settings", icon: <IoSettingsOutline /> },
  ];

  const home = { href: "/", label: "Back to Campus", icon: <RiHome3Line /> };
  const Logout = { href: "/", label: "Logout", icon: <IoIosLogOut /> };

  return (
    <Sidebar>
      <SidebarBody className="flex flex-col justify-between">
        <div>
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

          <hr className="my-4" />

          <Link href={"/"}><SidebarLink key={home.href} link={home} /></Link>
          <SidebarLink key={Logout.href} link={Logout} onClick={handleLogout} />
        </div>

        <div className="relative bg-cyan-800/40 border border-cyan-800 rounded-md px-0 py-2 flex flex-col justify-center items-center gap-1">
          <img src={userData?.profilePic} alt={userData?.name} className="rounded-full w-20 h-20" />

          <div className="flex flex-col gap-0 justify-center items-center w-full">
            <p className="text-base navText">{userData?.name}</p>
            <p className="text-xs contentText text-wrap w-full text-center">{userData?.email.length>25 ? userData?.email.slice(0,25)+"..." : userData?.email}</p>
          </div>

          {userData?.role === "Admin" && <p className="absolute top-[-30px] left-2 text-xs text-purple-600 bg-purple-600/20 border border-purple-800 px-2 py-1 rounded-full navText">Admin</p>}
          {userData?.role === "Faculty" && <p className="absolute top-[-30px] left-2 text-xs text-indigo-600 bg-indigo-600/20 border border-indigo-800 px-2 py-1 rounded-full navText">Faculty</p>}
          {userData?.role === "Student Club" && <p className="absolute top-[-30px] left-2 text-xs text-yellow-600 bg-yellow-600/20 border border-yellow-800 px-2 py-1 rounded-full navText">Student Club</p>}
        </div>
      </SidebarBody>

      <div className="min-h-[100vh] w-[84vw] overflow-x-hidden fixed right-0 h-fit flex justify-center items-center">
        {selectedView === "Dash" && <Dash setSelectedView={setSelectedView} />}
        {selectedView === "Events" && <Events setSelectedView={setSelectedView} />}
        {selectedView === "Announcements" && <Announcements setSelectedView={setSelectedView} />}
        {selectedView === "Users" && <Users />}
        {selectedView === "Settings" && <Settings />}
        {selectedView === "PostAnnouncement" && <PostAnnouncement />}
        {selectedView === "PostEvent" && <PostEvent />}
      </div>
    </Sidebar>
  )
}

export default Page
