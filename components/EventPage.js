"use client"
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import { FaRegCalendar } from "react-icons/fa6";
import { SlClock } from "react-icons/sl";
import { IoLocationOutline } from "react-icons/io5";
import { GoPeople } from "react-icons/go";
import { FaRegUser } from "react-icons/fa6";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import RSVPButton from "@/components/RSVPButton";
import { IoIosArrowForward } from "react-icons/io";
import ShareButton from "@/components/ShareButton";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function EventPage({setSelectedView, id}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      try {
        const docRef = doc(db, "events", id);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          setData(snap.data());
        } else {
          setData(null);
        }
      } catch (err) {
        console.error(err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (!id) return <div className="h-screen w-screen flex justify-center items-center text-xl">Event ID not provided</div>;

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>Event not found</p>;

  const startDate = data.startDate?.toDate ? new Date(data.startDate.toDate()) : null;
  const registered = data.registered ?? 0;
  const capacity = data.capacity ?? 1;
  const tags = data.tags ?? [];
  const venue = data.venue ?? "TBA";
  const organiser = data.organiser ?? "Unknown";
  const contactInfo = data.contactInfo ?? "Not provided";

  return (
    <div className="w-full h-screen overflow-y-scroll flex flex-col justify-start items-center">

      <div className="flex flex-col justify-center items-center mt-8 px-4 py-8 w-[85%] h-fit">
        <p className="mb-2 text-xs contentText flex justify-start items-center gap-2 w-full">
          <button onClick={() => {setSelectedView("StudentDash")}} className="hover:text-white">Dashboard</button>
          <IoIosArrowForward />
          <button onClick={() => {setSelectedView("EventList")}} className="hover:text-white">Events</button>
          <IoIosArrowForward />
          <span className="!text-white !text-sm">{data.name || "Event"}</span>
        </p>

        <div className="flex justify-between items-center w-full my-4">
          <div>
            <h1 className="text-5xl title">{data.name || "Event"}</h1>
            {/* <p className="text-[#9dacc2] dark:text-gray-300 whitespace-pre-line">
              {data.description || "No description provided."}
            </p> */}
          </div>
          <div>
            <ShareButton title={data.name || "Event"} text={`Check out this Event: ${data.name || "Event"}`} />
          </div>
        </div>

        <div className="w-[100%] h-[350px] bg-gray-600 rounded-lg overflow-hidden">
          <img 
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/overflowing-dumpster-x1cBEefLftHFa7DMvTW6HJwbBgrq54.png" 
          alt="" 
          className="h-full w-full object-cover"
          />
        </div>

        <div className="flex gap-3 text-sm mt-2 flex-wrap w-full px-2">
          {tags.map((tag, index) => (
            <p key={index} className="border border-gray-700 bg-cyan-500/50 contentText py-1 px-2 rounded-lg">
              {tag}
            </p>
          ))}
        </div>

        <div className="w-full h-fit flex justify-center items-start gap-4 my-4">
          <div className="w-[68%] min-h-[50vh] h-fit border border-gray-700 rounded-md p-4">
            <h2 className="subtitle text-3xl">{ data.name }</h2>
            <p className="px-4 mt-2 contentText">{data.description || "No description provided."}</p>
          </div>

          <div className="w-[30%] h-fit min-h-[50vh] border border-gray-700 rounded-md p-4">
            <h2 className="subtitle text-base">Event Information</h2>

            <div className="w-full flex flex-col gap-2 items-start pl-2 mt-4">
              {startDate && (
                <>
                  <p className="flex justify-center items-center gap-2 text-sm navText contentText">
                    <FaRegCalendar /> {startDate.toLocaleString("en-GB", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
                  </p>
                  <p className="flex justify-center items-center gap-2 text-sm navText contentText">
                    <SlClock /> {startDate.toLocaleString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: true })}
                  </p>
                </>
              )}
              <p className="flex justify-center items-center gap-2 text-xs navText contentText">
                <IoLocationOutline className="text-base" /> {venue}
              </p>
              <p className="flex justify-center items-center gap-2 text-xs navText contentText">
                <GoPeople className="text-base" /> {registered}/{capacity} Registered
              </p>
              <div className="w-full mt-1">
                <Progress value={(registered / capacity) * 100} />
              </div>

              <hr className="w-full justify-self-center border border-gray-800 my-3" />

              <RSVPButton eventId={id} />
              <button className="px-4 py-2 w-full contentText btnText text-sm rounded-sm hover:bg-gray-600/20 border border-gray-700 disabled:opacity-50">
                Add to Calendar
              </button>
            </div>
          </div>
        </div>

        <div className="w-full h-fit flex justify-center items-start gap-4 mb-4">
          <div className="w-[30%] h-fit min-h-[22vh] border border-gray-700 rounded-md p-4 flex justify-center items-center">
            {/* <h2 className="subtitle text-base">Related</h2> */}
            <div className="w-full h-[10vh] flex flex-col justify-center items-center gap-1">
                <button className="px-4 py-2 w-full contentText text-sm rounded-sm hover:bg-gray-600/20 border border-gray-700 disabled:opacity-50"
                onClick={() => {setSelectedView("Announcements")}}
                >
                  View All Announcements
                </button>
                <button className="px-4 py-2 w-full contentText text-sm rounded-sm hover:bg-gray-600/20 border border-gray-700 disabled:opacity-50"
                onClick={() => {setSelectedView("EventList")}}
                >
                  Explore Events
                </button>
                <button className="px-4 py-2 w-full contentText text-sm rounded-sm hover:bg-gray-600/20 border border-gray-700 disabled:opacity-50"
                onClick={() => {setSelectedView("LogIssue")}}
                >
                  Report an Issue
                </button>
            </div>
          </div>

          <div className="border border-gray-700 mt-0 w-[68%] h-fit min-h-[22vh] rounded-md p-4">
            <h2 className="subtitle text-base">Organiser</h2>

            <div className="w-full flex justify-start items-center gap-3 px-4 mt-2">
              <div className="bg-gradient-to-r from-indigo-500 to-cyan-500 p-4 rounded-full">
                <FaRegUser className="text-2xl" />
              </div>

              <div>
                <h3 className="subtitle text-base">{organiser}</h3>
                <p className="contentText text-sm">{contactInfo}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}