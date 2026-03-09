import React from 'react'
import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useUser } from '@/context/userContext';
import { toast } from "sonner"
import { X } from 'lucide-react';

const PostEvent = () => {

    const { user, userData } = useUser();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        organiser: "",
        contactInfo: "",
        description: "",
        venue: "",
        startDate: "",
        endDate: "",
        capacity: "",
        targetAudience: "",
        tags: "",
        files: [],
    });

    const handleFileUpload = (e) => {
      const selectedFiles = Array.from(e.target.files);
    
      const newFiles = selectedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
    
      setFormData((prev) => ({
        ...prev,
        files: [...prev.files, ...newFiles],
      }));
    };
    
    const handleDrop = (e) => {
      e.preventDefault();
      const droppedFiles = Array.from(e.dataTransfer.files);
    
      const newFiles = droppedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
    
      setFormData((prev) => ({
        ...prev,
        files: [...prev.files, ...newFiles],
      }));
    };
    
    const handleDragOver = (e) => {
      e.preventDefault();
    };

    const handlePostEvent = async (e) => {
        e.preventDefault();

        if (!user || !userData) {
            alert("You must be logged in to post an event.");
            return;
        }

        const start = new Date(formData.startDate);
        const end = formData.endDate ? new Date(formData.endDate) : null;

        if (isNaN(start.getTime())) {
            alert("Invalid start date format.");
            return;
        }

        if (end && isNaN(end.getTime())) {
            alert("Invalid end date format.");
            return;
        }

        if (end && end <= start) {
            alert("End date must be after start date.");
            return;
        }

        setLoading(true);

        try {
            await addDoc(collection(db, "events"), {
                ...formData,
                capacity: parseInt(formData.capacity),
                registered: 0,
                startDate: start,
                endDate: end,
                tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
                targetAudience: formData.targetAudience,
                createdAt: serverTimestamp(),
                createdBy: user.uid,
                eventPosterURL: null,
            });

            toast("Event Posted Successfully")
            setFormData({
                name: "",
                organiser: "",
                contactInfo: "",
                description: "",
                venue: "",
                startDate: "",
                endDate: "",
                capacity: "",
                targetAudience: "",
                tags: "",
            });
        } catch (err) {
            console.error("Error posting event:", err);
            alert("Failed to post event.");
        } finally {
            setLoading(false)
        }
    };

    const handleResetForm = () => {
        setFormData({
            name: "",
            organiser: "",
            contactInfo: "",
            description: "",
            venue: "",
            startDate: "",
            endDate: "",
            capacity: "",
            targetAudience: "",
            tags: "",
        });
    };

    return (
        <div className='w-[84vw] h-screen flex flex-col justify-start items-center'>
            <div className='flex gap-1 justify-between items-center w-[72%] px-5 mt-10 mb-4'>
                <div className='flex flex-col'>
                    <h2 className='subtitle text-3xl'>Create New Event</h2>
                    <p className='contentText text-base'>Organize and promote campus events to engage the community</p>
                </div>
            </div>

            <div className='w-[70%]'>
                <form onSubmit={handlePostEvent} className='h-fit border border-gray-700 bg-indigo-950/50 rounded-lg my-4 p-6'>
                    <div className='flex flex-col gap-1 mb-8'>
                        <label htmlFor="name" className='text-sm px-2'>Event Name *</label>
                        <input type="text" name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} id="name" placeholder='Enter Announcement Title' className='border border-gray-700 contentText bg-[#020818] px-4 py-2 text-base rounded-md outline-none' required />
                    </div>

                    <div className='flex gap-1 my-8'>
                        <div className='flex flex-col gap-1 w-1/2'>
                            <label htmlFor="organiser" className='text-sm px-2'>Organiser Name or Club *</label>
                            <input type="text" name="organiser" value={formData.organiser} onChange={(e) => setFormData({ ...formData, organiser: e.target.value })} id="organiser" placeholder='E.g., GDG or Saksham Jaiswal' className='border border-gray-700 contentText bg-[#020818] px-4 py-2 text-base rounded-md outline-none' required />
                        </div>

                        <div className='flex flex-col gap-1 w-1/2'>
                            <label htmlFor="contactInfo" className='text-sm px-2'>Contact Email / Phone *</label>
                            <input type="text" name="contactInfo" value={formData.contactInfo} onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })} id="contactInfo" placeholder='e.g., john@example.com or +91-90000-00000' className='border border-gray-700 contentText bg-[#020818] px-4 py-2 text-base rounded-md outline-none' required />
                        </div>
                    </div>

                    <div className='flex flex-col gap-1 my-8'>
                        <label htmlFor="description" className='text-sm px-2'>Description *</label>
                        <textarea rows={6} name="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} id="description" placeholder='Describe your event, including agenda, requirements, and what attendees can expect...' className='border border-gray-700 contentText bg-[#020818] px-4 py-2 text-base rounded-md outline-none' required></textarea>
                    </div>

                    <div className='flex flex-col gap-1 mb-8'>
                        <label htmlFor="venue" className='text-sm px-2'>Enter Venue *</label>
                        <input type="text" name="venue" value={formData.venue} onChange={(e) => setFormData({ ...formData, venue: e.target.value })} id="venue" placeholder='Enter Event Venue (e.g., Main Auditorium, Computer Lab)' className='border border-gray-700 contentText bg-[#020818] px-4 py-2 text-base rounded-md outline-none' required />
                    </div>

                    <div className='flex gap-1 my-8'>
                        <div className='flex flex-col gap-1 my-1 w-1/2 relative'>
                            <label htmlFor="startDate" className='text-sm px-2'>Start Date & Time *</label>
                            <input type="datetime-local" name="startDate" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} id="startDate" className='!appearance-none border border-gray-700 contentText bg-[#020818] px-4 py-2 text-base rounded-md outline-none' required />
                            <div className="pointer-events-none absolute inset-y-0 right-3 top-6 flex items-center px-3">
                                <svg className="w-5 h-5 contenText" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>

                        <div className='flex flex-col gap-1 my-1 w-1/2 relative'>
                            <label htmlFor="endDate" className='text-sm px-2'>End Date & Time</label>
                            <input type="datetime-local" name="endDate" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} id="endDate" className='!appearance-none border border-gray-700 contentText bg-[#020818] px-4 py-2 text-base rounded-md outline-none' />
                            <div className="pointer-events-none absolute inset-y-0 right-3 top-6 flex items-center px-3">
                                <svg className="w-5 h-5 contenText" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className='flex justify-center items-center gap-1 my-8'>
                        <div className='flex flex-col gap-1 w-1/2'>
                            <label htmlFor="capacity" className='text-sm px-2'>Event Capacity *</label>
                            <input type="number" name="capacity" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} id="capacity" placeholder='E.g., 100' min="1" required className='border border-gray-700 contentText bg-[#020818] px-4 py-2 text-base rounded-md outline-none' />
                        </div>

                        <div className='flex flex-col gap-1 my-1 w-1/2 px-2'>
                            <label htmlFor="targetaudience" className='text-sm px-2'>Target Audience</label>
                            <select name="targetaudience" value={formData.targetAudience} onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })} id="targetaudience" className='bg-[#020818] outline-none border border-gray-700 rounded-sm px-4 py-2'>
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
                    </div>

                    <div className='flex flex-col gap-1 my-8'>
                        <label htmlFor="tags" className='text-sm px-2'>Tags</label>
                        <input type="text" name="tags" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} id="tags" placeholder='Enter tags separated by commas (e.g., important, deadline, academics)' className='border border-gray-700 contentText bg-[#020818] px-4 py-2 text-base rounded-md outline-none' />
                        <p className='text-[#96aac5] text-[0.82rem] px-2'>Separate multiple tags with commas</p>
                    </div>

                    <div className='flex flex-col my-8 relative'>
                        <label htmlFor="eventposter" className='text-sm px-2 mb-1'>Event Banner</label>
                        {formData.files.length == 0 ? (
                          <label htmlFor="eventposter" className="block w-full relative group">
                              <div className="relative cursor-pointer border-2 border-dashed border-gray-700 group-hover:border-gray-500 transition-colors bg-[#020818] px-4 py-2 h-48 text-base rounded-md flex flex-col items-center justify-center gap-0">
                                  <div className='h-20 w-20 rounded-full bg-gray-900 flex items-center justify-center group-hover:bg-gray-800 transition-colors'>
                                    <svg className="w-10 h-10 contentText group-hover:!text-white transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12v8m0-8l3.5 3.5M12 12L8.5 15.5M16 8V4H8v4" />
                                    </svg>
                                  </div>
                                  <span className="text-xl font-bold mt-2" id="fileName">Upload Event Banner</span>
                                  <p className='text-muted-foreground text-sm'>Upload an image to make your event more attractive (JPG, JPEG, PNG, WEBP max 5MB)</p>
                              </div>
                              <input
                                type="file"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handleFileUpload}
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                accept="image/*"
                              />
  
                          </label>
                        ):(
                          <div className="flex justify-center items-center w-full gap-4">
                            {formData.files.map((file, i) => (
                              <div key={i} className="relative rounded-xl bg-muted overflow-hidden group w-[98%] aspect-[16/5]">
                                <img src={file.preview} alt="Preview" className="object-cover w-full h-full" />
                                <button
                                  className="absolute top-2 right-2 p-1 bg-background/80 rounded-full text-destructive hover:bg-background"
                                  onClick={() => {
                                    URL.revokeObjectURL(formData.files[i].preview);
                                  
                                    setFormData((prev) => ({
                                      ...prev,
                                      files: prev.files.filter((_, idx) => idx !== i),
                                    }));
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                    {/* {formData.files.length > 0 && } */}

                    {/* <div className='flex flex-col gap-1 mb-8'>
                        <label htmlFor="registrationLink" className='text-sm px-2'>External Registration Link</label>
                        <input type="url" name="registrationLink" id="registrationLink" placeholder='https://registration.link' className='border border-gray-700 contentText bg-[#020818] px-4 py-2 text-base rounded-md outline-none' />
                    </div> */}

                    <hr className='w-[99%] justify-self-center border border-gray-700 my-6' />

                    <div className='flex gap-4 my-5'>
                        <button type='submit' className={`${loading ? "cursor-not-allowed bg-gray-700 hover:bg-gray-700" : "cursor-pointer bg-indigo-600 hover:bg-indigo-700"} btnText px-5 py-3 rounded-sm text-sm transition-all duration-200 ease-in-out`} disabled={loading}>{loading ? 'Posting...' : 'Post Event'}</button>
                        <button type='button' onClick={handleResetForm} className='cursor-pointer btnText bg-indigo-600/30 hover:bg-indigo-600/50 px-5 py-3 rounded-sm text-sm transition-all duration-200 ease-in-out'>Reset Form</button>
                    </div>
                </form>

                <div className='border border-green-700 bg-green-700/20 text-base w-full p-4 rounded-md mb-8'>
                    <h3 className='mb-2 contentText !text-green-200'>Event Creation Tips</h3>
                    <ul className='list-disc !text-sm flex flex-col gap-2 px-10 text-green-300'>
                        <li>Keep titles clear and concise</li>
                        <li>Use appropriate priority levels to help users identify importance</li>
                        <li>Add relevant tags to improve discoverability</li>
                        <li>Set expiry dates for time-sensitive announcements</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default PostEvent
