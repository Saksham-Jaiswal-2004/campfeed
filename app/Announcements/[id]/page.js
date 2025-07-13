import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import { SlClock } from "react-icons/sl";
import Link from "next/link";
import { IoIosArrowForward } from "react-icons/io";
import { CgDanger } from "react-icons/cg";
import { MdOutlineInfo } from "react-icons/md";
import { FiCheckCircle } from "react-icons/fi";
import ShareButton from "@/components/ShareButton";

export async function generateMetadata({ params }) {

    const { id } = params;

    const docRef = doc(db, "announcements", id);
    const snap = await getDoc(docRef);

    if (!snap.exists()) return { title: "Not Found" };

    return {
        title: snap.data().name || "Announcement",
    };
}

async function getUserById(uid) {
    try {
        const userRef = doc(db, "users", uid);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
            return snap.data();
        } else {
            console.warn(`No user found with UID: ${uid}`);
            return null;
        }
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        return null;
    }
}

export default async function EventPage({ params }) {

    const { id } = params;

    const docRef = doc(db, "announcements", id);
    const snap = await getDoc(docRef);
    const fullUrl = `https://campfeed.vercel.app/Events/${id}`;

    if (!snap.exists()) return notFound();

    const data = snap.data();
    const user = await getUserById(data?.createdBy);

    return (
        <div className="w-full min-h-screen overflow-y-scroll flex flex-col justify-start items-center">
            <Navbar />

            <div className="flex flex-col justify-center items-center mt-24 px-4 w-[60%] h-fit">
                <p className="mb-2 text-xs contentText flex justify-start items-center gap-2 w-full"><Link href="/Dashboard" className="hover:text-white">Dashboard</Link> <IoIosArrowForward />{" "} <Link href="/Announcements" className="hover:text-white">Announcements</Link> <IoIosArrowForward /> <span className="!text-white !text-sm">{data.title}</span></p>

                <div className="flex justify-between items-center w-full my-4">
                    <div>
                        <h1 className="text-3xl title">{data.title}</h1>
                    </div>

                    <div>
                        <ShareButton title={data.name} url={fullUrl} text={`Check out this Announcement: ${data.name}`} />
                    </div>
                </div>

                <div className="flex gap-3 text-sm mt-2 flex-wrap w-full px-2">
                    {data.tags?.map((tag, index) => (
                        <p key={index} className="border border-gray-700 bg-cyan-500/50 contentText py-1 px-2 rounded-lg">
                            {tag}
                        </p>
                    ))}
                </div>

                <div className="w-full h-full flex justify-center items-start gap-4 my-4">
                    <div className="w-[68%] min-h-[75vh] h-fit border border-gray-700 rounded-md p-4">
                        <div className="flex gap-3 justify-start items-center px-2">
                            <div>
                                <img src={user.profilePic} alt={user.name} className="rounded-full w-15 h-15" />
                            </div>

                            <div className="w-full">
                                <div className="flex justify-between items-center w-full">
                                    <h3>{user.username}</h3>
                                    <span className='border border-gray-700 contentText py-[0.15rem] px-2 rounded-lg !text-white !text-xs'>{user?.role}</span>
                                </div>
                                <p className="text-xs contentText">{user.email}</p>
                            </div>
                        </div>

                        <hr className="border border-gray-800 my-4" />

                        <p className="px-4 contentText text-sm">{data.description}</p>
                    </div>

                    <div className="flex flex-col justify-center items-center gap-4 w-[30%]">
                        <div className="w-full h-fit min-h-[50vh] border border-gray-700 rounded-md p-4">
                            <h2 className="subtitle text-base">Announcement Details</h2>

                            <div className="w-full flex flex-col gap-5 items-start pl-6 mt-4">
                                <div className="flex flex-col justify-center items-start gap-0">
                                    <p className="!text-gray-500 contentText text-base">Priority</p>
                                    {data.priority === "High" && (
                                        <p className='text-xs flex items-center gap-1 text-red-400 bg-red-500/20 p-1 rounded-lg border border-red-800/30'>
                                            <CgDanger /> High Priority
                                        </p>
                                    )}
                                    {data.priority === "Medium" && (
                                        <p className='text-xs flex items-center gap-1 text-yellow-400 bg-yellow-500/20 p-1 rounded-lg border border-yellow-800/30'>
                                            <MdOutlineInfo /> Medium Priority
                                        </p>
                                    )}
                                    {data.priority === "Low" && (
                                        <p className='text-xs flex items-center gap-1 text-green-400 bg-green-500/20 p-1 rounded-lg border border-green-800/30'>
                                            <FiCheckCircle /> Low Priority
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col justify-center items-start gap-0">
                                    <p className="!text-gray-500 contentText text-base">Target Audience</p>
                                    <span className='border border-gray-700 contentText py-1 px-2 rounded-full !text-white bg-blue-400/70 text-sm'>{data.targetAudience}</span>
                                </div>

                                <div className="flex flex-col justify-center items-start gap-0">
                                    <p className="!text-gray-500 contentText text-base">Published On</p>
                                    <p className="flex contentText text-sm">{new Date(data.createdAt.toDate()).toLocaleString("en-GB", {
                                        weekday: "long",
                                        day: "2-digit",
                                        month: "long",
                                        year: "numeric",
                                    })} at {new Date(data.createdAt.toDate()).toLocaleString("en-GB", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                    })}</p>
                                </div>
                            </div>
                        </div>

                        <div className="w-full h-fit min-h-[22vh] border border-gray-700 rounded-md p-4">
                            <h2 className="subtitle text-base">Related</h2>

                            <div className="w-full h-[10vh] flex flex-col justify-center items-center gap-1 mt-3">
                                <Link href={"/Announcements"} className="w-full"><button className="px-4 py-2 w-full contentText text-sm rounded-sm hover:bg-gray-600/20 border border-gray-700 disabled:opacity-50">View All Announcements</button></Link>
                                <Link href={"/Events"} className="w-full"><button className="px-4 py-2 w-full contentText text-sm rounded-sm hover:bg-gray-600/20 border border-gray-700 disabled:opacity-50">Explore Events</button></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}