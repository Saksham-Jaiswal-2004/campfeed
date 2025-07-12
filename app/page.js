import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { PinContainer, PinPerspective } from "@/components/ui/3d-pin";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { FocusCards } from "@/components/ui/focus-cards";
import { FaRobot } from "react-icons/fa";
import { FaCalendar } from "react-icons/fa";
import { GoPeople } from "react-icons/go";
import { CiCalendar } from "react-icons/ci";
import { RiRobot2Line } from "react-icons/ri";
import Image from "next/image";
import Link from "next/link";

export default function Home() {

  const cards = [
    {
      title: "Centralized Announcements",
      src: "/images/featureImg-1.jpg",
      desc: "Never miss a campus update — from exam notices to GDG meetups.",
    },
    {
      title: "Event Hub",
      src: "/images/featureImg-2.jpg",
      desc: "View, RSVP, and participate in all your college events from one clean dashboard.",
    },
    {
      title: "AI-Powered CampusBot",
      src: "/images/featureImg-3.jpg",
      desc: "Get instant answers to your campus-related questions using Gemini AI.",
    },
  ];

  const testimonials = [
    {
      quote: "CampFeed is a game-changer for IIIT Kalyani! From club meetups to hackathons, I finally know what’s happening *before* it ends.",
      name: "Aarav Das",
      designation: "CSE 3rd Year, IIIT Kalyani",
      src: "/images/testImg-1.jpg"
    },
    {
      quote: "Managing events for our coding club has become 10x easier. We post once, and the whole campus sees it—love the reach!",
      name: "Sneha Roy",
      designation: "Lead, CodeCell IIIT Kalyani",
      src: "/images/testImg-3.jpg"
    },
    {
      quote: "Honestly, I used to miss half the campus events. Now? CampFeed’s reminders make sure I don’t miss out on free pizza and cool workshops.",
      name: "Ritik Ghosh",
      designation: "ECE 2nd Year, IIIT Kalyani",
      src: "/images/testImg-2.jpg"
    }
  ];

  return (
    <>
      <Navbar />
      <BackgroundBeams className="z-[-1]" />

      <div className="min-h-[100vh] h-fit flex flex-col justify-center items-center">

        <h1 className="title text-7xl mb-6 campfeed-title">CampFeed</h1>
        <h3 className="subTitle mb-2 text-[#64748b] text-[0.95rem]">Your Smart Campus Assistant</h3>
        <p className="contentText w-[40%] text-center text-base">Get real-time updates on events, announcements, and more — all in one place, powered by AI.</p>

        <div className="mt-8 flex justify-center items-center gap-6">
          <Link href={"/Chatbot"}><button className='cursor-pointer btnText btn-gradient text-sm flex justify-center items-center gap-2'><FaRobot className="text-xl" /> Ask CampBot</button></Link>
          <Link href={"/Events"}><button className='cursor-pointer btnText btn-gradient2 text-sm flex justify-center items-center gap-2'><FaCalendar className="text-base" /> View Events</button></Link>
        </div>

        <div className="flex justify-center items-center gap-16 text-sm mt-10 contentText">
          <div className="flex justify-center items-center gap-2"><GoPeople className="text-xl" /> 2500+ Students</div>

          <div className="flex justify-center items-center gap-2"><CiCalendar className="text-xl" /> 150+ Events</div>

          <div className="flex justify-center items-center gap-2"><RiRobot2Line className="text-xl" /> AI Powered</div>
        </div>
      </div>

      <div className="w-full h-fit flex flex-col justify-center items-center mt-28">
        <h2 className="subTitle text-3xl font-semibold mb-3">Why CampFeed? Seriously?</h2>
        <p className="contentText w-1/2 text-center text-sm mb-10">You&apos;re still chasing event posters across 5 WhatsApp groups, begging for updates from CRs, and asking “Is today a holiday?” in class groups?</p>
        <FocusCards cards={cards} />
      </div>

      <div className="w-full h-fit flex flex-col justify-center items-center mt-52">
        <h2 className="subTitle text-3xl font-semibold mb-3 text-center">Still Not Convinced?<br />Don&apos;t Take Our Word for It...</h2>
        <p className="contentText w-1/2 text-center text-sm mb-2">We didn&apos;t bribe them (much). CampFeed just makes student life smarter — and slightly less painful.</p>
        <AnimatedTestimonials testimonials={testimonials} />
      </div>

      <PinContainer title="Launch CampFeed" href="/Dashboard">
        <div className="w-[70vw] h-[45vh] relative rounded-xl overflow-hidden shadow-lg flex gap-8">
          <Image
            src="/images/ctaImg.jpg"
            alt="Event 1"
            width={400}
            height={400}
            className="object-cover"
          />

          <div className="flex flex-col justify-center items-start">
            <h2 className="title text-3xl mb-4 w-[60%]">Ready to streamline your campus?</h2>
            <p className="contentText text-base w-[80%]">CampFeed makes student life smarter, simpler, and more connected.</p>
          </div>
        </div>
      </PinContainer>

      <Footer />
    </>
  );
}