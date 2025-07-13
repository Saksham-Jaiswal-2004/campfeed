"use client"
import React, { useState, useRef, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import { IoMdSend } from "react-icons/io";
import { RiRobot2Line } from "react-icons/ri";
import { toast } from "sonner"

const Page = () => {

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([{ sender: "gemini", text: "Hey! I'm CampBot 🤖 — Ask me about campus stuff!", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (customMessage) => {
    const userText = typeof customMessage === "string" ? customMessage : input;
    if (!userText.trim()) return;

    setInput("");
    setLoading(true);

    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text: userText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);

    // Add Gemini loading message
    setMessages((prev) => [...prev, { sender: "gemini", text: "Loading...", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });

      const data = await res.json();

      // Replace last Gemini "..." message with real response
      setMessages((prev) => {
        const newMsgs = [...prev];
        newMsgs[newMsgs.length - 1] = { sender: "gemini", text: data.text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        return newMsgs;
      });
    } catch (err) {
      console.error("Error:", err);

      // Replace Gemini message with error
      setMessages((prev) => {
        const newMsgs = [...prev];
        newMsgs[newMsgs.length - 1] = {
          sender: "gemini",
          text: "❌ Something went wrong. Try again.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        return newMsgs;
      });
    }

    setLoading(false);
  };


  return (
    <div className="min-h-[100vh] h-fit flex justify-center items-center">
      <Navbar />

      <div className='w-full h-screen flex justify-center items-end pb-4 gap-8'>
        <div className='w-[70%] h-[87%] border border-gray-700 overflow-hidden rounded-lg flex flex-col justify-between items-center'>
          <div className='w-full h-[89%] pr-4 pl-3 py-4 overflow-y-scroll bg-gray-900'>
            {messages.map((msg, idx) => (
              <div key={idx} className={`w-full flex ${msg.sender === "user" ? "justify-end" : "justify-start"} mb-2 items-start gap-2`}>
                {msg.sender === "gemini" ? <RiRobot2Line className='text-xl bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-full p-[0.35rem] w-8 h-8' /> : ""}
                <p className={`relative max-w-[75%] px-4 pt-3 pb-6 my-2 rounded-xl text-[0.8rem] whitespace-pre-line min-w-[80px] ${msg.sender === "user" ? "bg-indigo-600 !text-white rounded-br-none contentText" : "bg-gray-800 text-gray-100 rounded-tl-none chatbotReply"}`}>
                  {msg.text}
                  <span className={`btnText !font-light text-[0.7rem] absolute ${msg.sender === "gemini" ? "left-4 bottom-1 text-gray-400" : "right-4 bottom-1 text-blue-100"}`}>{msg.time}</span>
                </p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className='w-full h-[12%] flex justify-center items-center gap-3 py-1'>
            <input type="text" name="" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())} id="" placeholder='Ask me anything about campus life...' className='text-sm w-[90%] h-[75%] rounded-2xl outline-none px-4 border border-gray-800 focus:border-gray-700 bg-[#161a24] contentText' />
            <button onClick={sendMessage} className={`contentText ${loading ? "bg-gray-600 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 cursor-pointer"} px-4 py-[0.6rem] rounded-xl transition-all duration-200 ease-in-out`} disabled={loading}><IoMdSend className='text-lg' /></button>
          </div>
        </div>

        <div className='w-[22%] h-[87%] rounded-lg flex flex-col justify-start items-center gap-3'>
          <div className='border border-gray-700 px-5 py-4 rounded-lg w-[95%]'>
            <h2 className='subtitle text-lg mb-3'>Quick Questions</h2>

            <div className='contentText flex flex-col w-full gap-2'>
              <p className='cursor-pointer border rounded-md p-2 text-sm border-gray-700 hover:text-white hover:bg-gray-700/20' onClick={() => { sendMessage("Next GDG Event?") }}>Next GDG Event?</p>
              <p className='cursor-pointer border rounded-md p-2 text-sm border-gray-700 hover:text-white hover:bg-gray-700/20' onClick={() => { sendMessage("How to register for GSoC?") }}>How to register for GSoC?</p>
              <p className='cursor-pointer border rounded-md p-2 text-sm border-gray-700 hover:text-white hover:bg-gray-700/20' onClick={() => { sendMessage("Placement Roadmap") }}>Placement Roadmap</p>
              <p className='cursor-pointer border rounded-md p-2 text-sm border-gray-700 hover:text-white hover:bg-gray-700/20' onClick={() => { sendMessage("Library Hours?") }}>Library Hours?</p>
            </div>
          </div>

          <div className='border border-gray-700 px-5 py-3 rounded-lg w-[95%]'>
            <h2 className='subtitle text-lg mb-3'>Popular Topics</h2>

            <div className='contentText flex flex-col w-full gap-1'>
              <p className='cursor-pointer rounded-md px-6 py-2 text-xs border-gray-700 hover:text-white hover:bg-gray-700/20' onClick={() => { sendMessage("Upcoming Events") }}>Upcoming Events</p>
              <p className='cursor-pointer rounded-md px-6 py-2 text-xs border-gray-700 hover:text-white hover:bg-gray-700/20' onClick={() => { sendMessage("Placement Drives") }}>Placement Drives</p>
              <p className='cursor-pointer rounded-md px-6 py-2 text-xs border-gray-700 hover:text-white hover:bg-gray-700/20' onClick={() => { sendMessage("Academic Deadlines") }}>Academic Deadlines</p>
              <p className='cursor-pointer rounded-md px-6 py-2 text-xs border-gray-700 hover:text-white hover:bg-gray-700/20' onClick={() => { sendMessage("Club Activities") }}>Club Activities</p>
              <p className='cursor-pointer rounded-md px-6 py-2 text-xs border-gray-700 hover:text-white hover:bg-gray-700/20' onClick={() => { sendMessage("Library Services") }}>Library Services</p>
              <p className='cursor-pointer rounded-md px-6 py-2 text-xs border-gray-700 hover:text-white hover:bg-gray-700/20' onClick={() => { sendMessage("Campus Facilities") }}>Campus Facilities</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
