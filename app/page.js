"use client"
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { PinContainer } from "@/components/ui/3d-pin";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { FocusCards } from "@/components/ui/focus-cards";
import { FaRobot } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { cardData } from "@/constants/Cards";
import { testimonialsData } from "@/constants/Testimonials";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { useUser } from "@/context/userContext";
import Loader from "@/components/ui/Loader";
import { FaAngleRight } from "react-icons/fa6";

export default function Home() {

  const cards = cardData;
  const testimonials = testimonialsData;
  const { user, userData, login, logout, loading } = useUser();

  if (loading) return <Loader />;

  return (
    <>
      <Navbar />
      <BackgroundBeams className="z-[-1]" />

      <div className="min-h-[100vh] h-fit flex flex-col justify-center items-center relative">

        <h1 className="title text-[9rem] mb-4 campfeed-title">CampFeed</h1>
        <h3 className="absolute top-[18%] border border-gray-600 px-5 py-2 shadow-slate-300 shadow-sm backdrop-blur-lg rounded-full subTitle mb-2 text-gray-400 text-sm flex justify-center items-center gap-2">Your Unified Campus Platform <FaAngleRight /></h3>
        <p className="contentText w-[42%] text-center text-lg font-extralight! tracking-wider">Report issues, track announcements, discover events, and stay connected with everything happening across your campus - all in one smart dashboard.</p>

        <div className="mt-12 flex justify-center items-center gap-12">
          <Link href={"/Chatbot"}><button className='cursor-pointer btnText btn-gradient text-base flex justify-center items-center gap-2'><FaRobot className="text-3xl" /> Ask CampBot</button></Link>
          <Link href={"/StudentDash"}><button className='cursor-pointer btnText btn-gradient2 text-base flex justify-center items-center gap-2'><TbLayoutDashboardFilled className="text-3xl" /> Go to Dashboard</button></Link>
        </div>
      </div>

      <div className="flex justify-center items-center gap-8 px-8 py-10 mt-10 contentText bg-[#000512]">
          <div className="flex flex-col gap-2 justify-center items-center mx-20 my-4 text-5xl text-gray-200">15k+ <span className="text-sm! text-gray-400">Issues Resolved</span></div>
          <div className="flex flex-col gap-2 justify-center items-center mx-20 my-4 text-5xl text-gray-200">500+ <span className="text-sm! text-gray-400">Campus Events</span></div>
          <div className="flex flex-col gap-2 justify-center items-center mx-20 my-4 text-5xl text-gray-200">24/7 <span className="text-sm! text-gray-400">Announcements & Updates</span></div>
          <div className="flex flex-col gap-2 justify-center items-center mx-20 my-4 text-5xl text-gray-200">3k+ <span className="text-sm! text-gray-400">Students Connected</span></div>
      </div>

      <div className="w-full h-fit flex flex-col justify-center items-center mt-52">
        <h2 className="subTitle text-5xl font-semibold mb-3">Why CampFeed? <span className="text-7xl">Seriously?</span></h2>
        <p className="contentText w-1/2 text-center mb-10">Still reporting campus issues in random WhatsApp groups and hoping someone notices? Missing event updates, announcement deadlines, and important notices because everything&apos;s scattered everywhere?</p>
        <FocusCards cards={cards} />
      </div>

      <div className="w-full h-fit flex flex-col justify-center items-center mt-52">
        <h2 className="subTitle text-7xl font-semibold text-center">Still Not Convinced?</h2>
        <h2 className="subTitle text-5xl font-semibold mb-3 text-center">Don&apos;t Take Our Word for It...</h2>
        <p className="contentText w-1/2 text-center mt-1 mb-2">We didn&apos;t bribe them (much). CampFeed just makes student life smarter - and slightly less painful.</p>
        <AnimatedTestimonials testimonials={testimonials} />
      </div>

      <PinContainer title="Launch CampFeed" href="/StudentDash">
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