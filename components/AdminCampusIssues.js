"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { CiSearch } from "react-icons/ci";
import { CgDanger } from "react-icons/cg";
import { MdOutlineInfo } from "react-icons/md";
import { FiCheckCircle } from "react-icons/fi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GrFormView } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
import { TbMessage2Cancel } from "react-icons/tb";
import { CiExport } from "react-icons/ci";
import DataSkeleton from './ui/DataSkeleton';
import { getAdminIssues } from '@/services/issueService';
import { useIssueStore } from '@/store/issueStore';

const AdminCampusIssues = ({setSelectedView, setSelectedId}) => {
  const [status, setStatus] = useState("Select Status");
  const [priority, setPriority] = useState("Select Priority");
  const [category, setCategory] = useState("Select Category");
  const [searchQuery, setSearchQuery] = useState("");

  const issues = useIssueStore((s) => s.adminIssues)
  const loading = useIssueStore((s) => s.loading)

  useEffect(() => {
    try {
      getAdminIssues();
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

  return (
    <div className='w-full h-screen overflow-y-scroll flex flex-col justify-start items-center'>
      <div className='flex gap-1 justify-between items-center w-full px-5 mt-6'>
        <div className='flex flex-col'>
          <h2 className='subtitle text-3xl'>All Campus Issues Logs</h2>
          <p className='contentText'>Track the progress of all submitted issues from your campus</p>
        </div>

        <button className='cursor-pointer btnText bg-indigo-600/30 hover:bg-indigo-600/50 px-4 py-2 rounded-sm text-sm transition-all duration-200 ease-in-out flex justify-center items-center gap-2'><CiExport className='text-lg' /> Export Issues</button>
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
          <DropdownMenuTrigger className="border border-gray-700 hover:bg-white/5 transition-all ease-in-out duration-200 px-2 mx-1 rounded-sm">{status==="in_progress"?"In Progress":status==="resolved"?"Resolved":status==="rejected"?"Rejected":status}</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setStatus("All Status")}>All Status</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatus("in_progress")}>In Progress</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatus("resolved")}>Resolved</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatus("rejected")}>Rejected</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="border border-gray-700 hover:bg-white/5 transition-all ease-in-out duration-200 px-2 mx-1 rounded-sm">{priority==="high"?"High Priority":priority==="medium"?"Medium Priority":priority==="low"?"Low Priority":priority}</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setPriority("All Priorities")}>All Priorities</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPriority("high")}>High Priority</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPriority("medium")}>Medium Priority</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPriority("low")}>Low Priority</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="border border-gray-700 hover:bg-white/5 transition-all ease-in-out duration-200 px-2 mx-1 rounded-sm">{category}</DropdownMenuTrigger>
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
        {loading ? (
          <div className='w-full h-full flex flex-col justify-center items-center gap-8'>
            <DataSkeleton />
            <DataSkeleton />
          </div>
        ) : filteredIssues.length === 0 ? (
          <div className='w-full h-full contentText flex justify-center items-center navText text-3xl'>
            No Present Issues
          </div>
        ) : (
          <div className='grid grid-cols-1 justify-center items-center gap-2 w-full mb-10'>
            <div className='flex justify-start items-center px-2 w-full font-bold!'>
                <p className='w-[12%] flex justify-center items-center'>ID</p>
                <p className='w-[24%] flex justify-center items-center'>Issue Title</p>
                <p className='w-[17%] flex justify-center items-center'>Category</p>
                <p className='w-[9%] flex justify-center items-center'>Severity</p>
                <p className='w-[6%] flex justify-center items-center'>Upvotes</p>
                <p className='w-[7%] flex justify-center items-center'>Status</p>
                <p className='w-[13%] flex justify-center items-center'>Submitted On</p>
                <p className='w-[12%] flex justify-center items-center'>Actions</p>
            </div>

            {filteredIssues.map((issue) => (
              <div key={issue.id} className='w-full !h-fit flex justify-start items-center gap-1 border border-gray-800 bg-[#020613] rounded-lg overflow-hidden relative px-2 py-4'>
                <p className='text-[0.7rem] w-[12%]'>{issue.id}</p>
                
                <p className='subtitle w-[24%] flex justify-center items-center text-sm text-wrap'>{issue.title || "No Title"}</p>

                  <p className='border w-[15%] mr-2 flex justify-center items-center border-gray-700 contentText py-1 px-2 rounded-lg text-xs !text-white'>
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

                  {issue.priority === "critical" && (
                    <p className='text-xs w-[9%] flex items-center justify-center gap-1 text-red-400 bg-red-500/20 p-1 rounded-lg border border-red-800/30'>
                      <CgDanger /> Critical Priority
                    </p>
                  )}
                  {issue.priority === "high" && (
                    <p className='text-xs w-[9%] flex items-center justify-center gap-1 text-orange-400 bg-orange-500/20 p-1 rounded-lg border border-orange-800/30'>
                      <CgDanger /> High Priority
                    </p>
                  )}
                  {issue.priority === "medium" && (
                    <p className='text-xs w-[9%] flex items-center justify-center gap-1 text-yellow-400 bg-yellow-500/20 p-1 rounded-lg border border-yellow-800/30'>
                      <MdOutlineInfo /> Medium Priority
                    </p>
                  )}
                  {issue.priority === "low" && (
                    <p className='text-xs w-[9%] flex items-center justify-center gap-1 text-green-400 bg-green-500/20 p-1 rounded-lg border border-green-800/30'>
                      <FiCheckCircle /> Low Priority
                    </p>
                  )}

                  <p className='text-sm w-[6%] flex justify-center'>{issue.upvotes || 0}</p>

                  <p className={`border w-[7%] flex justify-center items-center border-gray-700 contentText py-1 px-2 text-xs rounded-lg ${issue.status === "resolved" ? "!text-green-500 bg-green-500/10 border-green-800/50" : issue.status === "rejected" ? "!text-red-500 bg-red-500/10 border-red-800/50" : issue.status === "in_progress" ? "!text-yellow-500 bg-yellow-500/10 border-yellow-800/50" : ""}`}>
                    {issue.status === "resolved" ? "Resolved" : issue.status === "rejected" ? "Rejected" : issue.status === "in_progress" ? "In Progress" : ""}
                  </p>

                  <p className='text-xs w-[13%] flex justify-center items-center'>
                  {new Date(issue.created_at._seconds * 1000).toLocaleDateString("en-IN", {
                     day: "2-digit",
                     month: "short",
                     year: "numeric",
                     hour: "2-digit",
                     minute: "2-digit",
                     hour12: true,
                   })}
                   </p>

                   <div className='w-[10%] flex justify-center items-center gap-4 text-gray-500'>
                    <div className='bg-gray-300/5 hover:text-gray-300 hover:bg-gray-300/10 px-2 py-2 rounded-sm' onClick={() => { setSelectedId(issue.id); setSelectedView("DetailedIssue"); }}><GrFormView className='text-lg' /></div>
                    <div className='bg-gray-300/5 hover:text-gray-300 hover:bg-gray-300/10 px-2 py-2 rounded-sm'><TbMessage2Cancel className='text-lg' /></div>
                    <div className='bg-red-500/10 text-red-900 hover:text-red-700 hover:bg-red-500/20 px-2 py-2 rounded-sm'><MdDelete className='text-lg' /></div>
                   </div>

                {/* <button onClick={() => { setSelectedId(issue.id); setSelectedView("DetailedCampusIssue"); }} className='mr-4 mb-4 contentText py-2 px-2 rounded-lg !text-blue-400 text-xs hover:!text-blue-500 transition-all duration-300 ease-in-out flex justify-center items-center gap-1'>View Full Report <FaAngleRight /></button> */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCampusIssues;