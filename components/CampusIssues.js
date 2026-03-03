"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { CiSearch } from "react-icons/ci";
import { IoIosArrowDown } from "react-icons/io";
import { CgDanger } from "react-icons/cg";
import { MdOutlineInfo } from "react-icons/md";
import { FiCheckCircle } from "react-icons/fi";
import { IoAddOutline } from "react-icons/io5";
import { FaAngleUp } from "react-icons/fa6";
import { FaAngleRight } from 'react-icons/fa';
import { FaRegThumbsUp } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { db } from "@/lib/firebase";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { useUser } from "@/context/userContext";
import { useRouter } from "next/navigation";
import ShareButton from './ShareButton';

const CampusIssues = ({setSelectedView}) => {
  const [status, setStatus] = useState("Select Status");
  const [priority, setPriority] = useState("Select Priority");
  const [category, setCategory] = useState("Select Category");
  const { user, loading } = useUser();
  const [announcements, setAnnouncements] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [expanded, setExpanded] = useState({});
  const router = useRouter();

  const issuesData = [
    {
    "id": "ISSUE-001",
    "title": "WiFi not working in Hostel Block B",
    "description": "The WiFi connection has been extremely unstable for the past 3 days in Hostel Block B. Speeds drop to 0.5 Mbps during evening hours.",
    "category_id": "CAT002",
    "priority": "high",
    "status": "In Progress",
    "student_id": "STU001",
    "assigned_to": "STAFF002",
    "is_anonymous": false,
    "location": "Hostel Block B - 3rd Floor",
    "attachment_urls": [
      "https://example.com/screenshots/speedtest1.png"
    ],
    "created_at": "2026-03-01T10:15:00Z",
    "updated_at": "2026-03-01T14:30:00Z",
    "resolved_at": null,
    "upvotes": 200,
  },
  {
    "id": "ISSUE-002",
    "title": "Water leakage in Room 204",
    "description": "There is continuous water leakage from the ceiling during rainfall. It is affecting electrical wiring.",
    "category_id": "CAT005",
    "priority": "critical",
    "status": "In Progress",
    "student_id": "STU002",
    "assigned_to": null,
    "is_anonymous": true,
    "location": "Hostel Block A - Room 204",
    "attachment_urls": [],
    "created_at": "2026-03-02T07:40:00Z",
    "updated_at": "2026-03-02T07:40:00Z",
    "resolved_at": null,
    "upvotes": 200,
  },
  {
    "id": "ISSUE-003",
    "title": "Mess food quality deteriorating",
    "description": "The quality of dinner served this week has been poor. Multiple students reported undercooked rice and stale chapatis.",
    "category_id": "CAT003",
    "priority": "medium",
    "status": "Resolved",
    "student_id": "STU003",
    "assigned_to": "ADM001",
    "is_anonymous": false,
    "location": "Main Mess Hall",
    "attachment_urls": [
      "https://example.com/photos/mess-food.jpg"
    ],
    "created_at": "2026-02-25T18:20:00Z",
    "updated_at": "2026-02-27T12:00:00Z",
    "resolved_at": "2026-02-27T11:45:00Z",
    "upvotes": 200
  },
  {
    "id": "ISSUE-004",
    "title": "Request for additional lab practice hours",
    "description": "Students preparing for placements need extended lab access during weekends.",
    "category_id": "CAT004",
    "priority": "low",
    "status": "Rejected",
    "student_id": "STU004",
    "assigned_to": "ADM002",
    "is_anonymous": false,
    "location": "Computer Lab 2",
    "attachment_urls": [],
    "created_at": "2026-02-20T09:00:00Z",
    "updated_at": "2026-02-22T10:30:00Z",
    "resolved_at": "2026-02-22T10:30:00Z",
    "upvotes": 200,
  },
  {
    "id": "ISSUE-005",
    "title": "Broken tube light in Classroom C-101",
    "description": "The tube light has been flickering and finally stopped working. It makes it difficult to attend evening lectures.",
    "category_id": "CAT005",
    "priority": "medium",
    "status": "Resolved",
    "student_id": "STU005",
    "assigned_to": null,
    "is_anonymous": false,
    "location": "Academic Block C - Room 101",
    "attachment_urls": [],
    "created_at": "2026-03-02T12:10:00Z",
    "updated_at": "2026-03-02T12:10:00Z",
    "resolved_at": null,
    "upvotes": 200,
  }
];

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/Login");
    }
  }, [loading, user]);

  useEffect(() => {
    const fetchMyAnnouncements = async () => {
      if (!user) return;

      try {
        const announcementsRef = collection(db, "announcements");
        const snapshot = await getDocs(announcementsRef);
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

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((announcement) => {
      const statusMatch = status === "All Status" || status === "Select Status" || announcement.createdByUser?.status === status;
      const priorityMatch = priority === "All Priorities" || priority === "Select Priority" || announcement.priority === priority;
      const categoryMatch = category === "All Categories" || category === "Select Category" || announcement.targetAudience === category;
      const nameMatch = announcement.title?.toLowerCase().includes(searchQuery.toLowerCase());
      return statusMatch && priorityMatch && categoryMatch && nameMatch;
    });
  }, [announcements, status, priority, category, searchQuery]);

  const handleReset = () => {
    setSearchQuery("")
    setStatus("Select Status");
    setPriority("Select Priority");
    setCategory("Select Category");
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className='w-full h-screen overflow-y-scroll flex flex-col justify-start items-center'>
      <div className='flex gap-1 justify-between items-center w-full px-5 mt-6'>
        <div className='flex flex-col'>
          <h2 className='subtitle text-3xl'>Your Campus Issues</h2>
          <p className='contentText'>Track the progress of all submitted issues from your campus</p>
        </div>

        <button onClick = {() => {setSelectedView("LogIssue")}} className='cursor-pointer btnText bg-indigo-600/30 hover:bg-indigo-600/50 px-4 py-2 rounded-sm text-sm transition-all duration-200 ease-in-out flex justify-center items-center gap-2'><IoAddOutline className='text-lg' /> Log an Issue</button>
      </div>

      <div className='flex gap-5 justify-center items-center w-full mt-5'>
         <div className='w-[23%] h-[135px] flex flex-col justify-center border border-gray-800 bg-[#020613] rounded-lg p-3'>
            <div className='mb-5 flex justify-between pr-3'>
                <p className='contentText text-sm'>Issues Submitted</p>
                {/* <FaRegCalendar className='text-blue-600' /> */}
            </div>

                <p className='subtitle text-3xl pl-2 mb-1 flex items-center gap-1'><span className='text-white text-4xl ml-1 mr-2'>•</span> 16</p>
                <p className='text-[#64748b] text-xs'><span className='text-green-500'>+12%</span> from last month</p>
            </div>

            <div className='w-[23%] h-[135px] flex flex-col justify-center border border-gray-800 bg-[#020613] rounded-lg p-3'>
                <div className='mb-5 flex justify-between pr-3'>
                    <p className='contentText text-sm'>Issues Resolved</p>
                    {/* <CiChat1 className='text-green-500 text-xl' /> */}
                </div>

                <p className='subtitle text-3xl pl-2 mb-1 flex items-center gap-1'><span className='text-green-500 text-4xl ml-1 mr-2'>•</span> 3</p>
                <p className='text-[#64748b] text-xs'><span className='text-green-500'>+3%</span> from last month</p>
            </div>

            <div className='w-[23%] h-[135px] flex flex-col justify-center border border-gray-800 bg-[#020613] rounded-lg p-3'>
                <div className='mb-5 flex justify-between pr-3'>
                    <p className='contentText text-sm'>Issues Under Review</p>
                    {/* <AiOutlineRise className='text-violet-600 text-xl' /> */}
                </div>

                <p className='subtitle text-3xl pl-2 mb-1 flex items-center gap-1'><span className='text-blue-500 text-4xl ml-1 mr-2'>•</span> 8</p>
                <p className='text-[#64748b] text-xs'><span className='text-green-500'>+5%</span> from last week</p>
            </div>

            <div className='w-[23%] h-[135px] flex flex-col justify-center border border-gray-800 bg-[#020613] rounded-lg p-3'>
                <div className='mb-5 flex justify-between pr-3'>
                    <p className='contentText text-sm'>Issues Rejected</p>
                    {/* <FiUsers className='text-cyan-500 text-xl' /> */}
                </div>

                <p className='subtitle text-3xl pl-2 mb-1 flex items-center gap-1'><span className='text-red-500 text-4xl ml-1 mr-2'>•</span> 5</p>
                <p className='text-[#64748b] text-xs'><span className='text-green-500'>+5.2%</span> from last month</p>
            </div>
      </div>

      <div className='flex justify-start w-full my-6 pl-3 relative'>
        <CiSearch className='absolute contentText top-[28%] left-[2.5%]' />
        <input
          type="search"
          name="announcements"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          id="announcements"
          placeholder='Search Announcements...'
          className='w-[40%] text-sm mx-2 contentText !text-white rounded-sm pl-8 pr-4 py-2 border border-gray-700 focus:!border-gray-500 outline-none'
        />

        <DropdownMenu>
                  <DropdownMenuTrigger>{status}</DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setStatus("All Status")}>All Roles</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatus("In Progress")}>In Progress</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatus("Resolved")}>Resolved</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatus("Rejected")}>Rejected</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
        
                <DropdownMenu>
                  <DropdownMenuTrigger>{priority}</DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setPriority("All Priorities")}>All Priorities</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setPriority("High")}>High Priority</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setPriority("Medium")}>Medium Priority</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setPriority("Low")}>Low Priority</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
        
                <DropdownMenu>
                  <DropdownMenuTrigger>{category}</DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setCategory("All Categories")}>All Categories</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCategory("Academic")}>Academic</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCategory("Faculty/Department")}>Faculty/Department</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCategory("Education & Assessment")}>Education & Assessment</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCategory("Administrative/Office")}>Administrative/Office</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCategory("Hostel/Accomodation")}>Hostel/Accomodation</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCategory("IT & Digital")}>IT & Digital</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCategory("Campus Facilities/Transport")}>Campus Facilities/Transport</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCategory("Safety, Security & Discipline")}>Safety, Security & Discipline</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCategory("Others")}>Others</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

        <button
          className='contextText border border-gray-700 px-4 py-2 rounded-sm hover:bg-gray-700/20 transition-all duration-200 ease-in-out mx-2'
          onClick={handleReset}
        >
          Reset
        </button>
      </div>

      <div className='w-full h-fit p-4 rounded-lg'>
        {/* <div className='mb-4'>
          <h2 className='navText text-xl'>Announcements - {filteredAnnouncements.length}</h2>
        </div> */}

        {fetching ? (
          <div className='w-full h-full flex justify-center items-center navText text-3xl'>
            Fetching All Announcements...
          </div>
        ) : filteredAnnouncements.length === 0 ? (
          <div className='w-full h-full flex justify-center items-center navText text-3xl'>
            No Present Announcements
          </div>
        ) : (
          <div className='grid grid-cols-1 justify-center items-center gap-4 w-full mb-10'>
            {/* {filteredAnnouncements.map((announcement) => ( */}
            {issuesData.map((announcement) => (
              <div key={announcement.id} className='w-full !h-[40vh] border border-gray-800 bg-[#020613] rounded-lg overflow-hidden'>
                {/* <Link href={`/Announcements/${announcement.id}`} className='cursor-pointer group'> */}
                <div className='relative w-full h-full flex justify-center items-center pl-8 gap-4 hover:bg-gray-900/30 transition-all duration-200 ease-in-out group'>
                  <div className='h-[85%] overflow-hidden'>
                    <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/overflowing-dumpster-x1cBEefLftHFa7DMvTW6HJwbBgrq54.png" alt="" className='h-full w-auto group-hover:scale-110 transition-all duration-200 ease-in-out' />
                  </div>
                  
                  <div className='w-full h-full relative flex flex-col justify-start p-5'>
                    <div className='relative py-2'>
                      <h3 className='subtitle text-xl mb-2 group-hover:text-indigo-500 transition-all duration-200 ease-in-out'>{announcement.title}</h3>
                      <p className='contentText text-xs w-[95%] flex gap-2 items-center'>
                        {announcement.is_anonymous ? "Anonymous" : announcement.student_id}
                        <span>•</span>
                        <span className='border border-gray-700 contentText py-[0.15rem] px-2 rounded-lg !text-white'>{announcement.category_id}</span>
                        <span>•</span>
                        {new Date(announcement.created_at).toLocaleDateString("en-IN", {
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
                        <span className='border border-gray-700 contentText py-1 px-2 rounded-lg !text-gray-400 bg-gray-500/10'>{announcement.id}</span>
                        <span className={`border border-gray-700 contentText py-1 px-2 rounded-lg ${announcement.status === "Resolved" ? "!text-green-500 bg-green-500/10 border-green-800/50" : announcement.status === "Rejected" ? "!text-red-500 bg-red-500/10 border-red-800/50" : announcement.status === "In Progress" ? "!text-yellow-500 bg-yellow-500/10 border-yellow-800/50" : ""}`}>{announcement.status}</span>
                        {announcement.priority === "critical" && (
                          <p className='text-xs flex items-center gap-1 text-red-400 bg-red-500/20 p-1 rounded-lg border border-red-800/30'>
                            <CgDanger /> Critical Priority
                          </p>
                        )}
                        {announcement.priority === "high" && (
                          <p className='text-xs flex items-center gap-1 text-orange-400 bg-orange-500/20 p-1 rounded-lg border border-orange-800/30'>
                            <CgDanger /> High Priority
                          </p>
                        )}
                        {announcement.priority === "medium" && (
                          <p className='text-xs flex items-center gap-1 text-yellow-400 bg-yellow-500/20 p-1 rounded-lg border border-yellow-800/30'>
                            <MdOutlineInfo /> Medium Priority
                          </p>
                        )}
                        {announcement.priority === "low" && (
                          <p className='text-xs flex items-center gap-1 text-green-400 bg-green-500/20 p-1 rounded-lg border border-green-800/30'>
                            <FiCheckCircle /> Low Priority
                          </p>
                        )}
                        {/* <ShareButton title="" url="/" text={`Check out this Event: `} /> */}
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

                  <div className='absolute bottom-0 right-0 flex'>
                    <Link href="/" className=''><span className='mr-4 mb-4 border border-gray-700 contentText py-2 px-2 rounded-lg !text-white bg-blue-400/50 text-xs hover:bg-blue-400/70 transition-all duration-300 ease-in-out flex justify-center items-center gap-1'><FaRegThumbsUp /> {announcement.upvotes} Votes</span></Link>
                    <Link href="/" className=''><span className='mr-4 mb-4 contentText py-2 px-2 rounded-lg !text-blue-400 text-xs hover:!text-blue-500 transition-all duration-300 ease-in-out flex justify-center items-center gap-1'>View Full Report <FaAngleRight /></span></Link>
                  </div>
                  </div>
                {/* </Link> */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CampusIssues;