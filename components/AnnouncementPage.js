import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import { SlClock } from "react-icons/sl";
import Link from "next/link";
import { IoIosArrowForward } from "react-icons/io";
import { CgDanger } from "react-icons/cg";
import { MdOutlineInfo } from "react-icons/md";
import { FiCheckCircle } from "react-icons/fi";
import ShareButton from "@/components/ShareButton";
import { useEffect, useState } from "react";

export default function AnnouncementPage({setSelectedView, id}) {

    const [data, setData] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (!id) return;

      const fetchAnnouncement = async () => {
        try {
          const docRef = doc(db, "announcements", id);
          const snap = await getDoc(docRef);
  
          if (!snap.exists()) {
            setData(null);
            return;
          }
  
          const announcementData = snap.data();
          setData(announcementData);
  
          if (announcementData?.createdBy) {
            try {
              const userSnap = await getDoc(doc(db, "users", announcementData.createdBy));
              if (userSnap.exists()) {
                setUser(userSnap.data());
              }
            } catch (err) {
              console.error(err);
            }
          }
        } catch (err) {
          console.error(err);
          setData(null);
          setUser(null);
        } finally {
          setLoading(false);
        }
      };

      fetchAnnouncement();
    }, [id]);
    
    if (!id) return <div className="h-screen w-screen flex justify-center items-center text-xl">Announcement ID not provided</div>;

    if (loading) return <p>Loading...</p>;
    if (!data) return <p>Announcement not found</p>;

    return (
        <div className="w-full h-screen overflow-y-scroll flex flex-col justify-start items-center">

            <div className="flex flex-col justify-center items-center mt-8 px-4 py-8 w-[85%] h-fit">
                <p className="mb-2 text-xs contentText flex justify-start items-center gap-2 w-full">
                  <button onClick={() => {setSelectedView("StudentDash")}} className="hover:text-white">Dashboard</button>
                  <IoIosArrowForward />
                  <button onClick={() => {setSelectedView("Announcements")}} className="hover:text-white">Announcements</button>
                  <IoIosArrowForward />
                  <span className="!text-white !text-sm">{data.title || "Announcement"}</span>
                </p>

                <div className="flex justify-between items-center w-full my-4">
                    <div>
                        <h1 className="text-3xl title">{data.title}</h1>
                    </div>

                    <div>
                        <ShareButton title={data.name} text={`Check out this Announcement: ${data.name}`} />
                    </div>
                </div>

                <div className="flex gap-3 text-sm mt-2 flex-wrap w-full px-2">
                    {data.tags?.map((tag, index) => (
                        <p key={index} className="border border-gray-700 bg-cyan-500/50 contentText py-1 px-2 rounded-lg">
                            {tag}
                        </p>
                    ))}
                </div>

                <div className="w-full h-full flex justify-center items-start gap-4 my-4">
                    <div className="w-[68%] min-h-[75vh] h-fit border border-gray-700 rounded-md p-4">
                        <div className="flex gap-3 justify-start items-center px-2">
                            <div>
                                <img src={user.profilePic} alt={user.name} className="rounded-full w-15 h-15" />
                            </div>

                            <div className="w-full">
                                <div className="flex justify-between items-center w-full">
                                    <h3>{user.username}</h3>
                                    <span className='border border-gray-700 contentText py-[0.15rem] px-2 rounded-lg !text-white !text-xs'>{user?.role}</span>
                                </div>
                                <p className="text-xs contentText">{user.email}</p>
                            </div>
                        </div>

                        <hr className="border border-gray-800 my-4" />

                        <p className="px-4 contentText text-sm">{data.description}</p>
                    </div>

                    <div className="flex flex-col justify-center items-center gap-4 w-[30%]">
                        <div className="w-full h-fit min-h-[50vh] border border-gray-700 rounded-md p-4">
                            <h2 className="subtitle text-base">Announcement Details</h2>

                            <div className="w-full flex flex-col gap-5 items-start pl-6 mt-4">
                                <div className="flex flex-col justify-center items-start gap-0">
                                    <p className="!text-gray-500 contentText text-base">Priority</p>
                                    {data.priority === "High" && (
                                        <p className='text-xs flex items-center gap-1 text-red-400 bg-red-500/20 p-1 rounded-lg border border-red-800/30'>
                                            <CgDanger /> High Priority
                                        </p>
                                    )}
                                    {data.priority === "Medium" && (
                                        <p className='text-xs flex items-center gap-1 text-yellow-400 bg-yellow-500/20 p-1 rounded-lg border border-yellow-800/30'>
                                            <MdOutlineInfo /> Medium Priority
                                        </p>
                                    )}
                                    {data.priority === "Low" && (
                                        <p className='text-xs flex items-center gap-1 text-green-400 bg-green-500/20 p-1 rounded-lg border border-green-800/30'>
                                            <FiCheckCircle /> Low Priority
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col justify-center items-start gap-0">
                                    <p className="!text-gray-500 contentText text-base">Target Audience</p>
                                    <span className='border border-gray-700 contentText py-1 px-2 rounded-full !text-white bg-blue-400/70 text-sm'>{data.targetAudience}</span>
                                </div>

                                <div className="flex flex-col justify-center items-start gap-0">
                                    <p className="!text-gray-500 contentText text-base">Published On</p>
                                    <p className="flex contentText text-sm">{new Date(data.createdAt.toDate()).toLocaleString("en-GB", {
                                        weekday: "long",
                                        day: "2-digit",
                                        month: "long",
                                        year: "numeric",
                                    })} at {new Date(data.createdAt.toDate()).toLocaleString("en-GB", {
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