import React from 'react'

const PostEvent = () => {
    return (
        <div className='w-[84vw] h-screen flex flex-col justify-start items-center'>
            <div className='flex gap-1 justify-between items-center w-[72%] px-5 mt-10 mb-4'>
                <div className='flex flex-col'>
                    <h2 className='subtitle text-3xl'>Create New Event</h2>
                    <p className='contentText text-base'>Organize and promote campus events to engage the community</p>
                </div>
            </div>

            <div className='w-[70%]'>
                <form action="submit" method="post" className='h-fit border border-gray-700 bg-indigo-950/50 rounded-lg my-4 p-6'>
                    <div className='flex flex-col gap-1 mb-8'>
                        <label htmlFor="name" className='text-sm px-2'>Event Name *</label>
                        <input type="text" name="name" id="name" placeholder='Enter Announcement Title' className='border border-gray-700 contentText bg-[#020818] px-4 py-2 text-base rounded-md outline-none' required />
                    </div>

                    <div className='flex gap-1 my-8'>
                        <div className='flex flex-col gap-1 w-1/2'>
                            <label htmlFor="organiser" className='text-sm px-2'>Organiser Name or Club *</label>
                            <input type="text" name="organiser" id="organiser" placeholder='E.g., GDG or Saksham Jaiswal' className='border border-gray-700 contentText bg-[#020818] px-4 py-2 text-base rounded-md outline-none' required />
                        </div>

                        <div className='flex flex-col gap-1 w-1/2'>
                            <label htmlFor="contactInfo" className='text-sm px-2'>Contact Email / Phone *</label>
                            <input type="text" name="contactInfo" id="contactInfo" placeholder='e.g., john@example.com or +91-90000-00000' className='border border-gray-700 contentText bg-[#020818] px-4 py-2 text-base rounded-md outline-none' required />
                        </div>
                    </div>

                    <div className='flex flex-col gap-1 my-8'>
                        <label htmlFor="description" className='text-sm px-2'>Description *</label>
                        <textarea rows={6} name="description" id="description" placeholder='Describe your event, including agenda, requirements, and what attendees can expect...' className='border border-gray-700 contentText bg-[#020818] px-4 py-2 text-base rounded-md outline-none' required></textarea>
                    </div>

                    <div className='flex flex-col gap-1 mb-8'>
                        <label htmlFor="venue" className='text-sm px-2'>Enter Venue *</label>
                        <input type="text" name="venue" id="venue" placeholder='Enter Event Venue (e.g., Main Auditorium, Computer Lab)' className='border border-gray-700 contentText bg-[#020818] px-4 py-2 text-base rounded-md outline-none' required />
                    </div>

                    <div className='flex gap-1 my-8'>
                        <div className='flex flex-col gap-1 my-1 w-1/2 relative'>
                            <label htmlFor="startDate" className='text-sm px-2'>Start Date & Time *</label>
                            <input type="datetime-local" name="startDate" id="startDate" className='!appearance-none border border-gray-700 contentText bg-[#020818] px-4 py-2 text-base rounded-md outline-none' required />
                            <div className="pointer-events-none absolute inset-y-0 right-3 top-6 flex items-center px-3">
                                <svg className="w-5 h-5 contenText" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>

                        <div className='flex flex-col gap-1 my-1 w-1/2 relative'>
                            <label htmlFor="endDate" className='text-sm px-2'>End Date & Time *</label>
                            <input type="datetime-local" name="endDate" id="endDate" className='!appearance-none border border-gray-700 contentText bg-[#020818] px-4 py-2 text-base rounded-md outline-none' />
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
                            <input type="number" name="capacity" id="capacity" placeholder='E.g., 100' min="1" required className='border border-gray-700 contentText bg-[#020818] px-4 py-2 text-base rounded-md outline-none' />
                        </div>

                        <div className='flex flex-col gap-1 my-1 w-1/2 px-2'>
                            <label htmlFor="targetaudience" className='text-sm px-2'>Target Audience</label>
                            <select name="targetaudience" id="targetaudience" className='bg-[#020818] outline-none border border-gray-700 rounded-sm px-4 py-2'>
                                <option value="">All</option>
                                <option value="">Students</option>
                                <option value="">Faculty</option>
                                <option value="">Student Clubs</option>
                                <option value="">CSE Department</option>
                                <option value="">ECE Department</option>
                                <option value="">AI/ML Department</option>
                                <option value="">Cybersecurity Department</option>
                            </select>
                        </div>
                    </div>

                    <div className='flex flex-col gap-1 my-8'>
                        <label htmlFor="tags" className='text-sm px-2'>Tags</label>
                        <input type="text" name="tags" id="tags" placeholder='Enter tags separated by commas (e.g., important, deadline, academics)' className='border border-gray-700 contentText bg-[#020818] px-4 py-2 text-base rounded-md outline-none' />
                        <p className='text-[#96aac5] text-[0.82rem] px-2'>Separate multiple tags with commas</p>
                    </div>

                    <div className='flex flex-col gap-1 my-8 relative'>
                        <label htmlFor="eventposter" className='text-sm px-2'>Event Poster (Optional)</label>
                        <label htmlFor="eventposter" className="block w-full">
                            <div className="cursor-pointer border border-gray-700 bg-[#020818] px-4 py-2 text-base rounded-md text-white flex items-center justify-between">
                                <span className="text-gray-400" id="fileName">Upload Event Poster</span>
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12v8m0-8l3.5 3.5M12 12L8.5 15.5M16 8V4H8v4" />
                                </svg>
                            </div>
                            <input
                                type="file"
                                name="eventposter"
                                id="eventposter"
                                accept="image/png, image/jpeg, image/jpg, image/webp"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    const maxSizeMB = 2;

                                    if (file) {
                                        if (!["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(file.type)) {
                                            alert("Only PNG, JPG, JPEG, or WEBP files are allowed.");
                                            e.target.value = "";
                                            return;
                                        }

                                        if (file.size > maxSizeMB * 1024 * 1024) {
                                            alert(`File size should be less than ${maxSizeMB} MB.`);
                                            e.target.value = "";
                                            return;
                                        }

                                        document.getElementById("fileName").innerText = file.name;
                                    }
                                }}
                            />
                        </label>

                        <p className='text-[#96aac5] text-[0.82rem] px-2'>Upload an image to make your event more attractive (JPG, JPEG, PNG, WEBP max 5MB)</p>
                    </div>

                    <div className='flex flex-col gap-1 mb-8'>
                        <label htmlFor="registrationLink" className='text-sm px-2'>External Registration Link</label>
                        <input type="url" name="registrationLink" id="registrationLink" placeholder='https://registration.link' className='border border-gray-700 contentText bg-[#020818] px-4 py-2 text-base rounded-md outline-none' />
                    </div>

                    <hr className='w-[99%] justify-self-center border border-gray-700 my-6' />

                    <div className='flex gap-4 my-5'>
                        <button className='cursor-pointer btnText bg-indigo-600 hover:bg-indigo-700 px-5 py-3 rounded-sm text-sm transition-all duration-200 ease-in-out'>Post Event</button>
                        <button className='cursor-pointer btnText bg-indigo-600/30 hover:bg-indigo-600/50 px-5 py-3 rounded-sm text-sm transition-all duration-200 ease-in-out'>Reset Form</button>
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
