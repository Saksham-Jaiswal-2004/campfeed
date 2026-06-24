"use client"
import React, { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import { useUser } from "@/context/userContext";
import { useRouter } from "next/navigation";
import { getAuth, deleteUser } from "firebase/auth";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FiShield, FiEdit } from "react-icons/fi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { CiFlag1 } from "react-icons/ci";
import { PiStudentFill } from "react-icons/pi";
import { IoIosLogOut } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { toast } from "sonner"
import Loader from '@/components/ui/Loader';

const Page = () => {
    const { user, userData, logout, loading } = useUser();
    const [username, setUsername] = useState('');
    const [branch, setBranch] = useState('');
    const [editing, setEditing] = useState(false);
    const [updating, setUpdating] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setUsername(userData?.username ?? '');
        setBranch(userData?.branch ?? '');
    }, [userData]);

    const handleLogout = async () => {
        toast("Logged Out Successfully!")
        await logout();
        router.push("/");
        router.refresh();
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
            toast("User profile updated successfully!")
            router.refresh();
        } catch (error) {
            console.error("Error updating user:", error);
            toast("Failed to update your Profile")
        } finally {
            setEditing(false)
            setUpdating(false)
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleUpdateUser(user?.uid, { username, branch });
    };

    const handleReset = () => {
        setBranch(userData?.branch ?? '');
        setUsername(userData?.username ?? '');
    }

    const handleDelete = async (uid) => {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (!currentUser || currentUser.uid !== uid) {
            alert("You can only delete your own account.");
            return;
        }

        const confirmDelete = confirm("Are you sure you want to delete your account? This action is irreversible.");
        if (!confirmDelete) return;

        try {
            await deleteDoc(doc(db, "users", uid));
            await deleteUser(currentUser);
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

    if (loading) {
        return <Loader />
    }

    return (
        <div className='min-h-screen bg-[#020613] text-white'>
            <Navbar />

            <main className='mx-auto pt-28 w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8'>
                <div className='mb-6 border-b border-gray-800 pb-6'>
                    <p className='text-xs uppercase tracking-[0.24em] text-gray-400'>Profile</p>
                    <h1 className='mt-2 text-3xl font-semibold text-white sm:text-4xl'>Account Details</h1>
                    <p className='mt-3 max-w-2xl text-sm leading-6 text-gray-400'>
                        Review your account information, update your username and branch, and manage your session from one place.
                    </p>
                </div>

                <div className='grid gap-6 lg:grid-cols-[0.95fr_1.05fr]'>
                    <section className='rounded-3xl border border-gray-800 bg-[#020613] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)]'>
                        <div className='flex items-start gap-5'>
                            <img
                                src={userData?.profilePic}
                                alt={userData?.name}
                                className='h-26 w-26 rounded-full border border-gray-700 object-cover'
                            />

                            <div className='min-w-0 flex-1'>
                                <p className='text-xs uppercase tracking-[0.18em] text-gray-400'>Profile Overview</p>
                                <h2 className='mt-2 text-2xl font-semibold text-white'>{userData?.name}</h2>
                                <div className='mt-3 flex flex-wrap gap-2'>
                                    {userData?.role === "Admin" && <span className='inline-flex items-center gap-1 rounded-full border border-violet-800 bg-violet-800/10 px-3 py-1 text-xs text-violet-300'><FiShield />Admin</span>}
                                    {userData?.role === "Faculty" && <span className='inline-flex items-center gap-1 rounded-full border border-indigo-800 bg-indigo-800/10 px-3 py-1 text-xs text-indigo-300'><FaChalkboardTeacher />Faculty</span>}
                                    {userData?.role === "Student Club" && <span className='inline-flex items-center gap-1 rounded-full border border-yellow-800/80 bg-yellow-800/10 px-3 py-1 text-xs text-yellow-300'><CiFlag1 />Student Club</span>}
                                    {userData?.role === "Student" && <span className='inline-flex items-center gap-1 rounded-full border border-green-800 bg-green-800/10 px-3 py-1 text-xs text-green-300'><PiStudentFill />Student</span>}
                                </div>
                            </div>
                        </div>

                        <div className='mt-6 space-y-4 rounded-2xl border border-gray-800 bg-[#08122b] p-5'>
                            <div className='flex items-center justify-between gap-4 border-b border-gray-800 pb-3'>
                                <span className='text-sm text-gray-400'>Email</span>
                                <span className='max-w-[70%] break-all text-right text-sm text-white'>{userData?.email}</span>
                            </div>
                            <div className='flex items-center justify-between gap-4 border-b border-gray-800 pb-3'>
                                <span className='text-sm text-gray-400'>Username</span>
                                {!editing ? (
                                    <span className='text-sm text-white'>{userData?.username}</span>
                                ) : (
                                    <input
                                        type='text'
                                        className='w-[62%] rounded-xl border border-gray-700 bg-[#020818] px-3 py-2 text-sm text-white outline-none transition focus:border-gray-500'
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                )}
                            </div>
                            <div className='flex items-center justify-between gap-4'>
                                <span className='text-sm text-gray-400'>Branch</span>
                                {!editing ? (
                                    <span className='text-sm text-white'>{userData?.branch}</span>
                                ) : (
                                    <select
                                        name='branch'
                                        id='branch'
                                        value={branch}
                                        onChange={(e) => setBranch(e.target.value)}
                                        className='w-[62%] rounded-xl border border-gray-700 bg-[#020818] px-3 py-2 text-sm text-white outline-none transition focus:border-gray-500'
                                    >
                                        <option value='CSE'>CSE</option>
                                        <option value='ECE'>ECE</option>
                                        <option value='AI/ML'>AI/ML</option>
                                        <option value='Cybersecurity'>Cybersecurity</option>
                                        {userData?.role === 'Admin' && <option value='Admin'>Admin</option>}
                                    </select>
                                )}
                            </div>
                        </div>
                    </section>

                    <section className='rounded-3xl border border-gray-800 bg-[#020613] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)]'>
                        <div className='flex items-center justify-between gap-4 border-b border-gray-800 pb-4'>
                            <div>
                                <p className='text-xs uppercase tracking-[0.18em] text-gray-400'>Account Actions</p>
                                <h3 className='mt-2 text-xl font-semibold text-white'>Manage your profile</h3>
                            </div>
                            {/* <div className='rounded-full border border-gray-800 bg-[#08122b] px-3 py-1 text-xs text-gray-300'>
                                {editing ? 'Editing enabled' : 'Read only'}
                            </div> */}
                        </div>

                        <div className='mt-6 grid gap-4 sm:grid-cols-2'>
                            <div className='rounded-2xl border border-gray-800 bg-[#08122b] p-4'>
                                <p className='text-xs uppercase tracking-[0.18em] text-gray-400'>Role</p>
                                <p className='mt-2 text-lg font-medium text-white'>{userData?.role ?? 'Member'}</p>
                            </div>
                            <div className='rounded-2xl border border-gray-800 bg-[#08122b] p-4'>
                                <p className='text-xs uppercase tracking-[0.18em] text-gray-400'>Branch</p>
                                <p className='mt-2 text-lg font-medium text-white'>{userData?.branch ?? 'Not set'}</p>
                            </div>
                        </div>

                        <div className='mt-6 rounded-2xl border border-gray-800 bg-[#08122b] p-5'>
                            <p className='text-sm leading-6 text-gray-400'>
                                Keep your username and branch up to date so the platform can present the right profile information in tickets, listings, and account views.
                            </p>
                        </div>

                        <div className='mt-8 flex flex-wrap gap-3'>
                            {!editing ? (
                                <button
                                    onClick={() => setEditing(true)}
                                    className='inline-flex cursor-pointer items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-600/80 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-indigo-700'
                                >
                                    Edit Profile <FiEdit />
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={handleSubmit}
                                        className='inline-flex cursor-pointer items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-600/80 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60'
                                        disabled={updating}
                                    >
                                        {updating ? 'Saving...' : 'Save'}
                                    </button>
                                    <button
                                        onClick={() => { setEditing(false); handleReset() }}
                                        className='inline-flex cursor-pointer items-center gap-2 rounded-xl border border-gray-700 bg-transparent px-4 py-2 text-sm font-medium text-gray-200 transition-all duration-200 hover:bg-gray-800'
                                    >
                                        Cancel
                                    </button>
                                </>
                            )}

                            <button
                                onClick={handleLogout}
                                className='inline-flex cursor-pointer items-center gap-2 rounded-xl border border-gray-700 bg-transparent px-4 py-2 text-sm font-medium text-gray-200 transition-all duration-200 hover:bg-gray-800'
                            >
                                Logout <IoIosLogOut />
                            </button>
                            <button
                                onClick={() => { handleDelete(user?.uid) }}
                                className='inline-flex cursor-pointer items-center gap-2 rounded-xl border border-red-500/30 bg-red-600/20 px-4 py-2 text-sm font-medium text-red-300 transition-all duration-200 hover:bg-red-600/30'
                            >
                                Delete Account <RiDeleteBin6Line />
                            </button>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    )
}

export default Page