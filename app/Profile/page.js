"use client"
import React, { use, useState } from 'react'
import Navbar from '@/components/Navbar'
import { useUser } from "@/context/userContext";
import { useRouter } from "next/navigation";
import { getAuth, deleteUser } from "firebase/auth";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FiShield } from "react-icons/fi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { CiFlag1 } from "react-icons/ci";
import { PiStudentFill } from "react-icons/pi";
import { FiEdit } from "react-icons/fi";
import { IoIosLogOut } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { toast } from "sonner"

const Page = () => {

    const { user, userData, login, logout, loading } = useUser();
    const [username, setUsername] = useState(userData?.username);
    const [branch, setBranch] = useState(userData?.branch);
    const [editing, setEditing] = useState(false);
    const [updating, setUpdating] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        toast("Logged Out Successfully!")
        await logout();
        router.push("/");
        router.refresh;
    };

    const handleUpdateUser = async (uid, updatedFields) => {
        if (!uid) {
            toast("User ID not Found!")
            return;
        }

        setUpdating(true);
        try {
            const userRef = doc(db, "users", uid);
            await updateDoc(userRef, updatedFields);
            setBranch(userData.branch);
            setUsername(userData.username);
            toast("User profile updated successfully!")
        } catch (error) {
            console.error("Error updating user:", error);
            toast("Failed to update your Profile")
        } finally {
            router.refresh;
            setEditing(false)
            setUpdating(false)
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submiting")
        await handleUpdateUser(user.uid, { username, branch, });
    };

    const handleReset = () => {
        setBranch(userData.branch);
        setUsername(userData.username);
    }

    const handleDelete = async (uid) => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user || user.uid !== uid) {
            alert("You can only delete your own account.");
            return;
        }

        const confirmDelete = confirm("Are you sure you want to delete your account? This action is irreversible.");
        if (!confirmDelete) return;

        try {
            await deleteDoc(doc(db, "users", uid));
            await deleteUser(user);
            toast("Your account has been deleted successfully.")
            router.push("/")
        } catch (error) {
            console.error("Error deleting account:", error);
            if (error.code === "auth/requires-recent-login") {
                alert("Please re-authenticate before deleting your account.");
            } else {
                alert("Failed to delete account.");
            }
        }
    };

    return (
        <div className='h-[100vh] flex flex-col justify-stat items-center pb-6'>
            <Navbar />

            <div className='mt-24 flex flex-col gap-1 justify-between items-center border border-gray-700 rounded-lg px-20 py-12 w-[55%] h-[70%]'>
                {/* <h2 className='mb-6 subtitle text-4xl'>Profile Information</h2> */}

                <div className='flex w-fit items-center gap-8'>
                    <img src={userData?.profilePic} alt={userData?.name} className='w-40 h-40 rounded-full' />

                    <div className='flex flex-col justify-center items-start gap-1'>
                        <p className='title text-2xl'>{userData?.name}</p>
                        {!editing ? <p className='text-base contentText mt-3'>Username: {userData?.username}</p> :
                            <div className='flex justify-center items-center gap-2 my-2'>
                                <p className='text-base contentText mt-3'>Username: </p>
                                <input
                                    type="text"
                                    className="w-[80%] px-2 py-1 mt-1 rounded-md border border-gray-700 bg-[#0f172a] text-white outline-none contentText"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                        }
                        <p className='text-base contentText'>Email: {userData?.email}</p>

                        <div className='flex items-center gap-4 mt-3'>
                            {userData?.role === "Admin" && <p className='w-fit text-xs text-violet-500'><span className='flex items-center gap-1 bg-violet-800/10 border border-violet-800 w-fit px-2 py-1 rounded-full'><FiShield />Admin</span></p>}
                            {userData?.role === "Faculty" && <p className='w-fit text-xs text-indigo-500'><span className='flex items-center gap-1 bg-indigo-800/10 border border-indigo-800 w-fit px-2 py-1 rounded-full'><FaChalkboardTeacher />Faculty</span></p>}
                            {userData?.role === "Student Club" && <p className='w-fit text-xs text-yellow-500'><span className='flex items-center gap-1 bg-yellow-800/10 border border-yellow-800/80 w-fit px-2 py-1 rounded-full'><CiFlag1 />Student Club</span></p>}
                            {userData?.role === "Student" && <p className='w-fit text-xs text-green-500'><span className='flex items-center gap-1 bg-green-800/10 border border-green-800 w-fit px-2 py-1 rounded-full'><PiStudentFill />Student</span></p>}

                            {!editing ? <p className='navText text-sm'>Branch: {userData?.branch}</p> :
                                <select name="branch" id="branch" value={branch} onChange={(e) => setBranch(e.target.value)} className='border border-gray-700 px-3 py-1 rounded-lg bg-[#020818]'>
                                    <option value="CSE">CSE</option>
                                    <option value="ECE">ECE</option>
                                    <option value="AI/ML">AI/ML</option>
                                    <option value="Cybersecurity">Cybersecurity</option>
                                    {userData.role === "Admin" && <option value="Admin">Admin</option>}
                                </select>
                            }
                        </div>
                    </div>
                </div>

                <div className='flex justify-end w-full items-center gap-4 mt-12'>
                    {!editing ?
                        <button onClick={() => { setEditing(true) }} className='cursor-pointer btnText bg-indigo-600/80 hover:bg-indigo-800 px-4 py-2 rounded-sm text-sm transition-all duration-200 ease-in-out flex justify-center items-center gap-2'>Edit Profile <FiEdit /></button>
                        :
                        <div className='flex justify-center items-center gap-2'>
                            <button onClick={(e) => { handleSubmit(e) }} className='cursor-pointer btnText bg-indigo-600/80 hover:bg-indigo-800 px-4 py-2 rounded-sm text-sm transition-all duration-200 ease-in-out flex justify-center items-center gap-2' disabled={updating}>{updating ? "Saving..." : "Save"}</button>
                            <button onClick={() => { setEditing(false); handleReset() }} className='cursor-pointer btnText bg-gray-600/80 hover:bg-gray-800 px-4 py-2 rounded-sm text-sm transition-all duration-200 ease-in-out flex justify-center items-center gap-2'>Cancel</button>
                        </div>}
                    <button onClick={handleLogout} className='cursor-pointer btnText bg-indigo-600/30 hover:bg-indigo-600/50 px-4 py-2 rounded-sm text-sm transition-all duration-200 ease-in-out flex justify-center items-center gap-2'>Logout <IoIosLogOut /></button>
                    <button onClick={() => { handleDelete(user.uid) }} className='cursor-pointer btnText bg-red-600/30 hover:bg-red-600/50 px-4 py-2 rounded-sm text-sm transition-all duration-200 ease-in-out flex justify-center items-center gap-2'>Delete Account <RiDeleteBin6Line /></button>
                </div>
            </div>
        </div>
    )
}

export default Page
