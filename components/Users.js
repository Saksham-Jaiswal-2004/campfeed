"use client"
import React, { useState } from 'react'
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
import users from '@/Data/users'

const Users = () => {

  const [role, setRole] = useState("Select Role")
  const [department, setDepartment] = useState("Select Department")

  const filteredUsers = users.filter((user) => {
    const roleMatch = role === "All Roles" || role === "Select Role" || user.role === role;
    const deptMatch = department === "All Departments" || department === "Select Department" || user.department === department;
    return roleMatch && deptMatch;
  });

  const handleReset = () => {
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
        <input type="search" name="events" id="events" placeholder='Search Users...' className='w-[40%] text-sm mx-2 contentText !text-white rounded-sm pl-8 pr-4 py-2 border border-gray-700 focus:!border-gray-500 outline-none' />

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

        {filteredUsers.map((user, index) => (
          <div key={index} className='flex gap-2 justify-center items-center px-5 my-2 border-t-[0.1px] py-2 border-gray-600'>
            <div className='w-[28%] text-base flex flex-col'>
              <p>{user.name}</p>
              <p className='text-[#64748b] text-sm'>{user.email}</p>
            </div>

            {user.role === "Admin" && <p className='w-[12%] text-xs text-violet-500'><span className='flex items-center gap-1 bg-violet-800/10 border border-violet-800 w-fit px-2 py-1 rounded-full'><FiShield />{user.role}</span></p>}
            {user.role === "Faculty" && <p className='w-[12%] text-xs text-indigo-500'><span className='flex items-center gap-1 bg-indigo-800/10 border border-indigo-800 w-fit px-2 py-1 rounded-full'><FaChalkboardTeacher />{user.role}</span></p>}
            {user.role === "Student Club" && <p className='w-[12%] text-xs text-yellow-500'><span className='flex items-center gap-1 bg-yellow-800/10 border border-yellow-800/80 w-fit px-2 py-1 rounded-full'><CiFlag1 />{user.role}</span></p>}
            {user.role === "Student" && <p className='w-[12%] text-xs text-green-500'><span className='flex items-center gap-1 bg-green-800/10 border border-green-800 w-fit px-2 py-1 rounded-full'><PiStudentFill  />{user.role}</span></p>}

            <p className='w-[15%] text-sm'>{user.department}</p>
            <p className='w-[15%] text-sm'>{user.joined}</p>
            <p className='w-[15%] text-sm'>{user.lastActive}</p>
            <p className='w-[15%] text-sm'>
              <select name="" id="" className='bg-[#020818] outline-none px-2 py-1 rounded-md border border-gray-700'>
                <option value="">{user.role}</option>
                <option value="">Admin</option>
                <option value="">Faculty</option>
                <option value="">Student Club</option>
                <option value="">Student</option>
              </select>
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Users
