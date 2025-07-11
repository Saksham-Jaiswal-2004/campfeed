import React from 'react'
import { IoAddOutline } from "react-icons/io5";
import { Progress } from "@/components/ui/progress"
import { SlClock } from "react-icons/sl";
import { IoLocationOutline } from "react-icons/io5";
import { GoPeople } from "react-icons/go";
import { FaRegCalendar } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { CiSearch } from "react-icons/ci";

const Events = ({setSelectedView}) => {
  return (
    <div className='w-[84vw] h-screen overflow-y-scroll flex flex-col justify-start items-center'>
      <div className='flex gap-1 justify-between items-center w-full px-5 mt-6'>
        <div className='flex flex-col'>
          <h2 className='subtitle text-3xl'>Manage Events</h2>
          <p className='contentText'>Create and manage campus events</p>
        </div>

        <div className='flex gap-4'>
          <button onClick={() => {setSelectedView("PostEvent")}} className='cursor-pointer btnText bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-sm text-sm transition-all duration-200 ease-in-out flex justify-center items-center gap-2'><IoAddOutline className='text-lg' /> Add Event</button>
        </div>
      </div>

      <div className='flex justify-start w-full px-2 mt-6 relative'>
        <CiSearch className='absolute contentText top-[28%] left-[1.6%]' />
        <input type="search" name="events" id="events" placeholder='Search Events...' className='w-[40%] text-sm contentText !text-white rounded-sm pl-8 pr-4 py-2 border border-gray-700 focus:!border-gray-500 outline-none'/>
      </div>

      <div className='grid grid-cols-3 justify-center items-center gap-3 w-[82vw] my-6'>
        {/* Card 1 */}
        <div className='w-[100%] h-[350px] border border-gray-700 rounded-md overflow-hidden relative'>
          <div className='h-full w-full flex flex-col justify-between p-5'>
            <div>
              <h3 className='subtitle text-lg mb-1'>GDG Devfest 2025</h3>
              <p className='contentText text-sm w-[95%]'>Annual developer conference with workshops and networking</p>
              <div className='flex gap-2 text-xs mt-2'>
                <p className='border border-gray-700 contentText py-1 px-2 rounded-lg'>GDG</p>
                <p className='border border-gray-700 contentText py-1 px-2 rounded-lg'>Workshop</p>
                <p className='border border-gray-700 contentText py-1 px-2 rounded-lg'>Networking</p>
              </div>

              <div className='flex justify-center items-center gap-3 contentText absolute top-6 right-5'>
                <button><FaRegEdit className='hover:text-cyan-600 transition-all duration-200 ease-in-out' /></button>
                <button><RiDeleteBin6Line className='hover:text-red-600 transition-all duration-200 ease-in-out' /></button>
              </div>
            </div>

            <div className='flex flex-col w-full justify-center items-center gap-2'>
              <div className='flex flex-col items-start w-full px-2 gap-2'>
                <p className='flex justify-center items-center gap-2 text-xs navText text-[#8194ad]'><FaRegCalendar className='text-base' /> 15 Feb, 2025</p>
                <p className='flex justify-center items-center gap-2 text-xs navText text-[#8194ad]'><SlClock className='text-base' /> 09:00 AM</p>
                <p className='flex justify-center items-center gap-2 text-xs navText text-[#8194ad]'><IoLocationOutline className='text-base' /> Main Auditorium</p>
                <p className='flex justify-center items-center gap-2 text-xs navText text-[#8194ad]'><GoPeople className='text-base' /> 245/300 Registered</p>
              </div>
              <div className='w-full px-2'>
                <Progress value={(245 / 300) * 100} />
              </div>
              <button className='w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded-lg text-sm transition-all duration-200 ease-in-out'>View RSVP Link</button>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className='w-[100%] h-[350px] border border-gray-700 rounded-md overflow-hidden relative'>
          <div className='h-full w-full flex flex-col justify-between p-5'>
            <div>
              <h3 className='subtitle text-lg mb-1'>Placement Drive - TCS</h3>
              <p className='contentText text-sm w-[95%]'>On-campus recruitment drive for final year students</p>
              <div className='flex gap-2 text-xs mt-2'>
                <p className='border border-gray-700 contentText py-1 px-2 rounded-lg'>TCS</p>
                <p className='border border-gray-700 contentText py-1 px-2 rounded-lg'>Placement</p>
                <p className='border border-gray-700 contentText py-1 px-2 rounded-lg'>Career</p>
              </div>

              <div className='flex justify-center items-center gap-3 contentText absolute top-6 right-5'>
                <button><FaRegEdit className='hover:text-cyan-600 transition-all duration-200 ease-in-out' /></button>
                <button><RiDeleteBin6Line className='hover:text-red-600 transition-all duration-200 ease-in-out' /></button>
              </div>
            </div>

            <div className='flex flex-col w-full justify-center items-center gap-2'>
              <div className='flex flex-col items-start w-full px-2 gap-2'>
                <p className='flex justify-center items-center gap-2 text-xs navText text-[#8194ad]'><FaRegCalendar className='text-base' /> 18 Feb, 2025</p>
                <p className='flex justify-center items-center gap-2 text-xs navText text-[#8194ad]'><SlClock className='text-base' /> 10:00 AM</p>
                <p className='flex justify-center items-center gap-2 text-xs navText text-[#8194ad]'><IoLocationOutline className='text-base' /> Placement Cell</p>
                <p className='flex justify-center items-center gap-2 text-xs navText text-[#8194ad]'><GoPeople className='text-base' /> 89/100 Registered</p>
              </div>
              <div className='w-full px-2'>
                <Progress value={(89 / 100) * 100} />
              </div>
              <button className='w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded-lg text-sm transition-all duration-200 ease-in-out'>View RSVP Link</button>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className='w-[100%] h-[350px] border border-gray-700 rounded-md overflow-hidden relative'>
          <div className='h-full w-full flex flex-col justify-between p-5'>
            <div>
              <h3 className='subtitle text-lg mb-1'>Status Code 2</h3>
              <p className='contentText text-sm w-[95%]'>36-hour coding marathon with exciting prizes</p>
              <div className='flex gap-2 text-xs mt-2'>
                <p className='border border-gray-700 contentText py-1 px-2 rounded-lg'>Hackathon</p>
                <p className='border border-gray-700 contentText py-1 px-2 rounded-lg'>Coding</p>
                <p className='border border-gray-700 contentText py-1 px-2 rounded-lg'>Competition</p>
              </div>
              
              <div className='flex justify-center items-center gap-3 contentText absolute top-6 right-5'>
                <button><FaRegEdit className='hover:text-cyan-600 transition-all duration-200 ease-in-out' /></button>
                <button><RiDeleteBin6Line className='hover:text-red-600 transition-all duration-200 ease-in-out' /></button>
              </div>
            </div>

            <div className='flex flex-col w-full justify-center items-center gap-2'>
              <div className='flex flex-col items-start w-full px-2 gap-2'>
                <p className='flex justify-center items-center gap-2 text-xs navText text-[#8194ad]'><FaRegCalendar className='text-base' /> 23 Aug, 2025</p>
                <p className='flex justify-center items-center gap-2 text-xs navText text-[#8194ad]'><SlClock className='text-base' /> 08:00 AM</p>
                <p className='flex justify-center items-center gap-2 text-xs navText text-[#8194ad]'><IoLocationOutline className='text-base' />IISER Kolkata</p>
                <p className='flex justify-center items-center gap-2 text-xs navText text-[#8194ad]'><GoPeople className='text-base' /> 240/500 Registered</p>
              </div>
              <div className='w-full px-2'>
                <Progress value={(240 / 500) * 100} />
              </div>
              <button className='w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded-lg text-sm transition-all duration-200 ease-in-out'>View RSVP Link</button>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className='w-[100%] h-[350px] border border-gray-700 rounded-md overflow-hidden relative'>
          <div className='h-full w-full flex flex-col justify-between p-5'>
            <div>
              <h3 className='subtitle text-lg mb-1'>Placement Drive - TCS</h3>
              <p className='contentText text-sm w-[95%]'>On-campus recruitment drive for final year students</p>
              <div className='flex gap-2 text-xs mt-2'>
                <p className='border border-gray-700 contentText py-1 px-2 rounded-lg'>TCS</p>
                <p className='border border-gray-700 contentText py-1 px-2 rounded-lg'>Placement</p>
                <p className='border border-gray-700 contentText py-1 px-2 rounded-lg'>Career</p>
              </div>

              <div className='flex justify-center items-center gap-3 contentText absolute top-6 right-5'>
                <button><FaRegEdit className='hover:text-cyan-600 transition-all duration-200 ease-in-out' /></button>
                <button><RiDeleteBin6Line className='hover:text-red-600 transition-all duration-200 ease-in-out' /></button>
              </div>
            </div>

            <div className='flex flex-col w-full justify-center items-center gap-2'>
              <div className='flex flex-col items-start w-full px-2 gap-2'>
                <p className='flex justify-center items-center gap-2 text-xs navText text-[#8194ad]'><FaRegCalendar className='text-base' /> 18 Feb, 2025</p>
                <p className='flex justify-center items-center gap-2 text-xs navText text-[#8194ad]'><SlClock className='text-base' /> 10:00 AM</p>
                <p className='flex justify-center items-center gap-2 text-xs navText text-[#8194ad]'><IoLocationOutline className='text-base' /> Placement Cell</p>
                <p className='flex justify-center items-center gap-2 text-xs navText text-[#8194ad]'><GoPeople className='text-base' /> 89/100 Registered</p>
              </div>
              <div className='w-full px-2'>
                <Progress value={(89 / 100) * 100} />
              </div>
              <button className='w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded-lg text-sm transition-all duration-200 ease-in-out'>View RSVP Link</button>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className='w-[100%] h-[350px] border border-gray-700 rounded-md overflow-hidden relative'>
          <div className='h-full w-full flex flex-col justify-between p-5'>
            <div>
              <h3 className='subtitle text-lg mb-1'>Status Code 2</h3>
              <p className='contentText text-sm w-[95%]'>36-hour coding marathon with exciting prizes</p>
              <div className='flex gap-2 text-xs mt-2'>
                <p className='border border-gray-700 contentText py-1 px-2 rounded-lg'>Hackathon</p>
                <p className='border border-gray-700 contentText py-1 px-2 rounded-lg'>Coding</p>
                <p className='border border-gray-700 contentText py-1 px-2 rounded-lg'>Competition</p>
              </div>
              
              <div className='flex justify-center items-center gap-3 contentText absolute top-6 right-5'>
                <button><FaRegEdit className='hover:text-cyan-600 transition-all duration-200 ease-in-out' /></button>
                <button><RiDeleteBin6Line className='hover:text-red-600 transition-all duration-200 ease-in-out' /></button>
              </div>
            </div>

            <div className='flex flex-col w-full justify-center items-center gap-2'>
              <div className='flex flex-col items-start w-full px-2 gap-2'>
                <p className='flex justify-center items-center gap-2 text-xs navText text-[#8194ad]'><FaRegCalendar className='text-base' /> 23 Aug, 2025</p>
                <p className='flex justify-center items-center gap-2 text-xs navText text-[#8194ad]'><SlClock className='text-base' /> 08:00 AM</p>
                <p className='flex justify-center items-center gap-2 text-xs navText text-[#8194ad]'><IoLocationOutline className='text-base' />IISER Kolkata</p>
                <p className='flex justify-center items-center gap-2 text-xs navText text-[#8194ad]'><GoPeople className='text-base' /> 240/500 Registered</p>
              </div>
              <div className='w-full px-2'>
                <Progress value={(240 / 500) * 100} />
              </div>
              <button className='w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded-lg text-sm transition-all duration-200 ease-in-out'>View RSVP Link</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Events
