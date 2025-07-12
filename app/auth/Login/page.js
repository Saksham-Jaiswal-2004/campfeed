"use client";
import React from 'react'
import Link from 'next/link'
import { BackgroundBeamsWithCollision } from '@/components/ui/background-beams-with-collision'
import { FaGoogle } from "react-icons/fa";
import { auth, provider, db } from "@/lib/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

const Page = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const loginWithGoogle = async () => {
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const userRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(userRef);

            if (!docSnap.exists()) {
                
                router.replace("/auth/ProfilePage");
            } else {
                
                router.replace("/Dashboard");
            }
        } catch (err) {
            console.error("Login Error", err);
        }
        setLoading(false);
    };

    const handleLogout = async () => {
        await signOut(auth);
        router.push("/auth/Login");
    };

    return (
        <>
            <BackgroundBeamsWithCollision className={"fixed z-[-1]"} />
            <div className='h-screen flex justify-center items-center gap-1 flex-col'>
                <div className='lg:w-[32%] sm:w-[60%] w-[95%] px-6'><Link href={"/"} className='text-sm bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text hover:text-transparent navText'>Back to CampFeed</Link></div>
                <div className='bg-blue-900/10 backdrop-blur-sm rounded-xl sm:px-8 px-2 py-6 lg:w-[32%] sm:w-[60%] w-[95%] flex flex-col justify-center items-center'>
                    <div className='h-20 w-20 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 flex justify-center items-center mb-4'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bot h-10 w-10 text-white"><path d="M12 8V4H8"></path><rect width="16" height="12" x="4" y="8" rx="2"></rect><path d="M2 14h2"></path><path d="M20 14h2"></path><path d="M15 13v2"></path><path d="M9 13v2"></path></svg>
                    </div>

                    <h1 className='title sm:text-3xl text-2xl mb-1 bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent'>Welcome to CampFeed</h1>
                    <p className='text-base text-gray-400'>Your AI-powered campus companion</p>

                    <button onClick={loginWithGoogle} className={`${loading ? "cursor-not-allowed !bg-indigo-700" : ""} bg-gradient-to-r from-indigo-500 to-cyan-400 hover:bg-gradient-to-br transition-all duration-200 ease-in-out w-full py-2 rounded-lg text-lg my-5 flex justify-center items-center gap-5`} disabled={loading}><FaGoogle className='text-2xl' /> {loading ? "Logging In..." : "Continue with Google"}</button>

                    <p className='text-xs contentText my-1'>CampusPulse uses secure authentication to protect your data</p>
                    <p className='text-xs contentText my-1'>By continuing, you agree to our Terms of Service and Privacy Policy</p>

                    <div className='flex flex-col items-start w-full px-4 mt-4 text-sm bg-[#020818]/80 p-4 rounded-xl'>
                        <h3>What you&apos;ll get access to:</h3>
                        <ul className='list-disc px-6 contentText mt-1'>
                            <li>AI-powered campus assistant</li>
                            <li>Real-time event updates</li>
                            <li>Important announcements</li>
                            <li>Personalized recommendations</li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Page
