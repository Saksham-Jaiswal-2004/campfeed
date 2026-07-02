"use client";
import { FaRegCalendar } from "react-icons/fa6";
import { SlClock } from "react-icons/sl";
import { IoLocationOutline } from "react-icons/io5";
import { GoPeople } from "react-icons/go";
import { FaRegUser } from "react-icons/fa6";
import { Progress } from "@/components/ui/progress";
import RSVPButton from "@/components/RSVPButton";
import { IoIosArrowForward } from "react-icons/io";
import ShareButton from "@/components/ShareButton";
import { useEffect, useState } from "react";
import { CiBookmark } from "react-icons/ci";
import { PiWarningCircle } from "react-icons/pi";
import { api } from "@/lib/api";
import { eventService } from "@/services/events.service";
import { useEventStore } from "@/store/eventStore";
import DataSkeleton from "./ui/DataSkeleton";
import { FaRegHeart } from "react-icons/fa";
import { Tooltip, TooltipContent, TooltipTrigger, } from "@/components/ui/tooltip"

export default function EventPage({ setSelectedView, id }) {
  const [view, setView] = useState("About");
  const data = useEventStore((s) => s.selectedEvent);
  const loading = useEventStore((s) => s.loading);

  useEffect(() => {
    try {
      eventService.fetchEventById(id);
    } catch (err) {
      console.error(err);
      setData(null);
    }
  }, []);

  if (!id)
    return (
      <div className="h-screen w-screen flex justify-center items-center text-xl">
        Event ID not provided
      </div>
    );

  if (loading) return (
    <div className="w-[80%] h-full flex flex-col justify-center items-center gap-8">
      <DataSkeleton />
      <DataSkeleton />
    </div>
  );
  if (!data) return <p>Event not found</p>;

  const startDate = new Date(data.startDate?._seconds * 1000);
  const registered = data.registered ?? 0;
  const capacity = data.capacity ?? 1;
  const tags = data.tags ?? [];
  const venue = data.venue ?? "TBA";
  const organiser = data.organiser ?? "Unknown";
  const contactInfo = data.contactInfo ?? "Not provided";

  return (
    <div className="w-full h-screen overflow-y-scroll flex justify-between items-start px-5">
      <div className="flex flex-col justify-center items-center mt-2 px-4 py-8 w-[75%] h-fit">
        <p className="mb-2 text-xs contentText flex justify-start items-center gap-2 w-full h-fit">
          <button
            onClick={() => {
              setSelectedView("StudentDash");
            }}
            className="hover:text-white"
          >
            Dashboard
          </button>
          <IoIosArrowForward />
          <button
            onClick={() => {
              setSelectedView("EventList");
            }}
            className="hover:text-white"
          >
            Events
          </button>
          <IoIosArrowForward />
          <span className="!text-white !text-sm">{data.name || "Event"}</span>
        </p>

        <div className="flex justify-between items-center w-full my-4">
          <div>
            <h1 className="text-5xl title">{data.name || "Event"}</h1>
          </div>
          <div className="flex justify-center items-center gap-2">
            <Tooltip>
              <TooltipTrigger>
                <ShareButton
                  title={data.name || "Event"}
                  text={`Check out this Event: ${data.name || "Event"}`}
                />
              </TooltipTrigger>
            
              <TooltipContent>
                <p>Share</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger>
                <button className="text-lg px-3 py-2 border border-gray-700 hover:bg-gray-700/20 rounded-md contentText transition-all duration-200 ease-in-out">
                  <CiBookmark />
                </button>
              </TooltipTrigger>

              <TooltipContent>
                <p>Bookmark</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger>
                <button className="text-lg px-3 py-2 border border-gray-700 hover:bg-gray-700/20 rounded-md contentText transition-all duration-200 ease-in-out">
                  <PiWarningCircle />
                </button>
              </TooltipTrigger>

              <TooltipContent>
                <p>Report</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="w-[100%] h-[350px] bg-gray-600 rounded-lg overflow-hidden">
          <img
            src="/images/Skeleton.png"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex gap-3 text-sm mt-2 flex-wrap w-full px-2">
          {tags.map((tag, index) => (
            <p
              key={index}
              className="border border-gray-700 bg-cyan-500/50 contentText py-1 px-2 rounded-lg"
            >
              {tag}
            </p>
          ))}
        </div>

        <div className='flex justify-start items-center gap-2 w-full rounded-sm px-2 py-1 text-slate-400 my-2'>
          <p className={`${view === "About" ? "border-b-3 border-indigo-500 text-indigo-400" : "hover:border-b hover:border-indigo-500/50"} w-[13%] flex justify-center items-center px-1 py-1 pb-2 cursor-pointer`} onClick={() => setView("About")}>About</p>
          <p className={`${view === "Schedule" ? "border-b-3 border-indigo-500 text-indigo-400" : "hover:border-b hover:border-indigo-500/50"} w-[13%] flex justify-center items-center px-1 py-1 pb-2 cursor-pointer`} onClick={() => setView("Schedule")}>Schedule</p>
          <p className={`${view === "FAQs" ? "border-b-3 border-indigo-500 text-indigo-400" : "hover:border-b hover:border-indigo-500/50"} w-[13%] flex justify-center items-center px-1 py-1 pb-2 cursor-pointer`} onClick={() => setView("FAQs")}>FAQs</p>
        </div>

        <div className="w-full min-h-[42.5vh] h-fit flex justify-center items-start gap-4 mb-4 border border-gray-800 bg-[#020613] rounded-md p-4">
          {view === "About" &&
          <div className="w-full min-h-[42.5vh] h-fit">
            <h2 className="subtitle text-xl">About the event</h2>
            <p className="px-2 mt-2 contentText">
              {data.description || "No description provided."}
            </p>
          </div>
          }
        </div>
      </div>

      <div className="relative w-[25%] h-full flex flex-col justify-start items-center">
        <div className="mt-30 h-fit w-full flex flex-col justify-start items-center gap-2 px-2 py-6">
        <div className="w-full h-fit border border-gray-800 bg-[#020613] rounded-md p-4">
            <h2 className="subtitle text-base">Event Information</h2>

            <div className="w-full flex flex-col gap-2 items-start pl-2 mt-4">
              <>
                <p className="flex justify-center items-center gap-2 text-sm navText contentText">
                  <FaRegCalendar />{" "}
                  {startDate.toLocaleString("en-GB", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p className="flex justify-center items-center gap-2 text-sm navText contentText">
                  <SlClock />{" "}
                  {startDate.toLocaleString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
              </>
              <p className="flex justify-center items-center gap-2 text-xs navText contentText">
                <IoLocationOutline className="text-base" /> {venue}
              </p>
              <p className="flex justify-center items-center gap-2 text-xs navText contentText">
                <GoPeople className="text-base" /> {registered}/{capacity}{" "}
                Registered
              </p>
              <div className="w-full mt-1">
                <Progress value={(registered / capacity) * 100} />
                <p className="w-full flex justify-end items-center text-xs mt-1 text-gray-400">{capacity - registered === 1 ? `1 spot left` : `${capacity - registered} spots left`}</p>
              </div>
            </div>
          </div>

        <div className="relative w-full h-fit border border-gray-800 bg-[#020613] rounded-md p-4">
            <h2 className="subtitle text-base">Registration</h2>

            <div className="w-full flex flex-col gap-2 items-start pl-2 mt-4">
              <>
                <p className="flex justify-between w-full items-center gap-2 text-xs navText contentText">
                  Registration Fee

                  <span>Free</span>
                </p>
                <p className="flex justify-between w-full items-center gap-2 text-xs navText contentText mt-1">
                  Registration Ends
                  <span>08 Jul 2026, 11:59 pm </span>
                </p>
              </>

              <hr className="w-full justify-self-center border border-gray-800 my-3" />

              {/* <button className="w-full flex justify-center items-center gap-2 text-gray-300 bg-red-500/10 mb-1 border px-4 py-2 btnText rounded-md border-red-500/20 hover:bg-red-500/80 hover:text-white transition-all ease-in-out duration-200">
                <FaRegHeart />
                Like
              </button> */}

              <RSVPButton eventId={id} registered={registered} />
            </div>

            <span className="absolute top-5 right-4 text-green-500 bg-green-500/20 border-green-500/50 border px-2 py-0.5 text-[0.65rem] rounded-full">Open</span>
          </div>

          <div className="border border-gray-800 mt-0 w-full bg-[#020613] h-fit rounded-md p-4 pb-8">
            <h2 className="subtitle text-base">Organiser</h2>

            <div className="w-full flex justify-start items-center gap-3 px-4 mt-2">
              <div className="bg-gradient-to-r from-indigo-500 to-cyan-500 p-4 rounded-full">
                <FaRegUser className="text-2xl" />
              </div>

              <div className="w-fit flex flex-col">
                <h3 className="subtitle text-base">{organiser}</h3>
                <p className="contentText text-xs w-full! h-fit! text-wrap!">{contactInfo}</p>
              </div>
            </div>
          </div>

          <div className="w-full h-fit flex justify-center items-start gap-4 mb-4">
          <div className="w-full h-fit border border-gray-800 bg-[#020613] rounded-md px-4 py-4 flex justify-center items-center">
            <div className="w-full h-fit flex flex-col justify-center items-center gap-2">
              <button
                className="px-4 py-2 w-full contentText text-sm rounded-sm bg-indigo-600/30 hover:bg-indigo-600/50 cursor-pointer disabled:opacity-50"
                onClick={() => {
                  setSelectedView("Announcements");
                }}
              >
                View All Announcements
              </button>
              <button
                className="px-4 py-2 w-full contentText text-sm rounded-sm bg-indigo-600/30 hover:bg-indigo-600/50 cursor-pointer disabled:opacity-50"
                onClick={() => {
                  setSelectedView("EventList");
                }}
              >
                Explore Events
              </button>
              <button
                className="px-4 py-2 w-full contentText text-sm rounded-sm bg-indigo-600/30 hover:bg-indigo-600/50 cursor-pointer disabled:opacity-50"
                onClick={() => {
                  setSelectedView("LogIssue");
                }}
              >
                Report an Issue
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
