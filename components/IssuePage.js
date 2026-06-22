"use client"
import React, { useEffect, useState, useRef } from "react";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { IoIosArrowForward } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import DeleteIssueModal from "@/components/DeleteIssueModal";
import ShareButton from "@/components/ShareButton";
import { useUser } from "@/context/userContext";
import { RxCross1 } from "react-icons/rx";
import { CiBookmark } from "react-icons/ci";
import { PiWarningCircle } from "react-icons/pi";
import { Switch } from "./ui/switch";
import { FaArrowUp } from "react-icons/fa6";
import { useIssueChat } from "@/hooks/useIssueChat";
import { sendMessage } from "@/services/chat.service";
import { api } from "@/lib/api";
import { changeStatus, editIssue } from "@/services/issueService";
import DataSkeleton from "./ui/DataSkeleton";

const categoryOptions = [
  { id: "CAT001", label: "Academic" },
  { id: "CAT002", label: "Faculty/Department" },
  { id: "CAT003", label: "Education & Assessment" },
  { id: "CAT004", label: "Administrative/Office" },
  { id: "CAT005", label: "Hostel/Accomodation" },
  { id: "CAT006", label: "IT & Digital" },
  { id: "CAT007", label: "Campus Facilities/Transport" },
  { id: "CAT008", label: "Safety, Security & Discipline" },
  { id: "CAT009", label: "Others" },
];

const priorityOptions = ["low", "medium", "high", "critical"];

export default function IssuePage({ setSelectedView, id, mode = "public" }) {
  const [data, setData] = useState(null);
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [noteUpdating, setNoteUpdating] = useState(false);
  const [note, setNote] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    category_id: "",
    priority: "",
  });
  const [shareOnFeed, setShareOnFeed] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const bottomRef = useRef(null);
  const { user, userData } = useUser();
  const { messages } = useIssueChat(id);

  const effectiveMode = (mode === "creator" || (user && data && user.uid === data.student_id)) ? "creator" : "public";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!id) return;

    const fetch = async () => {
      setLoading(true);
      try {
        const i = await api(`/issues/${id}`, "GET");

        if (!i.data) {
          setData(null);
          return;
        }

        setData(i.data);
        setEditForm({
          title: i.data.title || "",
          description: i.data.description || "",
          category_id: i.data.category_id || "",
          priority: i.data.priority || "medium",
        });
        setShareOnFeed(i.data.shareOnFeed || false);

        if (i.data.student_id) {
          try {
            const creatorRef = doc(db, "users", i.data.student_id);
            const crSnap = await getDoc(creatorRef);
            if (crSnap.exists()) setCreator(crSnap.data());
          } catch (err) {
            console.error(err);
          }
        }
      } catch (err) {
        console.error(err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [id]);

  if (!id) return <div className="h-screen w-screen flex justify-center items-center text-xl">Issue ID not provided</div>;
  if (loading) return (
    <div className="w-[80%] h-full flex flex-col justify-center items-center gap-8">
      <DataSkeleton />
      <DataSkeleton />
    </div>
  );
  if (!data) return <p>Issue not found</p>;

  const categoryLabel =
    data.category_id === "CAT001"
      ? "Academic"
      : data.category_id === "CAT002"
      ? "Faculty/Department"
      : data.category_id === "CAT003"
      ? "Education & Assessment"
      : data.category_id === "CAT004"
      ? "Administrative/Office"
      : data.category_id === "CAT005"
      ? "Hostel/Accomodation"
      : data.category_id === "CAT006"
      ? "IT & Digital"
      : data.category_id === "CAT007"
      ? "Campus Facilities/Transport"
      : data.category_id === "CAT008"
      ? "Safety, Security & Discipline"
      : data.category_id === "CAT009"
      ? "Others"
      : "";

  const createdAt = new Date(data.created_at._seconds * 1000)
  const issueImages = Array.isArray(data.attachment_urls) ? data.attachment_urls : [];
  const primaryImage = issueImages[0]?.url || "/images/Skeleton.png";

  const handleChangeStatus = async (newStatus) => {
    setUpdating(true);
    try {
      await changeStatus(id, newStatus);
      setData((d) => ({ ...d, status: newStatus }));
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveIssue = async () => {
    setUpdating(true);
    setSaveMessage("");
    try {
      const payload = {
        title: editForm.title.trim(),
        description: editForm.description.trim(),
        category_id: editForm.category_id,
        priority: editForm.priority,
        updated_at: new Date(),
        shareOnFeed: shareOnFeed,
      };

      await editIssue(id, payload, user);
      setData((current) => ({ ...current, ...payload }));
      setIsEditing(false);
      setSaveMessage("Issue updated successfully.");
    } catch (err) {
      console.error(err);
      setSaveMessage("Unable to save changes right now.");
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setEditForm({
      title: data.title || "",
      description: data.description || "",
      category_id: data.category_id || "",
      priority: data.priority || "medium",
    });
    setShareOnFeed(shareOnFeed);
    setIsEditing(false);
    setSaveMessage("");
  };

  const handleAddNote = async (issueId) => {
    if (!note.trim()) return;
    setNoteUpdating(true);

    try {
      const message = {note, issueId};
      sendMessage(message, userData);

      console.log("Sent");

      setNote("");
    } catch (err) {
      console.error(err);
    } finally {
      setNoteUpdating(false);
    }
  };

  const handleKeyDown = async (e, issueId) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddNote(issueId);
    }
  }

  return (
    <div className="w-full h-screen overflow-y-auto flex flex-col items-center bg-transparent">
      <div className="max-w-6xl w-full mt-8 px-6 pb-12">
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
          <button onClick={() => { setSelectedView("StudentDash"); }} className="hover:text-white">Dashboard</button>
          <IoIosArrowForward />
          <button onClick={() => { setSelectedView("UserIssues"); }} className="hover:text-white">Issues</button>
          <IoIosArrowForward />
          <span className="text-white/90 truncate max-w-[40ch]">{data.title || "Issue"}</span>
        </div>

        <div className="bg-gradient-to-b from-[#041227] to-[#020612] rounded-2xl shadow-xl overflow-hidden border border-gray-800">
          <div className="relative w-full h-56 sm:h-64 md:h-72 lg:h-80">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={primaryImage} alt="" className="w-full h-full object-cover filter brightness-90" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute left-6 bottom-6 text-white">
              <h1 className="text-2xl sm:text-3xl font-semibold leading-tight">{data.title}</h1>
              <div className="flex flex-wrap gap-2 mt-2">
                {data.tags?.map((t, i) => (
                  <span key={i} className="text-xs bg-white/6 backdrop-blur px-3 py-1 rounded-full border border-white/6">{t}</span>
                ))}
              </div>
            </div>
            <div className="absolute right-6 top-6 h-fit w-fit flex items-center gap-2">
              <ShareButton title={data.title} text={`Issue: ${data.title}`} />

              <button className="text-lg px-3 py-2 border border-gray-700 hover:bg-gray-700/20 rounded-md contentText transition-all duration-200 ease-in-out">
                <CiBookmark />
              </button>

              <button className="text-lg px-3 py-2 border border-gray-700 hover:bg-gray-700/20 rounded-md contentText transition-all duration-200 ease-in-out">
                <PiWarningCircle />
              </button>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg text-gray-300">{categoryLabel}</h2>
                  <p className="text-sm text-gray-400 mt-1">ID • {id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium bg-indigo-500/40! text-black"}`}>{data.upvotes} Upvote(s)</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${data.status === "resolved" ? "bg-green-500/10 text-green-400" : data.status === "rejected" ? "bg-red-500/10 text-red-400" : data.status === "in_progress" ? "bg-yellow-500/10 text-yellow-400" : "bg-gray-800 text-gray-300"}`}>
                  {data.status === "resolved" ? "Resolved" : data.status === "rejected" ? "Rejected" : data.status === "in_progress" ? "In Progress" : "Unknown Status"}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${data.priority === "high" ? "bg-orange-500/10 text-orange-400" : data.priority === "critical" ? "bg-red-500/10 text-red-400" : data.priority === "medium" ? "bg-yellow-500/10 text-yellow-400" : "bg-green-500/10 text-green-400"}`}>{(data.priority.charAt(0).toUpperCase() + data.priority.slice(1)) || 'Normal'}</span>
                </div>
              </div>

              <div className="mt-4 bg-transparent rounded-lg p-4 border border-gray-800">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <h3 className="text-sm text-gray-300">Description</h3>
                </div>

                {isEditing && effectiveMode === "creator" ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="space-y-2">
                        <span className="text-xs text-gray-400">Title</span>
                        <input
                          value={editForm.title}
                          onChange={(e) => setEditForm((current) => ({ ...current, title: e.target.value }))}
                          className="w-full rounded-lg bg-[#041025] border border-gray-800 px-3 py-2 text-sm text-gray-100 outline-none focus:border-cyan-400/60"
                        />
                      </label>

                      <label className="space-y-2">
                        <span className="text-xs text-gray-400">Category</span>
                        <select
                          value={editForm.category_id}
                          onChange={(e) => setEditForm((current) => ({ ...current, category_id: e.target.value }))}
                          className="w-full rounded-lg bg-[#041025] border border-gray-800 px-3 py-2 text-sm text-gray-100 outline-none focus:border-cyan-400/60"
                        >
                          {categoryOptions.map((category) => (
                            <option key={category.id} value={category.id}>{category.label}</option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <label className="space-y-2 block">
                      <span className="text-xs text-gray-400">Description</span>
                      <textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm((current) => ({ ...current, description: e.target.value }))}
                        className="w-full min-h-[150px] rounded-lg bg-[#041025] border border-gray-800 px-3 py-2 text-sm text-gray-100 outline-none focus:border-cyan-400/60"
                      />
                    </label>

                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs text-gray-400">Priority</span>
                      {priorityOptions.map((priority) => (
                        <button
                          key={priority}
                          type="button"
                          onClick={() => setEditForm((current) => ({ ...current, priority }))}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${editForm.priority === priority ? "bg-cyan-500/15 text-cyan-300 border-cyan-400/30" : "bg-transparent text-gray-400 border-gray-700 hover:bg-white/5"}`}
                        >
                          {priority.charAt(0).toUpperCase() + priority.substring(1)}
                        </button>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-3 pt-2">
                      <button
                        onClick={handleSaveIssue}
                        disabled={updating}
                        className="inline-flex text-base items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-indigo-500 to-cyan-400 text-white shadow hover:opacity-95 disabled:opacity-60"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gray-700 text-gray-200 hover:bg-white/5 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>

                    {saveMessage && (
                      <p className="text-xs text-gray-400">{saveMessage}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-line">{data.description}</p>
                )}
              </div>

              <div className="mt-4 bg-[#031025] border border-gray-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm text-gray-300">Issue Images</h3>
                  <span className="text-xs text-gray-500">{issueImages.length} attachment{issueImages.length === 1 ? "" : "s"}</span>
                </div>

                {issueImages.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {issueImages.map((image, index) => (
                      <a
                        key={image.url || index}
                        href={image.url}
                        target="_blank"
                        rel="noreferrer"
                        className="group block overflow-hidden rounded-xl border border-gray-800 bg-black/20"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={image.url}
                          alt={`Issue attachment ${index + 1}`}
                          className="h-36 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No additional images uploaded.</p>
                )}
              </div>

              {(effectiveMode === "creator" || effectiveMode === "public") && (
                <div className="mt-5">
                  <h3 className="text-sm text-gray-300 mb-3">Updates & Comments</h3>
                  <div className="relative flex flex-col min-h-[55vh] h-fit bg-[#041025] rounded-xl w-full overflow-y-hidden justify-between">
                    <div className="mt-1 px-2 space-y-3 overflow-y-scroll h-[46vh]">
                      {(messages || []).slice().map((c, i) => (
                        <div key={i} className={`w-full my-1 flex items-center ${user.uid === c.senderId ? "justify-end" : "justify-start"}`}> 
                          <div className={`border border-gray-800 rounded-t-lg px-3 py-1 w-fit h-fit max-w-[65%] ${user.uid === c.senderId ? "bg-indigo-700/80 rounded-bl-lg" : "bg-blue-950/60 rounded-br-lg"}`}>
                            <p className="text-xs text-gray-400">{c.senderName?.split(' ')[0]}</p>
                            <p className="my-1 text-sm text-gray-200 text-wrap w-full h-fit overflow-x-hidden">{c.content}</p>
                            <p className="text-xs text-slate-400 flex justify-end">{new Date(c.createdAt).toLocaleString("en-IN", {day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",})}</p>
                          </div>
                        </div>
                      ))}

                      <div ref={bottomRef} ></div>
                    </div>


                    <div className="flex gap-2 justify-center items-center w-full h-fit px-2 py-1">
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, id)}
                      placeholder="Add a Comment..."
                      className="flex-1 relative min-h-[100%] max-h-[20vh] w-full p-3 z-10 rounded-md resize-none bg-[#020612] text-sm text-gray-200 outline-none field-sizing-content"
                    />
                      <button onClick={() => handleAddNote(id)} disabled={noteUpdating} className="z-20 absolute bottom-[0.6rem] right-4 items-center justify-center gap-2 h-fit p-2 cursor-pointer rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 text-white hover:text-white! text-gray-300! transition-all ease-in-out duration-150 disabled:bg-gray-500">
                        <FaArrowUp />
                      </button>
                      </div>
                  </div>
                </div>
              )}
            </div>

            <aside className="lg:col-span-1">
              <div className="bg-[#031323] border border-gray-800 rounded-xl p-4 space-y-4">
                <div>
                  <h4 className="text-xs text-gray-400">Reported By</h4>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-semibold">{creator ? (creator.username?.charAt(0) || 'U') : 'U'}</div>
                    <div>
                      <p className="text-sm text-gray-200">{creator?.username || data.student_id}</p>
                      <p className="text-xs text-gray-400">{creator?.email}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs text-gray-400">Submitted On</h4>
                  <p className="text-sm text-gray-200 mt-2">{createdAt ? createdAt.toLocaleString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }) : '-'}</p>
                </div>

                <div className="mt-8 w-full">
                  {effectiveMode === 'creator' ? (
                    <div className="flex justify-center items-center gap-4 w-full">
                      <button
                      onClick={() => setIsEditing(!isEditing)}
                      className=" w-full inline-flex justify-center items-center gap-1 px-2 py-2 rounded text-xs text-gray-200 bg-white/10 hover:bg-white/15 transition-colors"
                      >
                        {!isEditing ? <><FaRegEdit className="text-sm" /> Edit</> : <><RxCross1 className="text-sm" /> Cancel</>}
                      </button>

                      <DeleteIssueModal issue={{ id, title: data.title }} onSuccess={() => { setSelectedView('UserIssues'); }} />
                    </div>
                  ) : (
                    // <button onClick={() => setSelectedView('UserIssues')} className="w-full inline-flex justify-center items-center gap-2 px-4 py-2 rounded-md border border-gray-700 text-gray-200 hover:bg-white/3">Track Issue</button>
                    ""
                  )}
                </div>

                <div className="mt-8">
                  <h4 className="text-xs text-gray-400 mb-2">Mark As</h4>

                  {effectiveMode === 'creator' || effectiveMode === "public" ? (
                    <div className="flex justify-center items-center gap-4 w-full">
                      <button
                      onClick={() => handleChangeStatus("in_progress")} 
                      disabled={updating}
                      className=" w-[48%] inline-flex justify-center items-center gap-1 px-2 py-2 rounded text-xs text-yellow-500 bg-yellow-500/15 hover:bg-yellow-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        In Progress
                      </button>

                      <button
                      onClick={() => handleChangeStatus("resolved")} 
                      disabled={updating}
                      className=" w-[45%] inline-flex justify-center items-center gap-1 px-2 py-2 rounded text-xs text-green-500 bg-green-500/15 hover:bg-green-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Resolved
                      </button>
                    </div>
                  ) : ("")}

                  {effectiveMode === "public" ? (
                    <div className="flex justify-center items-center gap-4 w-full mt-2">
                      <button
                      onClick={() => handleChangeStatus("rejected")} 
                      disabled={updating}
                      className=" w-[98%] inline-flex justify-center items-center gap-1 px-2 py-2 rounded text-xs text-red-500 bg-red-500/15 hover:bg-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Rejected
                      </button>
                    </div>
                  ) : ("")}
                </div>

                {isEditing &&<div className="mt-8 flex justify-between items-center px-2">
                  <h4 className="text-sm text-gray-400 mb-2">Show Issue on Campus Feed</h4>
                  <Switch checked={shareOnFeed} onCheckedChange={(checked) => {setShareOnFeed(checked);}} />
                </div>}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
