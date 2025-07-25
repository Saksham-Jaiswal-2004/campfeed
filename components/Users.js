"use client"
import React, { useState, useEffect } from 'react'
import { CiSearch } from "react-icons/ci";
import { FiUsers } from "react-icons/fi";
import { FiShield } from "react-icons/fi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { CiFlag1 } from "react-icons/ci";
import { PiStudentFill } from "react-icons/pi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { doc, updateDoc } from "firebase/firestore";
import { useUser } from "@/context/userContext";

const Users = () => {

  const [searchQuery, setSearchQuery] = useState("");
  const [role, setRole] = useState("Select Role");
  const [changedRole, setChangedRole] = useState();
  const [department, setDepartment] = useState("Select Department");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useUser();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const userList = querySnapshot.docs.map((doc) => doc.data());
        setUsers(userList);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [changedRole]);

  const updateUserRole = async (uid, newRole) => {
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, {
        role: newRole,
      });
      setChangedRole(newRole);
      // alert(`Role updated to ${newRole}`);
    } catch (error) {
      console.error("Error updating role:", error);
      alert("Failed to update role");
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name?.toLowerCase().includes(searchQuery.toLowerCase()) || user.email?.toLowerCase().includes(searchQuery.toLowerCase()) || user.branch?.toLowerCase().includes(searchQuery.toLowerCase());
    const roleMatch = role === "All Roles" || role === "Select Role" || user.role === role;
    const deptMatch = department === "All Departments" || department === "Select Department" || user.branch === department;
    return matchesSearch && roleMatch && deptMatch;
  });

  const handleReset = () => {
    setSearchQuery("");
    setRole("Select Role");
    setDepartment("Select Department")
  }

  return (
    <div className='w-[84vw] h-screen overflow-y-scroll flex flex-col justify-start items-center'>
      <div className='flex gap-1 justify-between items-center w-full px-5 mt-6'>
        <div className='flex flex-col'>
          <h2 className='subtitle text-3xl'>Manage Users</h2>
          <p className='contentText'>Manage user roles and permissions</p>
        </div>
      </div>

      <div className='flex gap-2 justify-center items-center w-[82vw] mt-5'>
        <div className='w-[19.5%] h-[100px] flex flex-col justify-center border border-gray-700 rounded-lg p-3'>
          <div className='mb-2 flex justify-between pr-3'>
            <p className='contentText text-sm'>Total Users</p>
            <FiUsers className='text-cyan-500 text-lg' />
          </div>

          <p className='subtitle text-3xl px-4'>{users.length}</p>
        </div>

        <div className='w-[19.5%] h-[100px] flex flex-col justify-center border border-gray-700 rounded-lg p-3'>
          <div className='mb-2 flex justify-between pr-3'>
            <p className='contentText text-sm'>Admins</p>
            <FiShield className='text-lg text-violet-500' />
          </div>

          <p className='subtitle text-3xl px-4'>{users.filter(user => user.role === "Admin").length}</p>
        </div>

        <div className='w-[19.5%] h-[100px] flex flex-col justify-center border border-gray-700 rounded-lg p-3'>
          <div className='mb-2 flex justify-between pr-3'>
            <p className='contentText text-sm'>Faculty</p>
            <FaChalkboardTeacher className='text-lg text-indigo-500' />
          </div>

          <p className='subtitle text-3xl px-4'>{users.filter(user => user.role === "Faculty").length}</p>
        </div>

        <div className='w-[19.5%] h-[100px] flex flex-col justify-center border border-gray-700 rounded-lg p-3'>
          <div className='mb-2 flex justify-between pr-3'>
            <p className='contentText text-sm'>Student Club</p>
            <CiFlag1 className='text-lg text-yellow-500' />
          </div>

          <p className='subtitle text-3xl px-4'>{users.filter(user => user.role === "Student Club").length}</p>
        </div>

        <div className='w-[19.5%] h-[100px] flex flex-col justify-center border border-gray-700 rounded-lg p-3'>
          <div className='mb-2 flex justify-between pr-3'>
            <p className='contentText text-sm'>Students</p>
            <PiStudentFill className='text-lg text-green-500' />
          </div>

          <p className='subtitle text-3xl px-4'>{users.filter(user => user.role === "Student").length}</p>
        </div>
      </div>

      <div className='flex justify-start w-full my-6 relative'>
        <CiSearch className='absolute contentText top-[28%] left-[1.6%]' />
        <input type="search" name="users" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} id="events" placeholder='Search Users by Name, Email or Branch...' className='w-[40%] text-sm mx-2 contentText !text-white rounded-sm pl-8 pr-4 py-2 border border-gray-700 focus:!border-gray-500 outline-none' />

        <DropdownMenu>
          <DropdownMenuTrigger>{role}</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setRole("All Roles")}>All Roles</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRole("Admin")}>Admin</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRole("Faculty")}>Faculty</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRole("Student Club")}>Student Club</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRole("Student")}>Student</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger>{department}</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => { setDepartment("All Departments") }}>All Departments</DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setDepartment("CSE") }}>CSE</DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setDepartment("ECE") }}>ECE</DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setDepartment("AI/ML") }}>AI/ML</DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setDepartment("Cybersecurity") }}>Cybersecurity</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <button className='contextText border border-gray-700 px-4 py-2 rounded-sm hover:bg-gray-700/20 transition-all duration-200 ease-in-out mx-2' onClick={() => { handleReset() }}>Reset</button>
      </div>

      <div className='w-[82vw] h-fit p-4 rounded-lg border border-gray-700'>
        <div className='mb-4'>
          <h2 className='navText text-3xl'>Users - {filteredUsers.length}</h2>
        </div>

        <div className='flex gap-2 justify-center items-center px-5 mb-6'>
          <p className='w-[28%] contentText text-xs'>User</p>
          <p className='w-[12%] contentText text-xs'>Role</p>
          <p className='w-[15%] contentText text-xs'>Department</p>
          <p className='w-[15%] contentText text-xs'>Joined</p>
          <p className='w-[15%] contentText text-xs'>Last Active</p>
          <p className='w-[15%] contentText text-xs'>Actions</p>
        </div>

        {loading ? (
          <div className='w-full h-full flex justify-center items-center'>
            <p className="text-white text-xl px-4 py-2">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className='w-full h-full flex justify-center items-center'>
            <p className="text-white text-xl px-4 py-2">No Users Found</p>
          </div>
        ) : (
          filteredUsers.map((user, index) => (
            <div key={index} className='flex gap-2 justify-center items-center px-5 my-2 border-t-[0.1px] py-2 border-gray-600'>
              <div className='w-[28%] text-base flex justify-start items-center gap-2'>
                <div className='bg-gray-500 w-10 h-10 rounded-full flex justify-center items-center'>
                  {user.profilePic ? <img src={user.profilePic} alt={user.name} className='rounded-full w-10 h-10' /> : <span>{user?.name[0]}</span>}
                </div>
                <div className='flex flex-col'>
                  <p>{user.name}</p>
                  <p className='text-[#64748b] text-sm'>{user.email}</p>
                </div>
              </div>

              {user.role === "Admin" && <p className='w-[12%] text-xs text-violet-500'><span className='flex items-center gap-1 bg-violet-800/10 border border-violet-800 w-fit px-2 py-1 rounded-full'><FiShield />{user.role}</span></p>}
              {user.role === "Faculty" && <p className='w-[12%] text-xs text-indigo-500'><span className='flex items-center gap-1 bg-indigo-800/10 border border-indigo-800 w-fit px-2 py-1 rounded-full'><FaChalkboardTeacher />{user.role}</span></p>}
              {user.role === "Student Club" && <p className='w-[12%] text-xs text-yellow-500'><span className='flex items-center gap-1 bg-yellow-800/10 border border-yellow-800/80 w-fit px-2 py-1 rounded-full'><CiFlag1 />{user.role}</span></p>}
              {user.role === "Student" && <p className='w-[12%] text-xs text-green-500'><span className='flex items-center gap-1 bg-green-800/10 border border-green-800 w-fit px-2 py-1 rounded-full'><PiStudentFill />{user.role}</span></p>}

              <p className='w-[15%] text-sm'>{user.branch}</p>
              <p className='w-[15%] text-sm'>{new Date(user.metadata.creationTime).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true })}</p>
              <p className='w-[15%] text-sm'>{new Date(user.metadata.lastSignInTime).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true })}</p>
              <p className='w-[15%] text-sm'>
                <select name="role" id={`role-${user.uid}`} defaultValue={user.role} onChange={(e) => {
                  const newRole = e.target.value;
                  if (userData.role === "Admin") {
                    if (user.role === "Admin") {
                      alert("Admin Roles Cannot be changed!")
                    } else {
                      const adminCode = process.env.NEXT_PUBLIC_ADMIN_CODE;
                      const enteredCode = prompt("Enter Admin Code to Change User Roles");
                      if (enteredCode === adminCode) {
                        const confirmed = confirm(`Are you sure you want to change ${user.name}'s role to "${newRole}"?`);
                        if (confirmed) {
                          updateUserRole(user.uid, newRole);
                        }
                      } else {
                        alert("Incorrect Admin Code!")
                      }
                    }
                  } else {
                    alert("Only Admins can Change User Roles")
                  }
                }} className='bg-[#020818] outline-none px-2 py-1 rounded-md border border-gray-700'>
                  <option value="Admin">Admin</option>
                  <option value="Faculty">Faculty</option>
                  <option value="Student Club">Student Club</option>
                  <option value="Student">Student</option>
                </select>
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Users
