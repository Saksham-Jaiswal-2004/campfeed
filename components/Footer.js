"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { MdEmail } from "react-icons/md";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { Issue_Faqs, Event_Faqs, Announcement_Faqs } from '@/constants/FAQs';

const Footer = () => {
    const [openIndex, setOpenIndex] = useState(null);
    const [faqType, setfaqType] = useState(Issue_Faqs);

    const faqs = faqType;

    const toggleFAQ = (index) => {
        setOpenIndex(prev => (prev === index ? null : index));
    };

    return (
        <div className='h-fit bg-[#010c28] mt-56'>
            <div className=' h-fit flex justify-start items-start pt-5 px-8 gap-40'>
                <div className='w-[27%] py-5 flex flex-col justify-center items-start gap-6'>
                    <Link href={"/"} className='flex justify-center items-center gap-2'>
                        <div className='h-18 w-18 rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-400 flex justify-center items-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bot h-12 w-12 text-white"><path d="M12 8V4H8"></path><rect width="16" height="12" x="4" y="8" rx="2"></rect><path d="M2 14h2"></path><path d="M20 14h2"></path><path d="M15 13v2"></path><path d="M9 13v2"></path></svg>
                        </div>
                        <h1 className='text-5xl font-bold bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent'>CampFeed</h1>
                    </Link>

                    <div className='flex justify-center items-center text-3xl gap-5'>
                        <a href="https://github.com/Saksham-Jaiswal-2004" target='_blank'><FaGithub className='rounded-md text-[#64748b] hover:text-[#ebebeb] transition-all duration-200 ease-in-out' /></a>
                        <a href="https://www.linkedin.com/in/saksham-jaiswal-220637302/" target='_blank'><FaLinkedin className='rounded-md text-[#64748b] hover:text-[#ebebeb] transition-all duration-200 ease-in-out' /></a>
                        <a href="mailto:sakshamjaiswalofficial@gmail.com" target='_blank'><MdEmail className='rounded-md text-[#64748b] hover:text-[#ebebeb] transition-all duration-200 ease-in-out text-4xl' /></a>
                    </div>

                    <div className='flex flex-col text-gray-400 mt-88'>
                        <p className='text-6xl mb-3'>Still Confused?</p>
                        <p className='text-lg mb-1'>That&apos;s okay, CampFeed is smart, but not psychic</p>
                        <p className='text-base'>Reach out to us directly and we&apos;ll sort it out before your next canteen break</p>
                    </div>
                </div>

                <div className='w-[55%] py-5 px-12'>
                    <h2 className='subtitle text-2xl mb-4'>Frequently Avoided Questions<br /><span className='font-medium text-lg'>(But We Answered Anyway)</span></h2>

                    <div className='mb-5 px-4 py-2 w-full flex gap-2 justify-center items-center bg-[#020818] rounded-md'>
                        <span className={`${faqType === Issue_Faqs ? "bg-indigo-500" : "hover:bg-gray-800"} w-[32%] px-2 py-1 cursor-pointer flex justify-center items-center font-semibold rounded-sm`} onClick={() => setfaqType(Issue_Faqs)}>Issues</span>
                        <span className={`${faqType === Event_Faqs ? "bg-indigo-500" : "hover:bg-gray-800"} w-[32%] px-2 py-1 cursor-pointer flex justify-center items-center font-semibold rounded-sm`} onClick={() => setfaqType(Event_Faqs)}>Events</span>
                        <span className={`${faqType === Announcement_Faqs ? "bg-indigo-500" : "hover:bg-gray-800"} w-[32%] px-2 py-1 cursor-pointer flex justify-center items-center font-semibold rounded-sm`} onClick={() => setfaqType(Announcement_Faqs)}>Announcements</span>
                    </div>

                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="pb-5"
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full text-left hover:!text-white cursor-pointer flex justify-between items-center text-base font-medium contentText focus:outline-none"
                            >
                                <span>{faq.question}</span>
                                <svg
                                    className={`w-5 h-5 transform border border-gray-400 rounded-full p-1 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""
                                        }`}
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {openIndex === index && (
                                <p className="text-sm text-[#a4a9b2] mt-2 transition duration-300">
                                    {faq.answer}
                                </p>
                            )}

                            <hr className='w-[98%] mt-2 justify-self-center text-gray-600 border border-gray-700' />
                        </div>
                    ))}
                </div>
            </div>

            <div className='w-full flex justify-between items-center pt-6 pb-9 border-t border-gray-600 px-15'>
                <p className='navText text-sm'>&copy; {new Date().getFullYear()} CampFeed | All Rights Reserved</p>

                <div className='flex gap-8'>
                    <a href="" className='font-semibold text-[#64748b] hover:text-[#ebebeb] transition-all duration-200 ease-in-out'>Privacy Policy</a>
                    <a href="" className='font-semibold text-[#64748b] hover:text-[#ebebeb] transition-all duration-200 ease-in-out'>Terms of Service</a>
                    <a href="" className='font-semibold text-[#64748b] hover:text-[#ebebeb] transition-all duration-200 ease-in-out'>Cookie Policy</a>
                </div>
            </div>
        </div>
    )
}

export default Footer
