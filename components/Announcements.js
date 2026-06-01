"use client"
import React, { useState, useEffect } from 'react'
import { CiSearch } from "react-icons/ci";
import { IoAddOutline } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { CgDanger } from "react-icons/cg";
import { MdOutlineInfo } from "react-icons/md";
import { FiCheckCircle } from "react-icons/fi";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { toast } from "sonner"
import { useUser } from "@/context/userContext";
import {
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GrFormView } from "react-icons/gr";
import { MdDelete } from "react-icons/md";

const Announcements = ({ setSelectedView }) => {

  const { user, userData } = useUser();
  const [announcements, setAnnouncements] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("Select Role");
  const [priority, setPriority] = useState("Select Priority");
  const [audience, setAudience] = useState("Select Audience");

  useEffect(() => {
    const fetchMyAnnouncements = async () => {
      if (!user) return;

      try {
        const announcementsRef = collection(db, "announcements");
        const q = query(announcementsRef, where("createdBy", "==", user.uid));
        const snapshot = await (userData.role === "Admin" ? getDocs(announcementsRef) : getDocs(q));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAnnouncements(data);
      } catch (err) {
        console.error("Error fetching announcements: ", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyAnnouncements();
  }, [user]);

  const searchedAnnouncements = announcements.filter((announcement) =>
    announcement.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    announcement.targetAudience?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    announcement.priority?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const deleteAnnouncement = async (id) => {
    try {
      const announcementRef = doc(db, "announcements", id);
      await deleteDoc(announcementRef);
      toast("Announcement Deleted Successfully, Refresh to update")
      return { success: true };
    } catch (error) {
      toast("Failed To Delete Announcement")
      console.error("❌ Error deleting announcement:", error);
      return { success: false, error: error.message };
    }
  };

  const handleReset = () => {
    setSearchQuery("")
    setRole("Select Role");
    setPriority("Select Priority");
    setAudience("Select Audience");
  };

  return (
    <div className='w-[84vw] h-screen overflow-y-scroll flex flex-col justify-start items-center'>
      <div className='flex gap-1 justify-between items-center w-full px-5 mt-6'>
        <div className='flex flex-col'>
          <h2 className='subtitle text-3xl'>Manage {userData.role === "Admin" ? "All" : "Your"} Anouncements</h2>
          <p className='contentText'>Create and manage campus announcements</p>
        </div>

        <div className='flex gap-4'>
          <button onClick={() => { setSelectedView("PostAnnouncement") }} className='cursor-pointer btnText bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-sm text-sm transition-all duration-200 ease-in-out flex justify-center items-center gap-2'><IoAddOutline className='text-lg' /> Post Anouncement</button>
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
          <DropdownMenuTrigger className="border border-gray-700 hover:bg-white/5 transition-all ease-in-out duration-200 px-2 mx-1 rounded-sm">{role}</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setRole("All Roles")}>All Roles</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRole("Admin")}>Admin</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRole("Faculty")}>Faculty</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRole("Student Club")}>Student Club</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="border border-gray-700 hover:bg-white/5 transition-all ease-in-out duration-200 px-2 mx-1 rounded-sm">{priority}</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setPriority("All Priorities")}>All Priorities</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPriority("High")}>High Priority</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPriority("Medium")}>Medium Priority</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPriority("Low")}>Low Priority</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="border border-gray-700 hover:bg-white/5 transition-all ease-in-out duration-200 px-2 mx-1 rounded-sm">{audience}</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setAudience("All Audience")}>All Audience</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setAudience("Students")}>Student</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setAudience("Faculty")}>Faculty</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setAudience("Student Clubs")}>Student Clubs</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setAudience("CSE Department")}>CSE Department</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setAudience("ECE Department")}>ECE Department</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setAudience("AI/ML Department")}>AI/ML Department</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setAudience("Cybersecurity Department")}>Cybersecurity Department</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <button
          className='contextText border border-gray-700 px-4 py-2 rounded-sm hover:bg-gray-700/20 transition-all duration-200 ease-in-out mx-2'
          onClick={handleReset}
        >
          Reset
        </button>
      </div>

      {loading ? (
        <p className="contentText mt-10">Loading your announcements...</p>
      ) : announcements.length === 0 ? (
        <p className="contentText mt-10">No announcements found.</p>
      ) : (
        <div className='grid grid-cols-1 justify items-center gap-2 w-[82vw] my-6'>
          <div className='flex justify-between items-center px-2 w-full font-bold!'>
            <p className='w-[12%] flex justify-center items-center'>ID</p>
            <p className='w-[26%] flex justify-center items-center'>Announcement Title</p>
            <p className='w-[14%] flex justify-center items-center'>Target Audience</p>
            <p className='w-[9%] flex justify-center items-center'>Priority</p>
            <p className='w-[12%] flex justify-center items-center'>Issued By</p>
            <p className='w-[12%] flex justify-center items-center'>Issued On</p>
            <p className='w-[8%] flex justify-center items-center'>Actions</p>
          </div>

          {searchedAnnouncements.map((announcement) => (
            <div key={announcement.id} className='w-[100%] h-fit flex justify-between items-center px-4 py-4 bg-[#020613] border border-gray-800 rounded-md overflow-hidden'>
              <p className='text-[0.7rem] w-[12%]'>{announcement.id}</p>

              <p className='subtitle w-[26%] flex justify-center items-center text-sm text-wrap'>{announcement.title || "No Title"}</p>

              <p className='border border-gray-700 contentText flex justify-center items-center py-1 px-2 rounded-lg !text-white bg-blue-400/50 text-xs w-[14%]'>{announcement.targetAudience}</p>

              {announcement.priority === "High" && <p className='w-[9%] text-xs flex justify-center items-center gap-1 text-red-400 bg-red-500/20 p-1 rounded-lg border border-red-800/30'><CgDanger /> High Priority</p>}
              {announcement.priority === "Medium" && <p className='w-[9%] text-xs flex justify-center items-center gap-1 text-yellow-400 bg-yellow-500/20 p-1 rounded-lg border border-yellow-800/30'><MdOutlineInfo /> Medium Priority</p>}
              {announcement.priority === "Low" && <p className='w-[9%] text-xs flex justify-center items-center gap-1 text-green-400 bg-green-500/20 p-1 rounded-lg border border-green-800/30'><FiCheckCircle /> Low Priority</p>}

              <p className='w-[12%] text-xs flex justify-center items-center'>{userData.username}</p>

              <p className='w-[12%] text-xs flex justify-center items-center'>{new Date(announcement.createdAt.toDate()).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true, })}</p>

              <div className='w-[8%] flex justify-center items-center gap-4 text-gray-500'>
               <div className='bg-gray-300/5 hover:text-gray-300 hover:bg-gray-300/10 px-2 py-2 rounded-sm'><GrFormView className='text-lg' /></div>
               <div onClick={() => { deleteAnnouncement(announcement.id) }} className='bg-red-500/10 text-red-900 hover:text-red-700 hover:bg-red-500/20 px-2 py-2 rounded-sm'><MdDelete className='text-lg' /></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Announcements
