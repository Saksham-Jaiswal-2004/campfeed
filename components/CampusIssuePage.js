"use client";
import React, { useEffect, useMemo, useState } from "react";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { IoIosArrowForward } from "react-icons/io";
import { CgDanger } from "react-icons/cg";
import { MdOutlineInfo } from "react-icons/md";
import { FiCheckCircle } from "react-icons/fi";
import { FaRegThumbsUp } from "react-icons/fa";
import { useUser } from "@/context/userContext";
import { CiBookmark } from "react-icons/ci";
import { PiWarningCircle } from "react-icons/pi";
import ShareButton from "@/components/ShareButton";

const categoryLabels = {
  CAT001: "Academic",
  CAT002: "Faculty/Department",
  CAT003: "Education & Assessment",
  CAT004: "Administrative/Office",
  CAT005: "Hostel/Accomodation",
  CAT006: "IT & Digital",
  CAT007: "Campus Facilities/Transport",
  CAT008: "Safety, Security & Discipline",
  CAT009: "Others",
};

export default function CampusIssuePage({ setSelectedView, id }) {
  const { user } = useUser();
  const [issue, setIssue] = useState(null);
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingVote, setSavingVote] = useState(false);

  useEffect(() => {
    if (!id) return;

    const loadIssue = async () => {
      setLoading(true);
      try {
        const issueSnap = await getDoc(doc(db, "issues", id));
        if (!issueSnap.exists()) {
          setIssue(null);
          return;
        }

        const issueData = issueSnap.data();
        setIssue(issueData);

        if (issueData.student_id) {
          const creatorSnap = await getDoc(doc(db, "users", issueData.student_id));
          if (creatorSnap.exists()) {
            setCreator(creatorSnap.data());
          }
        }
      } catch (error) {
        console.error(error);
        setIssue(null);
      } finally {
        setLoading(false);
      }
    };

    loadIssue();
  }, [id]);

  const createdAt = useMemo(() => {
    if (!issue?.created_at) return null;
    return issue.created_at.toDate ? new Date(issue.created_at.toDate()) : new Date(issue.created_at);
  }, [issue]);

  const issueImages = Array.isArray(issue?.attachment_urls) ? issue.attachment_urls : [];
  const upvotedBy = Array.isArray(issue?.upvotedBy) ? issue.upvotedBy : [];
  const hasUpvoted = Boolean(user?.uid && upvotedBy.includes(user.uid));

  const handleUpvote = async () => {
    if (!issue || !user?.uid || savingVote) return;

    setSavingVote(true);
    try {
      const issueRef = doc(db, "issues", id);
      const nextUpvotes = hasUpvoted ? Math.max((issue.upvotes || 0) - 1, 0) : (issue.upvotes || 0) + 1;

      await updateDoc(issueRef, {
        upvotes: nextUpvotes,
        upvotedBy: hasUpvoted ? arrayRemove(user.uid) : arrayUnion(user.uid),
      });

      setIssue((current) => ({
        ...current,
        upvotes: nextUpvotes,
        upvotedBy: hasUpvoted
          ? (current?.upvotedBy || []).filter((uid) => uid !== user.uid)
          : [...(current?.upvotedBy || []), user.uid],
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setSavingVote(false);
    }
  };

  if (!id) return <div className="h-screen w-screen flex items-center justify-center text-xl">Issue ID not provided</div>;
  if (loading) return <p>Loading...</p>;
  if (!issue) return <p>Issue not found</p>;

  return (
    <div className="w-full h-screen overflow-y-auto flex justify-center">
      <div className="w-full max-w-6xl px-6 py-8">
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
          <button onClick={() => setSelectedView("AllIssues")} className="hover:text-white">All Campus Issues</button>
          <IoIosArrowForward />
          <span className="text-white/90 truncate max-w-[40ch]">{issue.title || "Issue"}</span>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-[#020613] shadow-2xl overflow-hidden">
          <div className="relative h-64 sm:h-72 md:h-80">
            <img
              src={issueImages[0]?.url || "/images/Skeleton.png"}
              alt={issue.title || "Issue image"}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            <div className="absolute left-6 bottom-6 right-6 text-white flex items-end justify-between gap-4">
              <div className="max-w-3xl">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full text-xs bg-white/10 backdrop-blur border border-white/10">{categoryLabels[issue.category_id] || "Issue"}</span>
                  <span className={`px-3 py-1 rounded-full text-xs ${issue.status === "resolved" ? "bg-green-500/15 text-green-300" : issue.status === "rejected" ? "bg-red-500/15 text-red-300" : issue.status === "in_progress" ? "bg-yellow-500/15 text-yellow-300" : "bg-gray-500/15 text-gray-200"}`}>
                    {issue.status === "in_progress" ? "In Progress" : issue.status || "Open"}
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-semibold leading-tight">{issue.title}</h1>
                <p className="mt-2 text-sm sm:text-base text-white/75 max-w-2xl line-clamp-3">{issue.description}</p>
              </div>
            </div>

            <div className="absolute right-6 top-6 h-fit w-fit flex items-center gap-2">
              <ShareButton title={issue.title} text={`Check out this issue: ${issue.title}`} />
              
              <button className="text-lg px-3 py-2 border border-gray-700 hover:bg-gray-700/20 rounded-md contentText transition-all duration-200 ease-in-out">
                <CiBookmark />
              </button>
              
              <button className="text-lg px-3 py-2 border border-gray-700 hover:bg-gray-700/20 rounded-md contentText transition-all duration-200 ease-in-out">
                <PiWarningCircle />
              </button>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-5">
              <div className="rounded-xl border border-gray-800 bg-[#031025] p-5">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div>
                    <h2 className="text-lg text-gray-200">Issue Details</h2>
                    <p className="text-xs text-gray-500 mt-1">ID • {id}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {issue.priority === "critical" && <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-red-500/15 text-red-300 border border-red-500/20"><CgDanger /> Critical</span>}
                    {issue.priority === "high" && <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-orange-500/15 text-orange-300 border border-orange-500/20"><CgDanger /> High</span>}
                    {issue.priority === "medium" && <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-yellow-500/15 text-yellow-300 border border-yellow-500/20"><MdOutlineInfo /> Medium</span>}
                    {issue.priority === "low" && <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-green-500/15 text-green-300 border border-green-500/20"><FiCheckCircle /> Low</span>}
                  </div>
                </div>

                <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-line">{issue.description}</p>
              </div>

              <div className="rounded-xl border border-gray-800 bg-[#031025] p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm text-gray-300">Images</h3>
                  <span className="text-xs text-gray-500">{issueImages.length} attachment{issueImages.length === 1 ? "" : "s"}</span>
                </div>

                {issueImages.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {issueImages.map((image, index) => (
                      <a
                        key={image.url || index}
                        href={image.url}
                        target="_blank"
                        rel="noreferrer"
                        className="overflow-hidden rounded-xl border border-gray-800 bg-black/20 group"
                      >
                        <img
                          src={image.url}
                          alt={`Issue attachment ${index + 1}`}
                          className="h-36 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No attachments uploaded.</p>
                )}
              </div>
            </div>

            <aside className="lg:col-span-1 space-y-5">
              <div className="rounded-xl border border-gray-800 bg-[#031025] p-5 space-y-4">
                <div>
                  <h3 className="text-xs text-gray-400">Reported by</h3>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-semibold">
                      {creator?.username?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="text-sm text-gray-200">{creator?.username || issue.student_id || "Anonymous"}</p>
                      <p className="text-xs text-gray-500">{creator?.email || (issue.is_anonymous ? "Anonymous submission" : "")}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs text-gray-400">Submitted</h3>
                  <p className="text-sm text-gray-200 mt-2">
                    {createdAt ? createdAt.toLocaleString("en-GB", {
                      weekday: "short",
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }) : "-"}
                  </p>
                </div>

                <div>
                  <h3 className="text-xs text-gray-400 mb-2">Upvotes</h3>
                  <button
                    onClick={handleUpvote}
                    disabled={savingVote}
                    className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md border transition-colors ${hasUpvoted ? "bg-blue-500/15 text-blue-300 border-blue-500/30" : "border-gray-700 text-gray-200 hover:bg-white/5"}`}
                  >
                    <FaRegThumbsUp /> {hasUpvoted ? "Upvoted" : "Upvote"} • {issue.upvotes || 0}
                  </button>
                </div>

                <button
                  onClick={() => setSelectedView("AllIssues")}
                  className="w-full px-4 py-2 rounded-md border border-gray-700 text-gray-200 hover:bg-white/5 transition-colors"
                >
                  Back to Campus Issues
                </button>
              </div>

              <div className="rounded-xl border border-gray-800 bg-[#031025] p-5 space-y-3">
                <h3 className="text-sm text-gray-300">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {(issue.tags || []).map((tag, index) => (
                    <span key={index} className="px-3 py-1 rounded-full text-xs bg-cyan-500/10 text-cyan-200 border border-cyan-500/20">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
