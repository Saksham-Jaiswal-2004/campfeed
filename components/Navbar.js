import React from 'react'
import Link from 'next/link'

const Navbar = () => {
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
                        <li className='cursor-pointer hover:text-[#3b82f6] transition-all duration-200 ease-in-out'><Link href={"/Admin"}>Admin</Link></li>
                    </ul>
                </div>

                <div className="auth">
                    <Link href={"/auth/Login"}>
                    <button className='cursor-pointer btnText btn-gradient text-sm'>Login</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Navbar
