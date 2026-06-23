"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useUser } from "@/context/userContext";
import { useRouter } from "next/navigation";
import BlockSkeleton from './ui/BlockSkeleton';
import { useTickets } from '@/hooks/useTickets';
import { ticketService } from '@/services/ticket.service';
import { Timestamp } from 'firebase/firestore';
import TicketModal from './TicketModal';

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

  return (
    <div className='w-full h-screen overflow-y-scroll flex flex-col justify-start items-center px-5'>
      <div className='flex gap-1 justify-between items-center w-full mt-6'>
        <div className='flex flex-col'>
          <h2 className='subtitle text-3xl'>Your Event Tickets</h2>
          <p className='contentText'>Manage and view all your event tickets</p>
        </div>
      </div>

      <div className='flex gap-5 justify-between items-center w-full my-5'>
        <div className='w-[24%] h-[135px] flex flex-col justify-center border border-gray-800 bg-[#020613] rounded-lg p-3'>
          <div className='mb-5 flex justify-between pr-3'>
            <p className='contentText text-sm'>Total Tickets</p>
          </div>

          <p className='subtitle text-3xl pl-2 mb-1 flex items-center gap-1'><span className='text-white text-4xl ml-1 mr-2'>•</span> {tickets.length}</p>
          <p className='text-[#64748b] text-xs'><span className='text-green-500'>+12%</span> from last month</p>
        </div>

        <div className='w-[24%] h-[135px] flex flex-col justify-center border border-gray-800 bg-[#020613] rounded-lg p-3'>
          <div className='mb-5 flex justify-between pr-3'>
            <p className='contentText text-sm'>Active Tickets</p>
          </div>

          <p className='subtitle text-3xl pl-2 mb-1 flex items-center gap-1'><span className='text-green-500 text-4xl ml-1 mr-2'>•</span> {tickets.filter(ticket => !ticket.used && new Date(ticket.event.endDate._seconds * 1000) > Timestamp.now().toDate()).length}</p>
          <p className='text-[#64748b] text-xs'><span className='text-green-500'>+3%</span> from last month</p>
        </div>

        <div className='w-[24%] h-[135px] flex flex-col justify-center border border-gray-800 bg-[#020613] rounded-lg p-3'>
          <div className='mb-5 flex justify-between pr-3'>
            <p className='contentText text-sm'>Used Tickets</p>
          </div>

          <p className='subtitle text-3xl pl-2 mb-1 flex items-center gap-1'><span className='text-blue-500 text-4xl ml-1 mr-2'>•</span> {tickets.filter(ticket => ticket.used).length}</p>
          <p className='text-[#64748b] text-xs'><span className='text-green-500'>+5%</span> from last month</p>
        </div>

        <div className='w-[24%] h-[135px] flex flex-col justify-center border border-gray-800 bg-[#020613] rounded-lg p-3'>
          <div className='mb-5 flex justify-between pr-3'>
            <p className='contentText text-sm'>Cancelled / Expired Tickets</p>
          </div>

          <p className='subtitle text-3xl pl-2 mb-1 flex items-center gap-1'><span className='text-red-500 text-4xl ml-1 mr-2'>•</span> {tickets.filter(ticket =>  new Date(ticket.event.endDate._seconds * 1000) < Timestamp.now().toDate()).length}</p>
          <p className='text-[#64748b] text-xs'><span className='text-green-500'>+5.2%</span> from last month</p>
        </div>
      </div>

      <div className='flex justify-between w-full relative'>
        <div className='flex justify-between items-center w-[30%] bg-indigo-900/20 rounded-sm px-2 py-1'>
          <p className={`${view === "ALL" ? "bg-indigo-800/80" : "hover:bg-indigo-800/20"} w-[24%] flex justify-center items-center px-2 py-1 rounded-sm cursor-pointer`} onClick={() => setView("ALL")}>All</p>
          <p className={`${view === "ACTIVE" ? "bg-indigo-800/80" : "hover:bg-indigo-800/20"} w-[24%] flex justify-center items-center px-2 py-1 rounded-sm cursor-pointer`} onClick={() => setView("ACTIVE")}>Active</p>
          <p className={`${view === "USED" ? "bg-indigo-800/80" : "hover:bg-indigo-800/20"} w-[24%] flex justify-center items-center px-2 py-1 rounded-sm cursor-pointer`} onClick={() => setView("USED")}>Used</p>
          {/* <p className={`${view === "CANCELLED" ? "bg-indigo-800/80" : "hover:bg-indigo-800/20"} w-[19%] flex justify-center items-center px-2 py-1 rounded-sm cursor-pointer`} onClick={() => setView("CANCELLED")}>Cancelled</p> */}
          <p className={`${view === "EXPIRED" ? "bg-indigo-800/80" : "hover:bg-indigo-800/20"} w-[24%] flex justify-center items-center px-2 py-1 rounded-sm cursor-pointer`} onClick={() => setView("EXPIRED")}>Expired</p>
        </div>
      </div>

      <div className='w-full h-fit py-4 mt-2'>
        {loading ? (
          <div className="w-full h-full flex flex-wrap gap-10 justify-center items-center mt-10">
            <BlockSkeleton />
            <BlockSkeleton />
            <BlockSkeleton />
          </div>
        ) : !loading && filteredTickets.length === 0 ? (
          <div className='h-fit min-h-[300px] w-full justify-center items-center flex'>
            <h1 className='text-2xl text-gray-500'>No Ticket Available</h1>
          </div>
        ) : (
          <div className='min-h-[220px] h-fit w-[100%] px-1 flex flex-wrap justify-between items-center gap-y-5'>
            {filteredTickets.map((ticket) => (
            <div key={ticket.id} className='group bg-[#081849]/10 hover:bg-[#081849]/20 border border-gray-800 hover:border-indigo-500/30 w-[49%] h-[300px] rounded-lg px-8 py-5' onClick={() => {setSelectedTicket(ticket); setOpen(true);}}>
              <div className='relative w-full h-[30%]'>
                <p className='contentText text-sm'>Event Ticket</p>
                <h2 className='subtitle text-2xl mt-3 group-hover:text-indigo-500'>{ticket.event.name}</h2>

                {ticket.used ? 
                <p className='absolute top-0 right-0 border border-blue-500 bg-blue-500/20 text-sm text-blue-500 px-2 py-1 rounded-xl'>Used</p>
                : new Date(ticket.event.endDate._seconds * 1000) < Timestamp.now().toDate() ?
                <p className='absolute top-0 right-0 border border-gray-500 bg-gray-500/20 text-sm text-gray-400 px-2 py-1 rounded-xl'>Expired</p>
                :
                <p className='absolute top-0 right-0 border border-green-500 bg-green-500/20 text-sm text-green-500 px-2 py-1 rounded-xl'>Active</p>
                }
              </div>

              <hr className='border-gray-500 border-dashed' />

              <div className='relative w-full h-[70%] flex justify-center items-start pt-5'>
                <div className='w-1/2 flex flex-col gap-4'>
                  <div>
                    <p className='text-sm text-gray-400'>Date</p>
                    <p className='text-lg'>{new Date(ticket.event.startDate._seconds * 1000).toLocaleString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          },
                        )}</p>
                  </div>

                  <div>
                    <p className='text-sm text-gray-400'>Venue</p>
                    <p className='text-lg'>{ticket.event.venue}</p>
                  </div>
                </div>

                <div className='w-1/2'>
                  <div>
                    <p className='text-sm text-gray-400'>Time</p>
                    <p className='text-lg'>{new Date(ticket.event.startDate._seconds * 1000).toLocaleString(
                          "en-GB",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          },
                        )}</p>
                  </div>
                </div>

                <div className='absolute bottom-0 right-0'>
                  <p className='text-sm text-gray-600'>Ticket ID</p>
                  <p className='text-sm text-gray-500'>{ticket.id}</p>
                </div>
              </div>
            </div>
            ))}

            <TicketModal ticket={selectedTicket} open={open} setOpen={setOpen} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Tickets;