"use client";
import React from 'react'
import Link from 'next/link'
import { useEffect, useState } from "react";
import { FiShield } from "react-icons/fi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { CiFlag1 } from "react-icons/ci";
import { PiStudentFill } from "react-icons/pi";
import { MdKeyboardArrowDown } from "react-icons/md";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";

const Navbar = () => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const router = useRouter();
    const [show, setShow] = useState(false)

    useEffect(() => {
        const unsub = auth.onAuthStateChanged((u) => {
            if (u) {
                setUser(u);
            }
        });
        return () => unsub();
    }, []);

    useEffect(() => {
        if (!user) return;

        const fetchUserData = async () => {
            try {
                const userRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(userRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setUserData(data);
                    console.log("User Data: ", data);
                } else {
                    console.warn("User data not found in Firestore.");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, [user]);

    const handleLogout = async () => {
        await signOut(auth);
        router.push("/");
    };

    return (
        <div className='fixed top-3 left-[2.5vw] w-[95vw] flex justify-between items-center px-8 py-2 navbar z-[999]'>
            <div className="logo cursor-pointer">
                <Link href={"/"} className='flex justify-center items-center gap-2'>
                    <div className='h-8 w-8 rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-400 flex justify-center items-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bot h-5 w-5 text-white"><path d="M12 8V4H8"></path><rect width="16" height="12" x="4" y="8" rx="2"></rect><path d="M2 14h2"></path><path d="M20 14h2"></path><path d="M15 13v2"></path><path d="M9 13v2"></path></svg>
                    </div>
                    <h1 className='text-2xl font-bold bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent'>CampFeed</h1>
                </Link>
            </div>

            <div className="links flex justify-center items-center gap-[12vw]">
                <div className="routes">
                    <ul className='flex justify-center items-center gap-8 navText text-sm'>
                        <li className='cursor-pointer hover:text-[#3b82f6] transition-all duration-200 ease-in-out'><Link href={"/"}>Home</Link></li>
                        <li className='cursor-pointer hover:text-[#3b82f6] transition-all duration-200 ease-in-out'><Link href={"/Dashboard"}>Dashboard</Link></li>
                        <li className='cursor-pointer hover:text-[#3b82f6] transition-all duration-200 ease-in-out'><Link href={"/Chatbot"}>AI Chat</Link></li>
                        {userData?.role !== "student" && <li className='cursor-pointer hover:text-[#3b82f6] transition-all duration-200 ease-in-out'><Link href={"/Admin"}>Admin</Link></li>}
                    </ul>
                </div>

                <div className="auth">
                    {!user ? (
                        <Link href={"/auth/Login"}>
                            <button className='cursor-pointer btnText btn-gradient text-sm'>Login</button>
                        </Link>
                    ) : (
                        <>
                            <div className='flex justify-center items-center gap-2'>
                                {userData?.role === "admin" && <p className='w-fit text-xs text-violet-500'><span className='flex items-center gap-1 bg-violet-800/10 border border-violet-800 w-fit px-2 py-1 rounded-full'><FiShield />{userData.role}</span></p>}
                                {userData?.role === "faculty" && <p className='w-fit text-xs text-indigo-500'><span className='flex items-center gap-1 bg-indigo-800/10 border border-indigo-800 w-fit px-2 py-1 rounded-full'><FaChalkboardTeacher />{userData.role}</span></p>}
                                {userData?.role === "studentclub" && <p className='w-fit text-xs text-yellow-500'><span className='flex items-center gap-1 bg-yellow-800/10 border border-yellow-800/80 w-fit px-2 py-1 rounded-full'><CiFlag1 />{userData.role}</span></p>}
                                {userData?.role === "student" && <p className='w-fit text-xs text-green-500'><span className='flex items-center gap-1 bg-green-800/10 border border-green-800 w-fit px-2 py-1 rounded-full'><PiStudentFill />{userData.role}</span></p>}

                                <div onClick={() => { setShow(!show) }} className='px-4 py-2 bg-indigo-700/20 rounded-lg flex justify-center items-center cursor-pointer relative'>
                                    <img src={userData?.profilePic} alt="Profile" className="w-6 h-6 rounded-full mr-3" />
                                    <p className='text-sm navText mr-2'>{userData?.name?.split(" ")[0]}</p>
                                    <MdKeyboardArrowDown />
                                </div>
                            </div>

                            <div className={`${show ? "" : "hidden"} absolute bottom-[-105px] right-[30px] bg-indigo-700/30 w-[15%] rounded-lg py-3 px-2 flex flex-col justify-center items-center`}>
                                <button className='navText w-full hover:bg-indigo-700/30 text-sm text-center rounded-sm py-1'>Profile</button>
                                <button className='navText w-full hover:bg-indigo-700/30 text-sm text-center rounded-sm py-1'>Settings</button>
                                <button onClick={handleLogout} className='navText w-full hover:bg-indigo-700/30 text-sm text-center rounded-sm py-1'>Logout</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Navbar
