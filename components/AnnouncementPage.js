import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { IoIosArrowForward } from "react-icons/io";
import { CgDanger } from "react-icons/cg";
import { MdOutlineInfo } from "react-icons/md";
import { FiCheckCircle } from "react-icons/fi";
import ShareButton from "@/components/ShareButton";
import { useEffect, useState } from "react";
import { CiBookmark } from "react-icons/ci";
import { PiWarningCircle } from "react-icons/pi";
import { api } from "@/lib/api";
import DataSkeleton from "./ui/DataSkeleton";
import { useAnnouncementStore } from "@/store/announcementStore";
import { announcementService } from "@/services/announcements.service";

export default function AnnouncementPage({setSelectedView, id}) {

    const announcement = useAnnouncementStore((s) => s.selectedAnnouncement)
    const loading = useAnnouncementStore((s) => s.loading)

    const [user, setUser] = useState(null);

    useEffect(() => {
      if (!id) return;
        try {
          announcementService.fetchAnnouncementById(id);
        } catch (err) {
          console.error(err);
          setUser(null);
        }
    }, []);
    
    if (!id) return <div className="h-screen w-screen flex justify-center items-center text-xl">Announcement ID not provided</div>;

    if (loading) return (
    <div className="w-[80%] h-full flex flex-col justify-center items-center gap-8">
      <DataSkeleton />
      <DataSkeleton />
    </div>
  );
    if (!announcement) return <p>Announcement not found</p>;

    return (
        <div className="w-full h-screen overflow-y-scroll flex flex-col justify-start items-center">

            <div className="flex flex-col justify-center items-center mt-8 px-4 py-8 w-[85%] h-fit">
                <p className="mb-2 text-xs contentText flex justify-start items-center gap-2 w-full">
                  <button onClick={() => {setSelectedView("StudentDash")}} className="hover:text-white">Dashboard</button>
                  <IoIosArrowForward />
                  <button onClick={() => {setSelectedView("Announcements")}} className="hover:text-white">Announcements</button>
                  <IoIosArrowForward />
                  <span className="!text-white !text-sm">{announcement.title || "Announcement"}</span>
                </p>

                <div className="flex justify-between items-center w-full my-4">
                    <div>
                        <h1 className="text-3xl title">{announcement.title}</h1>
                    </div>

                    <div className="flex justify-center items-center gap-2">
                        <ShareButton title={announcement.title} text={`Check out this Announcement: ${announcement.title}`} />

                        <button className="text-lg px-3 py-2 border border-gray-700 hover:bg-gray-700/20 rounded-md contentText transition-all duration-200 ease-in-out">
                          <CiBookmark />
                        </button>
                                                  
                        <button className="text-lg px-3 py-2 border border-gray-700 hover:bg-gray-700/20 rounded-md contentText transition-all duration-200 ease-in-out">
                          <PiWarningCircle />
                        </button>
                    </div>
                </div>

                <div className="flex gap-3 text-sm mt-2 flex-wrap w-full px-2">
                    {announcement.tags?.map((tag, index) => (
                        <p key={index} className="border border-gray-700 bg-cyan-500/50 contentText py-1 px-2 rounded-lg">
                            {tag}
                        </p>
                    ))}
                </div>

                <div className="w-full h-full flex justify-center items-start gap-4 my-4">
                    <div className="w-[68%] min-h-[75vh] h-fit border border-gray-700 rounded-md p-4">
                        <div className="flex gap-3 justify-start items-center px-2">
                            <div>
                                <img src={user?.profilePic} alt={user?.name} className="rounded-full w-15 h-15" />
                            </div>

                            <div className="w-full">
                                <div className="flex justify-between items-center w-full">
                                    <h3>{user?.username}</h3>
                                    <span className='border border-gray-700 contentText py-[0.15rem] px-2 rounded-lg !text-white !text-xs'>{user?.role}</span>
                                </div>
                                <p className="text-xs contentText">{user?.email}</p>
                            </div>
                        </div>

                        <hr className="border border-gray-800 my-4" />

                        <p className="px-4 contentText text-sm">{announcement.description}</p>
                    </div>

                    <div className="flex flex-col justify-center items-center gap-4 w-[30%]">
                        <div className="w-full h-fit min-h-[50vh] border border-gray-700 rounded-md p-4">
                            <h2 className="subtitle text-base">Announcement Details</h2>

                            <div className="w-full flex flex-col gap-5 items-start pl-6 mt-4">
                                <div className="flex flex-col justify-center items-start gap-0">
                                    <p className="!text-gray-500 contentText text-base">Priority</p>
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

                                <div className="flex flex-col justify-center items-start gap-0">
                                    <p className="!text-gray-500 contentText text-base">Target Audience</p>
                                    <span className='border border-gray-700 contentText py-1 px-2 rounded-full !text-white bg-blue-400/70 text-sm'>{announcement.targetAudience}</span>
                                </div>

                                <div className="flex flex-col justify-center items-start gap-0">
                                    <p className="!text-gray-500 contentText text-base">Published On</p>
                                    <p className="flex contentText text-sm">{new Date(announcement.createdAt._seconds * 1000).toLocaleString("en-GB", {
                                        weekday: "long",
                                        day: "2-digit",
                                        month: "long",
                                        year: "numeric",
                                    })} at {new Date(announcement.createdAt._seconds * 1000).toLocaleString("en-GB", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                    })}</p>
                                </div>
                            </div>
                        </div>

                        <div className="w-full h-fit min-h-[22vh] border border-gray-700 rounded-md p-4 flex justify-center items-center">
                            {/* <h2 className="subtitle text-base">Related</h2> */}

                            <div className="w-full h-[10vh] flex flex-col justify-center items-center gap-1">
                                <button className="px-4 py-2 w-full contentText text-sm rounded-sm hover:bg-gray-600/20 border border-gray-700 disabled:opacity-50" onClick={() => {setSelectedView("Announcements")}}>View All Announcements</button>
                                <button className="px-4 py-2 w-full contentText text-sm rounded-sm hover:bg-gray-600/20 border border-gray-700 disabled:opacity-50" onClick={() => {setSelectedView("EventList")}}>Explore Events</button>
                                <button className="px-4 py-2 w-full contentText text-sm rounded-sm hover:bg-gray-600/20 border border-gray-700 disabled:opacity-50" onClick={() => {setSelectedView("LogIssue")}}>Report an Issue</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}