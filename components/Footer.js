"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { MdEmail } from "react-icons/md";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";

const Footer = () => {

    const faqs = [
        {
            question: "What is CampFeed?",
            answer:
                "CampFeed is a central platform to discover, promote, and manage events happening across your campus — including fests, workshops, club meets, and more.",
        },
        {
            question: "Who can use CampFeed?",
            answer:
                "CampFeed is built for students, clubs, faculty coordinators, and event organizers across colleges and universities.",
        },
        {
            question: "How can I submit my event to CampFeed?",
            answer:
                "Use the “Submit Event” button on the homepage or contact your club admin. You’ll need basic details like event name, date, venue, and description.",
        },
        {
            question: "Is CampFeed free to use?",
            answer:
                "Yes, CampFeed is completely free for students and institutions. We aim to make campus life more organized and fun — without any cost.",
        },
        {
            question: "Can I follow specific clubs or categories?",
            answer:
                "Yes! You can filter events by club, category, or department. Personalized recommendations and notifications are coming soon.",
        },
        {
            question: "How do I report an incorrect or inappropriate event?",
            answer:
                "Click on the “Report” option inside the event card or contact us directly at support@campfeed.in.",
        },
        {
            question: "Is my data safe on CampFeed?",
            answer:
                "Absolutely. We follow strict data privacy practices and only collect necessary information to improve your experience.",
        },
        {
            question: "Does CampFeed support multiple campuses or universities?",
            answer:
                "Currently, we’re focused on single-campus rollouts. Multi-campus support is on the roadmap.",
        },
    ];

    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(prev => (prev === index ? null : index));
    };

    return (
        <div className='h-fit bg-[#010c28] mt-56'>
            <div className='flex justify-start items-start pt-5 gap-28'>
                <div className='w-[20%] py-5 flex flex-col gap-4'>
                    <Link href={"/"} className='flex justify-center items-center gap-2'>
                        <div className='h-10 w-10 rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-400 flex justify-center items-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bot h-7 w-7 text-white"><path d="M12 8V4H8"></path><rect width="16" height="12" x="4" y="8" rx="2"></rect><path d="M2 14h2"></path><path d="M20 14h2"></path><path d="M15 13v2"></path><path d="M9 13v2"></path></svg>
                        </div>
                        <h1 className='text-3xl font-bold bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent'>CampFeed</h1>
                    </Link>

                    <div className='flex justify-center items-end gap-1 contentText'>
                        <MdEmail className='text-xl' />
                        <span> - support@campfeed.in</span>
                    </div>

                    <div className='flex justify-center items-center text-3xl gap-5'>
                        <a href="https://github.com/Saksham-Jaiswal-2004" target='_blank'><FaGithub className='rounded-md text-[#64748b] hover:text-[#ebebeb] transition-all duration-200 ease-in-out' /></a>
                        <a href="https://www.linkedin.com/in/saksham-jaiswal-220637302/" target='_blank'><FaLinkedin className='rounded-md text-[#64748b] hover:text-[#ebebeb] transition-all duration-200 ease-in-out' /></a>
                        <a href="https://www.instagram.com/saksham__jaiswal/?next=%2F" target='_blank'><FaInstagramSquare className='rounded-md text-[#64748b] hover:text-[#ebebeb] transition-all duration-200 ease-in-out' /></a>
                    </div>
                </div>

                <div className='w-[55%] py-5 px-12'>
                    <h2 className='subtitle text-2xl mb-4'>Frequently Avoided Questions<br /><span className='font-medium text-lg'>(But We Answered Anyway)</span></h2>
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

                            <hr className='w-[98%] mt-2 justify-self-center text-gray-600' />
                        </div>
                    ))}
                </div>
            </div>

            <div className='w-full flex justify-center items-center py-2'>
                <p className='navText text-sm'>&copy; {new Date().getFullYear()} CampFeed | All Rights Reserved</p>
            </div>
        </div>
    )
}

export default Footer
