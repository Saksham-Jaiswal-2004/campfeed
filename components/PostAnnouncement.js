import React, { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useUser } from '@/context/userContext';
import { toast } from "sonner"

const PostAnnouncement = () => {
    const { user, userData } = useUser();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        targetAudience: "All",
        priority: "",
        tags: "",
        expiryDate: "",
    });

    const handlePostAnnouncement = async (e) => {
        e.preventDefault();

        if (!user || !userData) {
            alert("You must be logged in to post an announcement.");
            return;
        }

        setLoading(true);

        try {
            const data = {
                ...formData,
                tags: formData.tags.split(",").map(tag => tag.trim()).filter(Boolean),
                createdAt: serverTimestamp(),
                createdBy: user.uid,
                expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : null,
            };

            await addDoc(collection(db, "announcements"), data);

            toast("Announcement Posted Successfully")
            handleResetForm();
        } catch (err) {
            console.error("Error posting announcement:", err);
            alert("Failed to post announcement.");
        } finally {
            setLoading(false);
        }
    };

    const handleResetForm = () => {
        setFormData({
            title: "",
            description: "",
            targetAudience: "",
            priority: "",
            tags: "",
            expiryDate: "",
        });
    };

    return (
        <div className='w-[84vw] h-screen flex flex-col justify-start items-center'>
            <div className='flex gap-1 justify-between items-center w-[72%] px-5 mt-10 mb-4'>
                <div className='flex flex-col'>
                    <h2 className='subtitle text-3xl'>Create New Announcement</h2>
                    <p className='contentText text-base'>Share important information with the campus community</p>
                </div>
            </div>

            <div className='w-[70%]'>
                <form onSubmit={handlePostAnnouncement} className='h-fit border border-gray-700 bg-indigo-950/50 rounded-lg my-4 p-6'>
                    <div className='flex flex-col gap-1 mb-8'>
                        <label htmlFor="title" className='text-sm px-2'>Announcement Title *</label>
                        <input type="text" name="title" id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder='Enter Announcement Title' className='border border-gray-700 contentText bg-[#020818] px-4 py-2 text-base rounded-md outline-none' required />
                    </div>

                    <div className='flex flex-col gap-1 my-8'>
                        <label htmlFor="description" className='text-sm px-2'>Description *</label>
                        <textarea rows={6} name="description" id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder='Write your announcement content here...' className='border border-gray-700 contentText bg-[#020818] px-4 py-2 text-base rounded-md outline-none' required></textarea>
                    </div>

                    <div className='flex gap-1 my-8'>
                        <div className='flex flex-col gap-1 my-1 w-1/2 px-2'>
                            <label htmlFor="targetaudience" className='text-sm px-2'>Target Audience</label>
                            <select name="targetAudience" id="targetaudience" value={formData.targetAudience} onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })} className='bg-[#020818] outline-none border border-gray-700 rounded-sm px-4 py-2'>
                                <option value="All">All</option>
                                <option value="Students">Students</option>
                                <option value="Faculty">Faculty</option>
                                <option value="Student Clubs">Student Clubs</option>
                                <option value="CSE Department">CSE Department</option>
                                <option value="ECE Department">ECE Department</option>
                                <option value="AI/ML Department">AI/ML Department</option>
                                <option value="Cybersecurity Department">Cybersecurity Department</option>
                            </select>
                        </div>

                        <div className='flex flex-col gap-1 my-1 w-1/2 px-2'>
                            <label htmlFor="priority" className='text-sm px-2'>Priority Level</label>
                            <select name="priority" id="priority" value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} className='bg-[#020818] outline-none border border-gray-700 rounded-sm px-4 py-2'>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                    </div>

                    <div className='flex flex-col gap-1 my-8'>
                        <label htmlFor="tags" className='text-sm px-2'>Tags</label>
                        <input type="text" name="tags" id="tags" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} placeholder='Enter tags separated by commas (e.g., important, deadline, academics)' className='border border-gray-700 contentText bg-[#020818] px-4 py-2 text-base rounded-md outline-none' />
                        <p className='text-[#96aac5] text-[0.82rem] px-2'>Separate multiple tags with commas</p>
                    </div>

                    <div className='flex flex-col gap-1 my-8 relative'>
                        <label htmlFor="expiryDate" className='text-sm px-2'>Expiry Date (Optional)</label>
                        <input type="date" name="expiryDate" id="expiryDate" value={formData.expiryDate} onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })} className='!appearance-none border border-gray-700 contentText bg-[#020818] px-4 py-2 text-base rounded-md outline-none' />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                            <svg className="w-5 h-5 contenText" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <p className='text-[#96aac5] text-[0.82rem] px-2'>Leave empty if the announcement doesn&apos;t expire</p>
                    </div>

                    <hr className='w-[99%] justify-self-center border border-gray-700 my-6' />

                    <div className='flex gap-4 my-5'>
                        <button type='submit' className={`${loading ? "cursor-not-allowed bg-gray-700" : "cursor-pointer bg-indigo-600 hover:bg-indigo-700"} btnText px-5 py-3 rounded-sm text-sm transition-all duration-200 ease-in-out`} disabled={loading}>
                            {loading ? "Posting..." : "Post Announcement"}
                        </button>
                        <button type='button' onClick={handleResetForm} className='cursor-pointer btnText bg-indigo-600/30 hover:bg-indigo-600/50 px-5 py-3 rounded-sm text-sm transition-all duration-200 ease-in-out'>Reset Form</button>
                    </div>
                </form>

                <div className='border border-indigo-400 bg-indigo-700/20 text-base w-full p-4 rounded-md mb-8'>
                    <h3 className='mb-2 contentText'>Announcement Guidelines</h3>
                    <ul className='list-disc !text-sm flex flex-col gap-2 px-10 text-blue-300'>
                        <li>Keep titles clear and concise</li>
                        <li>Use appropriate priority levels to help users identify importance</li>
                        <li>Add relevant tags to improve discoverability</li>
                        <li>Set expiry dates for time-sensitive announcements</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default PostAnnouncement;