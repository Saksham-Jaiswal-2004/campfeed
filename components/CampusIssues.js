"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { CiSearch } from "react-icons/ci";
import { IoIosArrowDown } from "react-icons/io";
import { CgDanger } from "react-icons/cg";
import { MdOutlineInfo } from "react-icons/md";
import { FiCheckCircle } from "react-icons/fi";
import { IoAddOutline } from "react-icons/io5";
import { FaAngleRight } from 'react-icons/fa';
import { FaRegThumbsUp } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DataSkeleton from './ui/DataSkeleton';
import { useIssueStore } from '@/store/issueStore';
import { getCampusIssues } from '@/services/issueService';
import { HiOutlineAcademicCap } from "react-icons/hi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { PiExam } from "react-icons/pi";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { MdOutlineHotel } from "react-icons/md";
import { PiNetworkFill } from "react-icons/pi";
import { MdOutlineMiscellaneousServices } from "react-icons/md";
import { MdOutlineSecurity } from "react-icons/md";
import { AiOutlineIssuesClose } from "react-icons/ai";
import { cn } from '@/lib/utils';
import SemiPieChart from './ui/SemiPieChart';
import BarChartRace from './ui/BarChartRace';
import * as am5 from "@amcharts/amcharts5";
import { GoDotFill } from 'react-icons/go';

const CampusIssues = ({setSelectedView, setSelectedId}) => {
  const [status, setStatus] = useState("Select Status");
  const [priority, setPriority] = useState("Select Priority");
  const [category, setCategory] = useState("Select Category");
  const [searchQuery, setSearchQuery] = useState("");
  const [expanded, setExpanded] = useState({});

  const issues = useIssueStore((s) => s.campusFeed);
  const loading = useIssueStore((s) => s.loading);

  useEffect(() => {
    try {
      getCampusIssues();
    } catch (err) {
      console.error("Error fetching issues:", err);
    }
  }, []);

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

  const categories = [
        { id: "CAT001", name: "Academic", icon: HiOutlineAcademicCap, color: "text-blue-200", bg: "bg-blue-800" },
        { id: "CAT002", name: "Faculty / Department", icon: FaChalkboardTeacher, color: "text-cyan-200", bg: "bg-cyan-800" },
        { id: "CAT003", name: "Examination & Assessment", icon: PiExam, color: "text-amber-200", bg: "bg-amber-800" },
        { id: "CAT004", name: "Administrative / Office", icon: MdOutlineAdminPanelSettings, color: "text-emerald-200", bg: "bg-emerald-800" },
        { id: "CAT005", name: "Hostel & Accomodation", icon: MdOutlineHotel, color: "text-red-200", bg: "bg-red-800" },
        { id: "CAT006", name: "IT & Digital", icon: PiNetworkFill, color: "text-teal-200", bg: "bg-teal-800" },
        { id: "CAT007", name: "Campus Facilities / Transport", icon: MdOutlineMiscellaneousServices, color: "text-purple-200", bg: "bg-purple-800" },
        { id: "CAT008", name: "Safety, Security & Discipline", icon: MdOutlineSecurity, color: "text-pink-200", bg: "bg-pink-800" },
        { id: "CAT009", name: "Others", icon: AiOutlineIssuesClose, color: "text-indigo-200", bg: "bg-indigo-800" },
      ];

  const priorityData = [
      {
        category: "Low",
        value: 47,
        color: am5.color(0x16a34a), // green
      },
      {
        category: "Medium",
        value: 15,
        color: am5.color(0xca8a04), // yellow
      },
      {
        category: "High",
        value: 15,
        color: am5.color(0xea580c), // yellow
      },
      {
        category: "Critical",
        value: 25,
        color: am5.color(0xdc2626), // red
      },
    ];

  const catData = [
    {
      category: categories[0].name,
      value: 100,
      color: am5.color(0x3b82f6), // blue
    },
    {
      category: categories[1].name,
      value: 90,
      color: am5.color(0xef4444), // red
    },
    {
      category: categories[2].name,
      value: 80,
      color: am5.color(0x22c55e), // green
    },
    {
      category: categories[3].name,
      value: 60,
      color: am5.color(0xf59e0b), // yellow
    },
    {
      category: categories[4].name,
      value: 100,
      color: am5.color(0x3b82f6), // blue
    },
    {
      category: categories[5].name,
      value: 90,
      color: am5.color(0xef4444), // red
    },
    {
      category: categories[6].name,
      value: 80,
      color: am5.color(0x22c55e), // green
    },
    {
      category: categories[7].name,
      value: 60,
      color: am5.color(0xf59e0b), // yellow
    },
    {
      category: categories[8].name,
      value: 60,
      color: am5.color(0xf59e0b), // yellow
    },
  ];

  return (
    <div className='relative w-full h-screen overflow-y-scroll flex flex-col justify-start items-center'>
      <div className='relative flex gap-1 justify-between items-center w-full px-5 mt-6'>
        <div className='flex flex-col'>
          <h2 className='subtitle text-3xl'>All Campus Issues</h2>
          <p className='contentText'>Track the progress of all submitted issues from your campus</p>
        </div>

        <button onClick = {() => {setSelectedView("LogIssue")}} className='cursor-pointer btnText bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-sm text-sm transition-all duration-200 ease-in-out flex justify-center items-center gap-2'><IoAddOutline className='text-lg' /> Log an Issue</button>
      </div>

      <div className='flex gap-5 justify-center items-center w-full mt-5'>
         <div className='w-[23%] h-fit flex flex-col justify-center border border-gray-800 bg-[#020613] rounded-2xl p-3'>
            <div className='mb-3 flex justify-between pr-3'>
                <p className='contentText text-slate-500! text-xs uppercase tracking-[0.15rem]'>Issues Submitted</p>
                {/* <FaRegCalendar className='text-blue-600' /> */}
            </div>

                <p className='subtitle text-3xl pl-2 mb-1 flex items-center gap-1'><span className='text-white text-4xl ml-1 mr-2'>•</span> {issues.length}</p>
                <p className='text-[#64748b] text-xs'><span className='text-green-500'>+12%</span> from last month</p>
          </div>

            <div className='w-[23%] h-fit flex flex-col justify-center border border-gray-800 bg-[#020613] rounded-2xl p-3'>
                <div className='mb-3 flex justify-between pr-3'>
                    <p className='contentText text-slate-500! text-xs uppercase tracking-[0.15rem]'>Issues Resolved</p>
                    {/* <CiChat1 className='text-green-500 text-xl' /> */}
                </div>

                <p className='subtitle text-3xl pl-2 mb-1 flex items-center gap-1'><span className='text-green-500 text-4xl ml-1 mr-2'>•</span> {issues.filter(issue => issue.status==="resolved").length}</p>
                <p className='text-[#64748b] text-xs'><span className='text-green-500'>+3%</span> from last month</p>
            </div>

            <div className='w-[23%] h-fit flex flex-col justify-center border border-gray-800 bg-[#020613] rounded-2xl p-3'>
                <div className='mb-3 flex justify-between pr-3'>
                    <p className='contentText text-slate-500! text-xs uppercase tracking-[0.15rem]'>Issues Under Review</p>
                    {/* <AiOutlineRise className='text-violet-600 text-xl' /> */}
                </div>

                <p className='subtitle text-3xl pl-2 mb-1 flex items-center gap-1'><span className='text-blue-500 text-4xl ml-1 mr-2'>•</span> {issues.filter(issue => issue.status==="in_progress").length}</p>
                <p className='text-[#64748b] text-xs'><span className='text-green-500'>+5%</span> from last month</p>
            </div>

            <div className='w-[23%] h-fit flex flex-col justify-center border border-gray-800 bg-[#020613] rounded-2xl p-3'>
                <div className='mb-3 flex justify-between pr-3'>
                    <p className='contentText text-slate-500! text-xs uppercase tracking-[0.15rem]'>Issues Rejected</p>
                    {/* <FiUsers className='text-cyan-500 text-xl' /> */}
                </div>

                <p className='subtitle text-3xl pl-2 mb-1 flex items-center gap-1'><span className='text-red-500 text-4xl ml-1 mr-2'>•</span> {issues.filter(issue => issue.status==="rejected").length}</p>
                <p className='text-[#64748b] text-xs'><span className='text-green-500'>+5.2%</span> from last month</p>
            </div>
      </div>

      <div className='flex w-full justify-start'>
      <div className='flex flex-col w-[75%]'>
      <div className='flex justify-start w-full my-4 pl-3 relative'>
        <CiSearch className='absolute contentText top-[28%] left-[2.5%]' />
        <input
          type="search"
          name="issues"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          id="issues"
          placeholder='Search Campus Issues...'
          className='w-[50%] text-sm mx-2 contentText !text-white rounded-sm pl-8 pr-4 py-2 border border-gray-700 focus:!border-gray-500 outline-none'
        />

        <DropdownMenu>
          <DropdownMenuTrigger className="border border-gray-700 hover:bg-white/5 transition-all ease-in-out duration-200 px-2 mx-1 rounded-sm text-sm">{status==="in_progress"?"In Progress":status==="resolved"?"Resolved":status==="rejected"?"Rejected":status}</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setStatus("All Status")}>All Status</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatus("in_progress")}>In Progress</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatus("resolved")}>Resolved</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatus("rejected")}>Rejected</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="border border-gray-700 hover:bg-white/5 transition-all ease-in-out duration-200 px-2 mx-1 rounded-sm text-sm">{priority==="high"?"High Priority":priority==="medium"?"Medium Priority":priority==="low"?"Low Priority":priority}</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setPriority("All Priorities")}>All Priorities</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPriority("high")}>High Priority</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPriority("medium")}>Medium Priority</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPriority("low")}>Low Priority</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="border border-gray-700 hover:bg-white/5 transition-all ease-in-out duration-200 px-2 mx-1 rounded-sm text-sm">{category}</DropdownMenuTrigger>
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
          className='contextText text-sm border border-gray-700 px-4 py-2 rounded-sm hover:bg-gray-700/20 transition-all duration-200 ease-in-out mx-2'
          onClick={handleReset}
        >
          Reset
        </button>
      </div>

      <div className='w-full h-fit p-4 rounded-lg'>
        {loading ? (
          <div className='w-full h-full flex justify-center items-center'>
            <DataSkeleton />
          </div>
        ) : filteredIssues.length === 0 ? (
          <div className='w-full h-full contentText flex justify-center items-center navText text-3xl'>
            No Present Issues
          </div>
        ) : (
          <div className='grid grid-cols-1 justify-center items-center gap-3 w-full mb-2'>
            {filteredIssues.map((issue) => {
              const category = categories.find((cat) => cat.id === issue.category_id) ?? categories[categories.length - 1];
              return (
              <div key={issue.id} className='w-full min-h-[25vh] flex justify-center items-center !h-fit border border-gray-800 bg-[#020613] rounded-xl overflow-hidden'>
                <div className='relative w-full h-full flex justify-center items-center pl-6 gap-4 transition-all duration-200 ease-in-out group'>
                  <div className='h-full w-fit overflow-hidden flex justify-center items-center'>
                    <div
                      className={cn(
                        "h-28 w-28 rounded-xl flex items-center justify-center",
                        category.bg,
                      )}
                    >
                      <category.icon className={cn("h-11 w-11", category.color)} />
                    </div>
                  </div>
                  
                  <div className='w-full h-full relative flex flex-col justify-start p-5'>
                    <div className='relative py-2'>
                      <h3 className='subtitle text-xl mb-2 group-hover:text-indigo-500 transition-all duration-200 ease-in-out'>{issue.title}</h3>
                      <p className='contentText text-slate-400! text-xs w-[95%] flex gap-2 items-center'>
                        {issue.is_anonymous ? "Anonymous" : issue.createdByUser?.name || "No Name"}
                        <span>•</span>
                        <span className='border border-gray-700 contentText py-[0.15rem] px-2 rounded-lg bg-gray-400/10 text-slate-400!'>
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
                        {new Date(issue.created_at._seconds * 1000).toLocaleDateString("en-IN", {
                           day: "2-digit",
                           month: "short",
                           year: "numeric",
                           hour: "2-digit",
                           minute: "2-digit",
                           hour12: true,
                         })}
                      </p>

                      <div className='absolute top-0 right-0 flex gap-2 text-xs justify-center items-center contentText'>
                        <span className='border border-gray-700 contentText py-1 px-2 rounded-lg !text-gray-400 bg-gray-500/10'>ID - {issue.id}</span>
                        <span className={`border border-gray-700 contentText py-1 px-2 rounded-lg ${issue.status === "resolved" ? "!text-green-500 bg-green-500/20 border-green-800/20" : issue.status === "rejected" ? "!text-red-500 bg-red-500/20 border-red-800/20" : issue.status === "in_progress" ? "!text-yellow-500 bg-yellow-500/20 border-yellow-800/20" : ""}`}>
                          {issue.status === "resolved" ? "Resolved" : issue.status === "rejected" ? "Rejected" : issue.status === "in_progress" ? "In Progress" : ""}
                        </span>
                        {issue.priority === "critical" && (
                          <p className='text-xs flex items-center gap-1 text-red-400 bg-red-500/30 p-1 rounded-lg border border-red-800/20'>
                            <CgDanger /> Critical Priority
                          </p>
                        )}
                        {issue.priority === "high" && (
                          <p className='text-xs flex items-center gap-1 text-orange-400 bg-orange-500/30 p-1 rounded-lg border border-orange-800/20'>
                            <CgDanger /> High Priority
                          </p>
                        )}
                        {issue.priority === "medium" && (
                          <p className='text-xs flex items-center gap-1 text-yellow-400 bg-yellow-500/30 p-1 rounded-lg border border-yellow-800/20'>
                            <MdOutlineInfo /> Medium Priority
                          </p>
                        )}
                        {issue.priority === "low" && (
                          <p className='text-xs flex items-center gap-1 text-green-400 bg-green-500/30 p-1 rounded-lg border border-green-800/20'>
                            <FiCheckCircle /> Low Priority
                          </p>
                        )}
                      </div>
                    </div>

                    <div className='flex w-[70%] h-fit justify-start mt-5'>
                      <p className="contentText text-sm">
                        {expanded[issue.id]
                          ? issue.description
                          : issue.description?.split(" ").slice(0, 10).join(" ") + (issue.description?.split(" ").length > 10 ? "..." : "")}
                      </p>
                    </div>

                  </div>

                  <div className='absolute bottom-0 right-0 flex'>
                    <span className='mr-4 mb-4 border border-gray-900 contentText py-2 px-2 rounded-lg text-slate-300!  bg-indigo-600/30 text-xs transition-all duration-300 ease-in-out flex justify-center items-center gap-1'>
                      <FaRegThumbsUp /> {issue.upvotes || 0} Votes
                    </span>
                    <button onClick={() => { setSelectedId(issue.id); setSelectedView("DetailedCampusIssue"); }} className='mr-4 mb-4 cursor-pointer contentText py-3 px-3 rounded-lg !text-indigo-500 bg-indigo-500/10 hover:text-indigo-700! hover:bg-indigo-500/15 text-xs transition-all duration-300 ease-in-out flex justify-center items-center gap-1'>View Full Report <FaAngleRight /></button>
                  </div>
                  </div>
              </div>
            )})}
          </div>
        )}
      </div>
      </div>

      <div className='sticky -top-4 w-[23%] h-fit flex flex-col gap-3 justify-start items-center py-6'>
        <div className='w-full flex-col justify-start items-center bg-[#020613]! rounded-2xl px-3 py-5 border border-gray-800'>
          <h2 className='contentText text-slate-500! text-xs uppercase tracking-[0.15rem]'>Issues By Priority</h2>
          <SemiPieChart data={priorityData} />

          <div className='mt-4 text-xs text-gray-400 grid grid-cols-2 items-center justify-center gap-1'>
            <p className='flex justify-center items-center gap-1'><GoDotFill className='text-lg text-red-500' /> Critical <span className='text-base text-gray-200'>{priorityData[3].value}</span></p>
            <p className='flex justify-center items-center gap-1'><GoDotFill className='text-lg text-orange-500' /> High <span className='text-base text-gray-200'>{priorityData[2].value}</span></p>
            <p className='flex justify-center items-center gap-1'><GoDotFill className='text-lg text-yellow-500' /> Medium <span className='text-base text-gray-200'>{priorityData[1].value}</span></p>
            <p className='flex justify-center items-center gap-1'><GoDotFill className='text-lg text-green-500' /> Low <span className='text-base text-gray-200'>{priorityData[0].value}</span></p>
          </div>
        </div>
        <div className='w-full flex-col justify-start items-center bg-[#020613]! rounded-2xl px-3 py-5 border border-gray-800'>
          <h2 className='contentText text-slate-500! text-xs uppercase tracking-[0.15rem]'>Issues By Category</h2>
          <BarChartRace data={catData} />
        </div>
      </div>
      </div>
    </div>
  );
};

export default CampusIssues;