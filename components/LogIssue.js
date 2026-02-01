"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { FiUsers } from "react-icons/fi";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Camera,
  X,
  MapPin,
  Clock,
  Calendar,
  AlertTriangle,
  Shield,
  Share2,
  Loader2,
  MessageSquare,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "./ui/switch";

const categories = [
  { id: "academic", name: "Academic", icon: "Acha", color: "text-blue-500", bg: "bg-blue-50" },
  { id: "hostel", name: "Faculty / Department", icon: "Acha", color: "text-cyan-500", bg: "bg-cyan-50" },
  { id: "infrastructure", name: "Examination & Assessment", icon: "Acha", color: "text-amber-500", bg: "bg-amber-50" },
  { id: "mess", name: "Administrative / Office", icon: "Acha" ,color: "text-emerald-500", bg: "bg-emerald-50" },
  { id: "administration", name: "Hostel & Accomodation", icon: "Acha", color: "text-red-500", bg: "bg-red-50" },
  { id: "placements", name: "IT & Digital", icon: "Acha", color: "text-slate-500", bg: "bg-slate-50" },
  { id: "other", name: "Campus Facilities / Transport", icon: "Acha", color: "text-purple-500", bg: "bg-purple-50" },
  { id: "other", name: "Safety, Security & Discipline", icon: "Acha", color: "text-purple-500", bg: "bg-purple-50" },
  { id: "other", name: "Others", icon: "Acha", color: "text-purple-500", bg: "bg-purple-50" },
];

const steps = [
  { id: 1, name: "Category" },
  { id: 2, name: "Evidence" },
  { id: 3, name: "Details" },
  { id: 4, name: "Urgency" },
  { id: 5, name: "Submit" },
];

const LogIssue = ({setSelectedView}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    files: [],
    location: "Detecting location...",
    description: "",
    urgency: "medium",
    shareOnFeed: true,
  });

  useEffect(() => {
    if (currentStep === 3) {
      setTimeout(() => {
        setFormData((prev) => ({ ...prev, location: "221B Baker St, London NW1 6XE" }));
      }, 1500);
    }
  }, [currentStep]);

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length + 1));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFileUpload = (e) => {
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        files: [...prev.files, ...Array.from(e.target.files)],
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCurrentStep(6);
    }, 2500);
  };

  return (
    <div className="w-full h-screen overflow-y-scroll flex flex-col justify-start items-center">
      <div className="flex gap-1 justify-between items-center w-full px-5 mt-6">
        <div className="flex flex-col">
          <h2 className="subtitle text-3xl">Report a new Issue</h2>
          <p className="contentText">Track the progress of your submitted issues</p>
        </div>
      </div>

      {/* Progress Indicator */}
      {currentStep <= 5 && (
        <div className="space-y-4 justify-center items-center mb-6">
          <div className="flex justify-between items-center gap-8 px-1">
            {steps.map((s) => (
              <div key={s.id} className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors border-1",
                    currentStep == s.id
                      ? "bg-[#020613] border-gray-200 contentText !text-white"
                      : "bg-[#020613] border-gray-800 contentText !text-gray-400",
                  )}
                >
                  {currentStep > s.id ? <CheckCircle2 className="h-6 w-6" /> : s.id}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium",
                    currentStep === s.id ? "contentText !text-white" : "contentText !text-gray-400",
                  )}
                >
                  {s.name}
                </span>
              </div>
            ))}
          </div>
          {/* <Progress value={(currentStep / 5) * 100} className="h-2" /> */}
        </div>
      )}

      <AnimatePresence mode="wait">
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2"
          >
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setFormData((prev) => ({ ...prev, category: cat.id }));
                  nextStep();
                }}
                className={cn(
                  "flex flex-col items-center justify-center px-8 py-7 rounded-2xl border-2 transition-all hover!border-1 hover:!border-gray-500",
                  formData.category === cat.id
                    ? "border-gray-800 bg-[#020613]"
                    : "border-gray-800 bg-[#020613]",
                )}
              >
                <div
                  className={cn(
                    "h-16 w-16 rounded-full flex items-center justify-center mb-4",
                    cat.bg,
                  )}
                >
                  <cat.icon className={cn("h-8 w-8", cat.color)} />
                </div>
                <span className="font-semibold text-center">{cat.name}</span>
              </button>
            ))}
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6 w-full flex flex-col justify-center items-center"
          >
            <div className="w-[60%] border-2 border-dashed border-gray-700 px-12 py-28 rounded-xl text-center relative hover:border-gray-500 transition-colors bg-[#020613] group cursor-pointer">
              <input
                type="file"
                multiple
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleFileUpload}
              />
              <div className="flex flex-col items-center gap-4">
                <div className="h-20 w-20 rounded-full bg-gray-900 flex items-center justify-center group-hover:bg-gray-800 transition-colors">
                  <Camera className="h-10 w-10 contentText group-hover:!text-white transition-colors" />
                </div>
                <div className="space-y-1">
                  <p className="text-xl font-bold">Upload Evidence</p>
                  <p className="text-muted-foreground">Drag and drop photos or videos here</p>
                </div>
              </div>
            </div>

            {formData.files.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {formData.files.map((file, i) => (
                  <div key={i} className="relative aspect-square rounded-xl bg-muted overflow-hidden group">
                    <img src="/report-photo.jpg" alt="Preview" className="object-cover w-full h-full" />
                    <button
                      className="absolute top-2 right-2 p-1 bg-background/80 rounded-full text-destructive hover:bg-background"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, files: prev.files.filter((_, idx) => idx !== i) }))
                      }
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="absolute bottom-2 left-2">
                      <Badge className="bg-success">Detected: Pothole</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex w-3/5 justify-between items-center gap-4">
              <div variant="outline" size="lg" className="flex justify-center items-center h-14 bg-indigo-600/30 hover:bg-indigo-600/50 btnText rounded-lg px-16 py-2 cursor-pointer gap-2" onClick={prevStep}>
                <ChevronLeft className="h-4 w-4" /> Back
              </div>
              <div size="lg" className="flex justify-center items-center h-14 bg-indigo-600 hover:bg-indigo-700 btnText rounded-lg px-16 py-2 cursor-pointer gap-2" onClick={nextStep}>
                Continue <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6 w-full flex flex-col justify-center items-center"
          >
            <div className="space-y-4 w-3/5">
              <div htmlFor="desc" className="text-lg subtitle">
                Detailed Description
              </div>
              <textarea
                id="desc"
                placeholder="Describe your issue in detail..."
                className="min-h-[250px] bg-[#020316] rounded-lg w-full border border-gray-600 focus:!border-gray-600 text-base resize-none px-5 py-3"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                maxLength={500}
              />
              <div className="flex justify-between items-center text-sm">
                <p className="text-muted-foreground">{formData.description.length}/500 characters</p>
              </div>
            </div>
            <div className="flex w-3/5 justify-between items-center gap-4">
              <div variant="outline" size="lg" className="flex justify-center items-center h-14 bg-indigo-600/30 hover:bg-indigo-600/50 btnText rounded-lg px-16 py-2 cursor-pointer gap-2" onClick={prevStep}>
                <ChevronLeft className="h-4 w-4" /> Back
              </div>
              <div size="lg" className="flex justify-center items-center h-14 bg-indigo-600 hover:bg-indigo-700 btnText rounded-lg px-16 py-2 cursor-pointer gap-2" onClick={nextStep}>
                Continue <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6 w-full flex flex-col justify-center items-center h-fit"
          >
            <div className="space-y-4 w-[70%]">
              <label className="text-lg subtitle">Urgency Level</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4">
                {[
                  { id: "low", name: "Low", icon: Clock, desc: "Routine maintenance needed" },
                  { id: "medium", name: "Medium", icon: Calendar, desc: "Affects daily usage" },
                  { id: "high", name: "High", icon: AlertTriangle, desc: "Safety concern / Damage risk" },
                  { id: "critical", name: "Critical", icon: Shield, desc: "Immediate danger / Total failure" },
                ].map((u) => (
                  <button
                    key={u.id}
                    onClick={() => setFormData((prev) => ({ ...prev, urgency: u.id }))}
                    className={cn(
                      "flex flex-col bg-[#020316] justify-center items-center gap-3 px-2 py-8 rounded-xl border-1 border-gray-800 transition-all text-center",
                      formData.urgency === u.id
                        ? "bg-[#03051d] border-green-500/50"
                        : "",
                    )}
                  >
                    <div
                      className={cn(
                        "h-12 w-12 rounded-full flex items-center justify-center shrink-0",
                        formData.urgency === u.id ? "text-green-500" : "",
                      )}
                    >
                      <u.icon className="h-8 w-8" />
                    </div>
                    <div>
                      <p className="text-lg subTitle">{u.name}</p>
                      <p className="text-xs contentText">{u.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 w-[70%] bg-gray-900/20 rounded-xl border border-gray-600 flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-bold flex items-center gap-2">
                  Share on Community Feed <Share2 className="h-4 w-4 text-muted-foreground" />
                </p>
                <p className="text-xs text-muted-foreground">Allow others to upvote and comment on this issue</p>
              </div>
              <Switch />
            </div>

            <div className="flex w-[70%] justify-between items-center gap-4">
              <div variant="outline" size="lg" className="flex justify-center items-center h-14 bg-indigo-600/30 hover:bg-indigo-600/50 btnText rounded-lg px-16 py-2 cursor-pointer gap-2" onClick={prevStep}>
                <ChevronLeft className="h-4 w-4" /> Back
              </div>
              <div size="lg" className="flex justify-center items-center h-14 bg-indigo-600 hover:bg-indigo-700 btnText rounded-lg px-16 py-2 cursor-pointer gap-2" onClick={nextStep}>
                Continue <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6 w-full flex flex-col justify-center items-center h-fit"
          >
            <div className="space-y-4 w-[70%]">
              <label className="text-lg subtitle">Report Preview</label>
            </div>

            <div className="flex w-[70%] justify-between items-center gap-4">
              <div variant="outline" size="lg" className="flex justify-center items-center h-14 bg-indigo-600/30 hover:bg-indigo-600/50 btnText rounded-lg px-16 py-2 cursor-pointer gap-2" onClick={prevStep}>
                <ChevronLeft className="h-4 w-4" /> Back
              </div>
              <div size="lg" className="flex justify-center items-center h-14 bg-indigo-600 hover:bg-indigo-700 btnText rounded-lg px-16 py-2 cursor-pointer gap-2" onClick={nextStep}>
                Submit <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === 6 && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 w-3/5 flex flex-col justify-center items-center h-full"
          >
            <div className="space-y-4">
              <div className="relative h-32 w-32 rounded-full bg-green-500/30 flex items-center justify-center border-4 border-green-500/50">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              </div>
            </div>
            <div className="space-y-3 w-full flex flex-col text-center justify-center items-center">
              <h2 className="text-4xl font-extrabold subtitle">Report Logged</h2>
              <p className="text-lg contentText max-w-md mx-auto">
                Issue #CIV-1024-XQ has been assigned to Public Works. Expected resolution within 48 hours.
              </p>
            </div>
            
            <div className="flex w-[70%] justify-between items-center gap-4 mt-16">
              <div variant="outline" size="lg" className="flex justify-center items-center h-14 bg-indigo-600/30 hover:bg-indigo-600/50 btnText rounded-lg px-16 py-2 cursor-pointer gap-2" onClick={prevStep}>
                <ChevronLeft className="h-4 w-4" /> Back
              </div>
              <div size="lg" className="flex justify-center items-center h-14 bg-indigo-600 hover:bg-indigo-700 btnText rounded-lg px-16 py-2 cursor-pointer gap-2">
              {/* <button onClick = {() => {setSelectedView("StudentDash")}} className='cursor-pointer btnText bg-indigo-600/30 hover:bg-indigo-600/50 px-4 py-2 rounded-sm text-sm transition-all duration-200 ease-in-out flex justify-center items-center gap-2'> */}
                <button onClick = {() => {setSelectedView("StudentDash")}} className="flex justify-center items-center">
                  Dashboard <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LogIssue;

const Badge = ({ className, variant, ...props }) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border",
      variant === "secondary"
        ? "bg-secondary text-secondary-foreground border-secondary/30"
        : "bg-muted text-muted-foreground border-border",
      className,
    )}
    {...props}
  />
);