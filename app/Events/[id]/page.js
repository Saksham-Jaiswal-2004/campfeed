import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import { FaRegCalendar } from "react-icons/fa6";
import { SlClock } from "react-icons/sl";
import { IoLocationOutline } from "react-icons/io5";
import { GoPeople } from "react-icons/go";
import { FaRegUser } from "react-icons/fa6";
import { Progress } from "@/components/ui/progress"
import Link from "next/link";
import RSVPButton from "@/components/RSVPButton";
import { IoIosArrowForward } from "react-icons/io";

export async function generateMetadata({ params }) {

    const { id } = params;

    const docRef = doc(db, "events", id);
    const snap = await getDoc(docRef);

    if (!snap.exists()) return { title: "Not Found" };

    return {
        title: snap.data().name || "Event",
    };
}

export default async function EventPage({ params }) {
    
    const { id } = params;

    const docRef = doc(db, "events", id);
    const snap = await getDoc(docRef);

    if (!snap.exists()) return notFound();

    const data = snap.data();

    return (
        <div className="w-full min-h-screen overflow-y-scroll flex flex-col justify-start items-center">
            <Navbar />

            <div className="flex flex-col justify-center items-center mt-24 px-4 w-[60%] h-fit">
                <p className="mb-2 text-xs contentText flex justify-start items-center gap-2 w-full"><Link href="/Dashboard" className="hover:text-white">Dashboard</Link> <IoIosArrowForward />{" "} <Link href="/Events" className="hover:text-white">Events</Link> <IoIosArrowForward /> <span className="!text-white !text-sm">{data.name}</span></p>

                <div className="flex justify-between items-center w-full my-4">
                    <div>
                        <h1 className="text-3xl title">{data.name}</h1>
                        <p className="text-[#9dacc2] dark:text-gray-300 whitespace-pre-line">
                            {data.description}
                        </p>
                    </div>

                    <div></div>
                </div>

                <div className="w-[100%] h-[50vh] bg-gray-600 rounded-lg overflow-hidden"></div>

                <div className="flex gap-3 text-sm mt-2 flex-wrap w-full px-2">
                    {data.tags?.map((tag, index) => (
                        <p key={index} className="border border-gray-700 bg-cyan-500/50 contentText py-1 px-2 rounded-lg">
                            {tag}
                        </p>
                    ))}
                </div>

                <div className="w-full h-full flex justify-center items-start gap-4 my-4">
                    <div className="w-[68%] min-h-[50vh] h-fit border border-gray-700 rounded-md p-4">
                        <h2 className="subtitle text-xl">Event Details</h2>
                        <p className="px-4 mt-2 contentText">{data.description}</p>
                    </div>

                    <div className="w-[30%] h-fit min-h-[50vh] border border-gray-700 rounded-md p-4">
                        <h2 className="subtitle text-base">Event Information</h2>

                        <div className="w-full flex flex-col gap-2 items-start pl-2 mt-4">
                            <p className='flex justify-center items-center gap-2 text-sm navText contentText'><FaRegCalendar /> {new Date(data.startDate.toDate()).toLocaleString("en-GB", {
                                weekday: "long",
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                            })}</p>
                            <p className='flex justify-center items-center gap-2 text-sm navText contentText'><SlClock /> {new Date(data.startDate.toDate()).toLocaleString("en-GB", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                            })}</p>
                            <p className='flex justify-center items-center gap-2 text-xs navText contentText'><IoLocationOutline className='text-base' /> {data.venue}</p>
                            <p className='flex justify-center items-center gap-2 text-xs navText contentText'><GoPeople className='text-base' /> {data.registered}/{data.capacity} Registered</p>
                            <div className='w-full mt-1'>
                                <Progress value={(data.registered / data.capacity) * 100} />
                            </div>

                            <hr className="w-full justify-self-center border border-gray-800 my-3" />

                            <RSVPButton eventId={id} />
                            <button className="px-4 py-2 w-full contentText btnText text-sm rounded-sm hover:bg-gray-600/20 border border-gray-700 disabled:opacity-50">Add to Calendar</button>
                        </div>
                    </div>
                </div>

                <div className="w-full h-full flex justify-center items-start gap-4 mb-4">
                    <div className="w-[30%] h-fit min-h-[22vh] border border-gray-700 rounded-md p-4">
                        <h2 className="subtitle text-base">Related</h2>

                        <div className="w-full h-[10vh] flex flex-col justify-center items-center gap-1 mt-3">
                            <Link href={"/Announcements"} className="w-full"><button className="px-4 py-2 w-full contentText text-sm rounded-sm hover:bg-gray-600/20 border border-gray-700 disabled:opacity-50">View All Announcements</button></Link>
                            <Link href={"/Events"} className="w-full"><button className="px-4 py-2 w-full contentText text-sm rounded-sm hover:bg-gray-600/20 border border-gray-700 disabled:opacity-50">Explore Events</button></Link>
                        </div>
                    </div>

                    <div className="border border-gray-700 mt-0 w-[68%] h-fit min-h-[22vh] rounded-md p-4">
                        <h2 className="subtitle text-base">Organiser</h2>

                        <div className="w-full flex justify-start items-center gap-3 px-4 mt-2">
                            <div className="bg-gradient-to-r from-indigo-500 to-cyan-500 p-4 rounded-full">
                                <FaRegUser className="text-2xl" />
                            </div>

                            <div>
                                <h3 className="subtitle text-base">{data.organiser}</h3>
                                <p className="contentText text-sm">{data.contactInfo}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}