"use client";
import React from 'react'
import Link from 'next/link'
import { useEffect, useState } from "react";
import { FiShield } from "react-icons/fi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { CiFlag1 } from "react-icons/ci";
import { PiStudentFill } from "react-icons/pi";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useUser } from "@/context/userContext";
import { useRouter } from "next/navigation";
import { CiUser } from "react-icons/ci";
import { IoIosLogOut } from "react-icons/io";
import { IoChatbox } from "react-icons/io5";

const Navbar = () => {
    const { user, userData, login, logout, loading } = useUser();
    const router = useRouter();
    const [show, setShow] = useState(false)
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        let timeout;
        const handleScroll = () => {
            if(window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }

            // if(window.scrollY > 20) {
            //     setScrolled(true);
            // } 

            // clearTimeout(timeout);

            // timeout = setTimeout(() => {
            //     setScrolled(false);
            // }, 50);
        };

        window.addEventListener("scroll", handleScroll);

        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const handleLogout = async () => {
        await logout();
        router.push("/");
        router.refresh;
    };

    return (
        <div className='w-screen fixed top-0 left-0 flex justify-center items-center pt-0 z-[999]'>
          <div className={`flex justify-between items-center px-10 py-4 navbar ${scrolled ? "bg-[#000035]/40 backdrop-blur-3xl w-[75%] mt-2 rounded-2xl" : "w-full"} transition-all ease-in-out duration-500`}>
              <div className="logo w-fit flex justify-start items-center">
                  <Link href={"/"} prefetch={true} className='flex justify-center items-center gap-2 cursor-pointer'>
                      <div className='h-9 w-9 rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-400 flex justify-center items-center'>
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bot h-6 w-6 text-white"><path d="M12 8V4H8"></path><rect width="16" height="12" x="4" y="8" rx="2"></rect><path d="M2 14h2"></path><path d="M20 14h2"></path><path d="M15 13v2"></path><path d="M9 13v2"></path></svg>
                      </div>
                      <h1 className='text-2xl font-bold bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent'>CampFeed</h1>
                  </Link>
              </div>
  
              <div className="links flex justify-between items-center w-fit gap-16">
                  <div className="routes">
                      <ul className='flex justify-center items-center gap-8 navText text-sm'>
                          <li className='cursor-pointer hover:text-indigo-500 text-slate-300 transition-all duration-200 ease-in-out'><Link prefetch={true} href={"/"}>Home</Link></li>
                          {/* <li className='cursor-pointer hover:text-[#3b82f6] transition-all duration-200 ease-in-out'><Link prefetch={true} href={"/Dashboard"}>Updates</Link></li> */}
                          <li className='cursor-pointer hover:text-indigo-500 text-slate-300 transition-all duration-200 ease-in-out'><Link prefetch={true} href={"/StudentDash"}>Dashboard</Link></li>
                          <li className='cursor-pointer hover:text-indigo-500 text-slate-300 transition-all duration-200 ease-in-out'><Link prefetch={true} href={"/Chatbot"}>AI Chat</Link></li>
                          {userData && userData?.role !== "Student" && <li className='cursor-pointer hover:text-indigo-500 text-slate-300 transition-all duration-200 ease-in-out'><Link href={"/Admin"}>Admin</Link></li>}
                      </ul>
                  </div>
  
                  <div className="auth">
                      {!user ? (
                          <Link href={"/auth/Login"} prefetch={true}>
                              <button className='cursor-pointer btnText btn-gradient text-sm'>Login</button>
                          </Link>
                      ) : (
                          <>
                              <div className='flex justify-center items-center gap-2'>
                                  {userData?.role === "Admin" && <p className='w-fit text-xs text-violet-500'><span className='flex items-center gap-1 bg-violet-800/10 border border-violet-800 w-fit px-2 py-1 rounded-full'><FiShield />Admin</span></p>}
                                  {userData?.role === "Faculty" && <p className='w-fit text-xs text-indigo-500'><span className='flex items-center gap-1 bg-indigo-800/10 border border-indigo-800 w-fit px-2 py-1 rounded-full'><FaChalkboardTeacher />Faculty</span></p>}
                                  {userData?.role === "Student Club" && <p className='w-fit text-xs text-yellow-500'><span className='flex items-center gap-1 bg-yellow-800/10 border border-yellow-800/80 w-fit px-2 py-1 rounded-full'><CiFlag1 />Student Club</span></p>}
                                  {userData?.role === "Student" && <p className='w-fit text-xs text-green-500'><span className='flex items-center gap-1 bg-green-800/10 border border-green-800 w-fit px-2 py-1 rounded-full'><PiStudentFill />Student</span></p>}
  
                                  <div onClick={() => { setShow(!show) }} className={` ${show ? "bg-indigo-700/15" : "hover:bg-indigo-700/10"} px-4 py-2 rounded-lg flex justify-center items-center cursor-pointer relative`}>
                                      <img src={userData?.profilePic} alt="Profile" className="w-6 h-6 rounded-full mr-3" />
                                      <p className='text-sm navText mr-2'>{userData?.name?.split(" ")[0]}</p>
                                      <MdKeyboardArrowDown className={`${ show ? "rotate-180" : "" } transition-all ease-in-out duration-300`} />

                                      <div className={`${show ? "animate-in zoom-in-90 duration-50" : "animate-out zoom-out-90 duration-50 hidden"} absolute top-[110%] right-[0px] bg-[#000c30] min-w-full w-fit rounded-2xl py-4 px-4 flex flex-col justify-center items-center gap-1`}>
                                        <div className='border-b border-gray-700 pb-2 mb-2'>
                                            <p className='text-sm text-gray-300'>{userData.name}</p>
                                            <p className='text-xs text-gray-400'>{userData.email}</p>
                                        </div>

                                        <Link href={"/Profile"} className='w-full'><button className='navText w-full hover:bg-indigo-900/15 hover:text-gray-300 text-gray-400 text-sm rounded-sm px-3 py-2 flex justify-start items-center gap-2'><CiUser className='text-lg' /> Profile</button></Link>
                                        <button onClick={handleLogout} className='navText w-full hover:bg-red-600/10 hover:text-red-500/90 text-red-500/80 text-sm rounded-sm px-3 py-2 flex justify-start items-center gap-2'><IoIosLogOut className='text-base' /> Logout</button>
                                      </div>
                                  </div>
                              </div>
  
                              {/* <div className={`${show ? "animate-in zoom-in-90 duration-50" : "transition-all ease-out duration-50 hidden"} absolute bottom-[-76px] right-[30px] bg-indigo-700/30 w-[100%] rounded-lg py-3 px-2 flex flex-col justify-center items-center`}>
                                  <Link href={"/Profile"} className='w-full'><button className='navText w-full hover:bg-indigo-700/30 text-sm text-center rounded-sm py-1 flex justify-center items-center gap-2'><CiUser className='text-lg' /> Profile</button></Link>
                                  <button onClick={handleLogout} className='navText w-full hover:bg-indigo-700/30 text-sm text-center rounded-sm py-1 flex justify-center items-center gap-2'><IoIosLogOut className='text-base' /> Logout</button>
                              </div> */}
                          </>
                      )}
                  </div>
              </div>
          </div>

          <div className='fixed bottom-5 right-5'>
            <Link href={"/Chatbot"} prefetch={true} className='flex justify-center items-center'>
                <div className='h-18 w-18 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 flex justify-center items-center'>
                    {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bot h-6 w-6 text-white"><path d="M12 8V4H8"></path><rect width="16" height="12" x="4" y="8" rx="2"></rect><path d="M2 14h2"></path><path d="M20 14h2"></path><path d="M15 13v2"></path><path d="M9 13v2"></path></svg> */}
                    <IoChatbox className='text-4xl' />
                </div>
            </Link>
          </div>
        </div>
    )
}

export default Navbar
