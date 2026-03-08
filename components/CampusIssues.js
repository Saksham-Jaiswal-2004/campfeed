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
import { onSnapshot, query, orderBy } from "firebase/firestore";
import { useUser } from "@/context/userContext";
import { useRouter } from "next/navigation";
import ShareButton from './ShareButton';

const CampusIssues = ({setSelectedView}) => {
  const [status, setStatus] = useState("Select Status");
  const [priority, setPriority] = useState("Select Priority");
  const [category, setCategory] = useState("Select Category");
  const { user, loading } = useUser();
  const [issues, setIssues] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [expanded, setExpanded] = useState({});
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/Login");
    }
  }, [loading, user]);

  useEffect(() => {
  if (!user) return;

  const issuesRef = collection(db, "issues");

  const unsubscribe = onSnapshot(issuesRef, async (snapshot) => {
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

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      const statusMatch = status === "All Status" || status === "Select Status" || issue.status === status;
      const priorityMatch = priority === "All Priorities" || priority === "Select Priority" || issue.priority === priority;
      const categoryMatch = category === "All Categories" || category === "Select Category" || issue.category_id === category;
      const nameMatch = issue.title?.toLowerCase().includes(searchQuery.toLowerCase());
      return statusMatch && priorityMatch && categoryMatch && nameMatch;
    });
  }, [issues, status, priority, category, searchQuery]);

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
          <h2 className='subtitle text-3xl'>All Campus Issues</h2>
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

                <p className='subtitle text-3xl pl-2 mb-1 flex items-center gap-1'><span className='text-white text-4xl ml-1 mr-2'>•</span> {issues.length}</p>
                <p className='text-[#64748b] text-xs'><span className='text-green-500'>+12%</span> from last month</p>
            </div>

            <div className='w-[23%] h-[135px] flex flex-col justify-center border border-gray-800 bg-[#020613] rounded-lg p-3'>
                <div className='mb-5 flex justify-between pr-3'>
                    <p className='contentText text-sm'>Issues Resolved</p>
                    {/* <CiChat1 className='text-green-500 text-xl' /> */}
                </div>

                <p className='subtitle text-3xl pl-2 mb-1 flex items-center gap-1'><span className='text-green-500 text-4xl ml-1 mr-2'>•</span> {issues.filter(issue => issue.status==="resolved").length}</p>
                <p className='text-[#64748b] text-xs'><span className='text-green-500'>+3%</span> from last month</p>
            </div>

            <div className='w-[23%] h-[135px] flex flex-col justify-center border border-gray-800 bg-[#020613] rounded-lg p-3'>
                <div className='mb-5 flex justify-between pr-3'>
                    <p className='contentText text-sm'>Issues Under Review</p>
                    {/* <AiOutlineRise className='text-violet-600 text-xl' /> */}
                </div>

                <p className='subtitle text-3xl pl-2 mb-1 flex items-center gap-1'><span className='text-blue-500 text-4xl ml-1 mr-2'>•</span> {issues.filter(issue => issue.status==="in_progress").length}</p>
                <p className='text-[#64748b] text-xs'><span className='text-green-500'>+5%</span> from last month</p>
            </div>

            <div className='w-[23%] h-[135px] flex flex-col justify-center border border-gray-800 bg-[#020613] rounded-lg p-3'>
                <div className='mb-5 flex justify-between pr-3'>
                    <p className='contentText text-sm'>Issues Rejected</p>
                    {/* <FiUsers className='text-cyan-500 text-xl' /> */}
                </div>

                <p className='subtitle text-3xl pl-2 mb-1 flex items-center gap-1'><span className='text-red-500 text-4xl ml-1 mr-2'>•</span> {issues.filter(issue => issue.status==="rejected").length}</p>
                <p className='text-[#64748b] text-xs'><span className='text-green-500'>+5.2%</span> from last month</p>
            </div>
      </div>

      <div className='flex justify-start w-full my-6 pl-3 relative'>
        <CiSearch className='absolute contentText top-[28%] left-[2.5%]' />
        <input
          type="search"
          name="issues"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          id="issues"
          placeholder='Search Campus Issues...'
          className='w-[40%] text-sm mx-2 contentText !text-white rounded-sm pl-8 pr-4 py-2 border border-gray-700 focus:!border-gray-500 outline-none'
        />

        <DropdownMenu>
          <DropdownMenuTrigger>{status==="in_progress"?"In Progress":status==="resolved"?"Resolved":status==="rejected"?"Rejected":status}</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setStatus("All Status")}>All Status</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatus("in_progress")}>In Progress</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatus("resolved")}>Resolved</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatus("rejected")}>Rejected</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger>{priority==="high"?"High Priority":priority==="medium"?"Medium Priority":priority==="low"?"Low Priority":priority}</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setPriority("All Priorities")}>All Priorities</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPriority("high")}>High Priority</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPriority("medium")}>Medium Priority</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPriority("low")}>Low Priority</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger>{category}</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setCategory("All Categories")}>All Categories</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCategory("CAT001")}>Academic</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCategory("CAT002")}>Faculty/Department</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCategory("CAT003")}>Education & Assessment</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCategory("CAT004")}>Administrative/Office</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCategory("CAT005")}>Hostel/Accomodation</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCategory("CAT006")}>IT & Digital</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCategory("CAT007")}>Campus Facilities/Transport</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCategory("CAT008")}>Safety, Security & Discipline</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCategory("CAT009")}>Others</DropdownMenuItem>
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
          <div className='w-full h-full contentText flex justify-center items-center navText text-3xl'>
            Fetching All Issues...
          </div>
        ) : filteredIssues.length === 0 ? (
          <div className='w-full h-full contentText flex justify-center items-center navText text-3xl'>
            No Present Issues
          </div>
        ) : (
          <div className='grid grid-cols-1 justify-center items-center gap-4 w-full mb-10'>
            {/* {filteredAnnouncements.map((announcement) => ( */}
            {filteredIssues.map((issue) => (
              <div key={issue.id} className='w-full !h-[40vh] border border-gray-800 bg-[#020613] rounded-lg overflow-hidden'>
                {/* <Link href={`/Announcements/${announcement.id}`} className='cursor-pointer group'> */}
                <div className='relative w-full h-full flex justify-center items-center pl-8 gap-4 hover:bg-gray-900/30 transition-all duration-200 ease-in-out group'>
                  <div className='!h-[85%] w-[30vw] overflow-hidden flex justify-center items-center'>
                    <img 
                    src={issue.attachment_urls[0]?.url ? issue.attachment_urls[0].url : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/overflowing-dumpster-x1cBEefLftHFa7DMvTW6HJwbBgrq54.png"} 
                    alt="" 
                    className='h-full w-full group-hover:scale-110 transition-all duration-200 ease-in-out object-cover' 
                    />
                  </div>
                  
                  <div className='w-full h-full relative flex flex-col justify-start p-5'>
                    <div className='relative py-2'>
                      <h3 className='subtitle text-xl mb-2 group-hover:text-indigo-500 transition-all duration-200 ease-in-out'>{issue.title}</h3>
                      <p className='contentText text-xs w-[95%] flex gap-2 items-center'>
                        {issue.is_anonymous ? "Anonymous" : issue.student_id}
                        <span>•</span>
                        <span className='border border-gray-700 contentText py-[0.15rem] px-2 rounded-lg !text-white'>
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
                        </span>
                        <span>•</span>
                        {issue.created_at?.toDate().toLocaleDateString("en-IN", {
                           day: "2-digit",
                           month: "short",
                           year: "numeric",
                           hour: "2-digit",
                           minute: "2-digit",
                           hour12: true,
                         })}
                      </p>
                      <div className='flex gap-2 text-xs mt-3'>
                        {issue.tags?.map((tag, index) => (
                          <p key={index} className="border border-gray-700 bg-cyan-500/60 !text-white contentText py-1 px-2 rounded-lg">
                            {tag}
                          </p>
                        ))}
                      </div>

                      <div className='absolute top-0 right-0 flex gap-2 text-xs justify-center items-center contentText'>
                        <span className='border border-gray-700 contentText py-1 px-2 rounded-lg !text-gray-400 bg-gray-500/10'>ID - {issue.id}</span>
                        <span className={`border border-gray-700 contentText py-1 px-2 rounded-lg ${issue.status === "resolved" ? "!text-green-500 bg-green-500/10 border-green-800/50" : issue.status === "rejected" ? "!text-red-500 bg-red-500/10 border-red-800/50" : issue.status === "in_progress" ? "!text-yellow-500 bg-yellow-500/10 border-yellow-800/50" : ""}`}>
                          {issue.status === "resolved" ? "Resolved" : issue.status === "rejected" ? "Rejected" : issue.status === "in_progress" ? "In Progress" : ""}
                        </span>
                        {issue.priority === "critical" && (
                          <p className='text-xs flex items-center gap-1 text-red-400 bg-red-500/20 p-1 rounded-lg border border-red-800/30'>
                            <CgDanger /> Critical Priority
                          </p>
                        )}
                        {issue.priority === "high" && (
                          <p className='text-xs flex items-center gap-1 text-orange-400 bg-orange-500/20 p-1 rounded-lg border border-orange-800/30'>
                            <CgDanger /> High Priority
                          </p>
                        )}
                        {issue.priority === "medium" && (
                          <p className='text-xs flex items-center gap-1 text-yellow-400 bg-yellow-500/20 p-1 rounded-lg border border-yellow-800/30'>
                            <MdOutlineInfo /> Medium Priority
                          </p>
                        )}
                        {issue.priority === "low" && (
                          <p className='text-xs flex items-center gap-1 text-green-400 bg-green-500/20 p-1 rounded-lg border border-green-800/30'>
                            <FiCheckCircle /> Low Priority
                          </p>
                        )}
                        {/* <ShareButton title="" url="/" text={`Check out this Event: `} /> */}
                      </div>
                    </div>

                    <div className='flex w-full h-fit justify-start mt-3'>
                      <p className="contentText text-sm">
                        {expanded[issue.id]
                          ? issue.description
                          : issue.description?.slice(0, 160) + (issue.description?.length > 160 ? "..." : "")}
                      </p>
                    </div>

                    {issue.description?.length > 160 && (
                      <div className='flex w-full h-fit justify-start'>
                        <button
                          onClick={() => toggleExpand(issue.id)}
                          className='text-xs flex items-center gap-2 text-indigo-500 hover:text-indigo-700 mt-2'
                        >
                          {expanded[issue.id] ? "Show Less" : "Read More"} <IoIosArrowDown />
                        </button>
                      </div>
                    )}

                  </div>

                  <div className='absolute bottom-0 right-0 flex'>
                    <Link href="/" className=''><span className='mr-4 mb-4 border border-gray-700 contentText py-2 px-2 rounded-lg !text-white bg-blue-400/50 text-xs hover:bg-blue-400/70 transition-all duration-300 ease-in-out flex justify-center items-center gap-1'><FaRegThumbsUp /> {issue.upvotes} Votes</span></Link>
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