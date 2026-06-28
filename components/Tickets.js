"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useUser } from "@/context/userContext";
import { useRouter } from "next/navigation";
import BlockSkeleton from './ui/BlockSkeleton';
import { useTickets } from '@/hooks/useTickets';
import { ticketService } from '@/services/ticket.service';
import { Timestamp } from 'firebase/firestore';
import TicketModal from './TicketModal';
import PieChart from './ui/PieChart';
import * as am5 from "@amcharts/amcharts5";
import { GoDotFill } from 'react-icons/go';
import { FaRegCalendar } from 'react-icons/fa';
import { SlClock } from 'react-icons/sl';
import { IoLocationOutline } from 'react-icons/io5';
import { FaRegClock } from 'react-icons/fa6';
import { MdOutlineFileDownload } from 'react-icons/md';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import DataSkeleton from './ui/DataSkeleton';

const Tickets = () => {
  const [view, setView] = useState("ALL");
  const [open, setOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const { user } = useUser();
  const router = useRouter();

  const { tickets, loading } = useTickets();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/Login");
    }
  }, [loading, user]);

  useEffect(() => {
    try {
      ticketService.fetchMyTickets();
    } catch (err) {
      console.error(err);
    }
  }, []);

  const filteredTickets = tickets.filter((ticket) =>
    view === "ALL"
      ? true
      : view === "ACTIVE"
      ? !ticket.used && new Date(ticket.event.endDate._seconds * 1000) > Timestamp.now().toDate()
      : view === "USED"
      ? ticket.used 
      : view === "EXPIRED" 
      ? new Date(ticket.event.endDate._seconds * 1000) < Timestamp.now().toDate() 
      : ""
  );

  const handlePrintTicket = (ticket) => {
    if (!ticket?.pdfURL) return;

    window.open(ticket.pdfURL, "_blank");
  };

  const data = [
    {
      category: "Active",
      value: 2,
      color: am5.color(0x16a34a),
    },
    {
      category: "Used",
      value: 7,
      color: am5.color(0xca8a04),
    },
    {
      category: "Cancelled/Expired",
      value: 5,
      color: am5.color(0xdc2626),
    },
  ];

  return (
    <div className='w-full h-screen overflow-y-scroll flex flex-col justify-start items-center px-5'>
      <div className='flex gap-1 justify-between items-center w-full mt-6'>
        <div className='flex flex-col'>
          <h2 className='subtitle text-3xl'>Your Event Tickets</h2>
          <p className='contentText'>Manage and view all your event tickets</p>
        </div>
      </div>

      <div className='flex gap-5 justify-between items-center w-full my-5'>
        <div className="w-[24%] h-fit flex flex-col justify-center border border-gray-800 bg-[#020613] rounded-2xl p-3">
          <div className="mb-3 flex justify-between pr-3">
            <p className="contentText text-slate-500! text-xs uppercase tracking-[0.15rem]">Total Tickets</p>
          </div>

          <p className='subtitle text-3xl pl-2 mb-1 flex items-center gap-1'><span className='text-white text-4xl ml-1 mr-2'>•</span> {tickets.length}</p>
          <p className='text-[#64748b] text-xs'><span className='text-green-500'>+12%</span> from last month</p>
        </div>

        <div className="w-[24%] h-fit flex flex-col justify-center border border-gray-800 bg-[#020613] rounded-2xl p-3">
          <div className="mb-3 flex justify-between pr-3">
            <p className="contentText text-slate-500! text-xs uppercase tracking-[0.15rem]">Active Tickets</p>
          </div>

          <p className='subtitle text-3xl pl-2 mb-1 flex items-center gap-1'><span className='text-green-500 text-4xl ml-1 mr-2'>•</span> {tickets.filter(ticket => !ticket.used && new Date(ticket.event.endDate._seconds * 1000) > Timestamp.now().toDate()).length}</p>
          <p className='text-[#64748b] text-xs'><span className='text-green-500'>+3%</span> from last month</p>
        </div>

        <div className="w-[24%] h-fit flex flex-col justify-center border border-gray-800 bg-[#020613] rounded-2xl p-3">
          <div className="mb-3 flex justify-between pr-3">
            <p className="contentText text-slate-500! text-xs uppercase tracking-[0.15rem]">Used Tickets</p>
          </div>

          <p className='subtitle text-3xl pl-2 mb-1 flex items-center gap-1'><span className='text-blue-500 text-4xl ml-1 mr-2'>•</span> {tickets.filter(ticket => ticket.used).length}</p>
          <p className='text-[#64748b] text-xs'><span className='text-green-500'>+5%</span> from last month</p>
        </div>

        <div className="w-[24%] h-fit flex flex-col justify-center border border-gray-800 bg-[#020613] rounded-2xl p-3">
          <div className="mb-3 flex justify-between pr-3">
            <p className="contentText text-slate-500! text-xs uppercase tracking-[0.15rem]">Cancelled / Expired Tickets</p>
          </div>

          <p className='subtitle text-3xl pl-2 mb-1 flex items-center gap-1'><span className='text-red-500 text-4xl ml-1 mr-2'>•</span> {tickets.filter(ticket =>  new Date(ticket.event.endDate._seconds * 1000) < Timestamp.now().toDate()).length}</p>
          <p className='text-[#64748b] text-xs'><span className='text-green-500'>+5.2%</span> from last month</p>
        </div>
      </div>

      <div className='flex w-full justify-between items-start'>
      <div className='flex flex-col w-[75%]'>
      <div className='flex justify-between w-full relative'>
        <div className='flex justify-between items-center w-[40%] rounded-sm px-2 py-1 text-slate-400'>
          <p className={`${view === "ALL" ? "border-b-3 border-indigo-500 text-white" : "hover:border-b hover:border-indigo-500/50"} w-[24%] flex justify-center items-center px-2 py-1 pb-3 cursor-pointer`} onClick={() => setView("ALL")}>All</p>
          <p className={`${view === "ACTIVE" ? "border-b-3 border-indigo-500 text-white" : "hover:border-b hover:border-indigo-500/50"} w-[24%] flex justify-center items-center px-2 py-1 pb-3 cursor-pointer`} onClick={() => setView("ACTIVE")}>Active</p>
          <p className={`${view === "USED" ? "border-b-3 border-indigo-500 text-white" : "hover:border-b hover:border-indigo-500/50"} w-[24%] flex justify-center items-center px-2 py-1 pb-3 cursor-pointer`} onClick={() => setView("USED")}>Used</p>
          <p className={`${view === "EXPIRED" ? "border-b-3 border-indigo-500 text-white" : "hover:border-b hover:border-indigo-500/50"} w-[24%] flex justify-center items-center px-2 py-1 pb-3 cursor-pointer`} onClick={() => setView("EXPIRED")}>Expired</p>
        </div>
      </div>

      <div className='w-full h-fit py-4 mt-2'>
        {loading ? (
          <div className="w-full h-fit flex-col gap-4 justify-center items-center mt-10">
            <DataSkeleton />
          </div>
        ) : !loading && filteredTickets.length === 0 ? (
          <div className='h-fit min-h-[300px] w-full justify-center items-center flex'>
            <h1 className='text-2xl text-gray-500'>No Ticket Available</h1>
          </div>
        ) : (
          <div className='min-h-[220px] h-fit w-[100%] px-1 flex flex-wrap justify-between items-center gap-y-5'>
            {filteredTickets.map((ticket) => (
            <div key={ticket.id} className='group relative cursor-pointer bg-[#020613] border border-gray-800 w-full min-h-[220px] h-fit rounded-lg px-8 py-5' >
              <div className='relative w-full h-[30%]'>
                <p className='contentText text-xs text-slate-500! tracking-[0.15rem] uppercase'>Event Ticket</p>
                <h2 className='subtitle text-2xl mt-3 group-hover:text-indigo-500 transition-all ease-in-out duration-200'>{ticket.event.name}</h2>

                {ticket.used ? 
                <p className='absolute top-0 right-0 border border-blue-500 bg-blue-500/20 text-sm text-blue-500 px-2 py-1 rounded-xl'>Used</p>
                : new Date(ticket.event.endDate._seconds * 1000) < Timestamp.now().toDate() ?
                <p className='absolute top-0 right-0 border border-gray-500 bg-gray-500/20 text-sm text-gray-400 px-2 py-1 rounded-xl'>Expired</p>
                :
                <p className='absolute top-0 right-0 border border-green-500 bg-green-500/20 text-sm text-green-500 px-2 py-1 rounded-xl'>Active</p>
                }
              </div>

              <div className='relative w-full h-[70%] flex justify-center items-start pt-5'>
                <div className='w-full flex justify-start items-center gap-8'>
                  <div>
                    <p className='text-sm text-gray-400 flex justify-center items-center gap-1'>
                      <FaRegCalendar className="text-sm" />
                      {new Date(ticket.event.startDate._seconds * 1000).toLocaleString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          },
                        )}</p>
                  </div>

                  <div>
                    <p className='text-sm text-gray-400 flex justify-center items-center gap-1'>
                      <FaRegClock className='text-sm' />
                      {new Date(ticket.event.startDate._seconds * 1000).toLocaleString(
                          "en-GB",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          },
                        )}</p>
                  </div>

                  <div>
                    <p className='text-sm text-gray-400 flex justify-center items-center gap-1'>
                      <IoLocationOutline className="text-base!" />
                      {ticket.event.venue}
                      </p>
                  </div>
                </div>
              </div>

              <div className='absolute bottom-3 left-8'>
                <p className='text-xs text-gray-500'>Ticket ID</p>
                <p className='text-xs text-gray-400'>{ticket.id}</p>
              </div>

              <div className='absolute bottom-3 right-5 flex justify-center items-center gap-2 h-fit'>
                <Button
                  type="button"
                  onClick={() => {setSelectedTicket(ticket); setOpen(true);}}
                  className="flex gap-2 rounded-lg font-light tracking-[0.1rem] cursor-pointer bg-indigo-700/80 px-3 py-5 text-xs transition hover:bg-indigo-800/80"
                >
                  View Details
                </Button>

                <button onClick={() => {handlePrintTicket(ticket)}} className='cursor-pointer contentText py-3 px-3 rounded-lg !text-indigo-500 bg-indigo-500/10 hover:text-indigo-600! hover:bg-indigo-500/15 text-xs transition-all duration-300 ease-in-out flex justify-center items-center gap-1'>
                  <MdOutlineFileDownload className="text-lg" />
                </button>
              </div>
            </div>
            ))}

            <TicketModal ticket={selectedTicket} open={open} setOpen={setOpen} />
          </div>
        )}
      </div>
      </div>
      
      <div className='sticky -top-4 w-[24%] h-fit flex flex-col gap-3 justify-start items-center py-6'>
          <div className='w-full flex-col justify-start items-center bg-[#020613]! rounded-2xl px-3 py-5 border border-gray-800'>
            <h2 className='contentText text-slate-500! text-xs uppercase tracking-[0.15rem] mb-5'>Announcements By Priority</h2>
            <PieChart data={data} />
  
            <div className='mt-4 text-xs text-gray-400 flex flex-col items-center justify-center gap-1'>
              <p className='flex items-center gap-1 w-[70%] justify-between'><span className='flex justify-center items-center gap-1'><GoDotFill className='text-lg text-green-500' /> Active</span> <span className='text-base text-gray-200'>{data[2].value}</span></p>
              <p className='flex items-center gap-1 w-[70%] justify-between'><span className='flex justify-center items-center gap-1'><GoDotFill className='text-lg text-blue-500' /> Used</span> <span className='text-base text-gray-200'>{data[1].value}</span></p>
              <p className='flex items-center gap-1 w-[70%] justify-between'><span className='flex justify-center items-center gap-1'><GoDotFill className='text-lg text-red-500' /> Cancelled/Expired</span> <span className='text-base text-gray-200'>{data[0].value}</span></p>
            </div>
          </div>

          {/* <div className='w-full flex-col justify-start items-center bg-[#020613]! rounded-2xl px-3 py-5 border border-gray-800'>
            <h2 className='contentText text-slate-500! text-xs uppercase tracking-[0.15rem] mb-5'>Upcoming Events</h2>
            <PieChart data={data} />
  
            <div className='mt-4 text-xs text-gray-400 flex flex-col items-center justify-center gap-1'>
              <p className='flex items-center gap-1 w-[70%] justify-between'><span className='flex justify-center items-center gap-1'><GoDotFill className='text-lg text-green-500' /> Active</span> <span className='text-base text-gray-200'>{data[2].value}</span></p>
              <p className='flex items-center gap-1 w-[70%] justify-between'><span className='flex justify-center items-center gap-1'><GoDotFill className='text-lg text-blue-500' /> Used</span> <span className='text-base text-gray-200'>{data[1].value}</span></p>
              <p className='flex items-center gap-1 w-[70%] justify-between'><span className='flex justify-center items-center gap-1'><GoDotFill className='text-lg text-red-500' /> Cancelled/Expired</span> <span className='text-base text-gray-200'>{data[0].value}</span></p>
            </div>
          </div> */}
       </div>
      </div>
    </div>
  );
};

export default Tickets;