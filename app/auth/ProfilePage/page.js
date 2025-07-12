"use client";
import { auth, db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

const ProfileForm = () => {
    const [username, setUsername] = useState("");
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                router.replace("/auth/Login");
            }
        });

        return () => unsubscribe();
    }, []);


    const handleSave = async () => {
        if (!username.trim()) return alert("Username is required.");

        const userData = {
            name: user.displayName,
            email: user.email,
            profilePic: user.photoURL,
            metadata: {
                creationTime: user.metadata.creationTime,
                lastSignInTime: user.metadata.lastSignInTime,
            },
            username: username.trim(),
            role: "student",
            uid: user.uid,
        };


        try {
            await setDoc(doc(db, "users", user.uid), userData);
            router.push("/Dashboard");
        } catch (err) {
            console.error("Error saving user data", err);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center p-6">
            <div className="bg-[#0a0a1a] border border-gray-700 rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4 text-white">Complete Your Profile</h2>

                <div className="mb-4">
                    <label className="text-sm text-gray-300">Full Name</label>
                    <input disabled value={user?.displayName || ""} className="w-full mt-1 p-2 rounded bg-gray-800 text-white" />
                </div>

                <div className="mb-4">
                    <label className="text-sm text-gray-300">Email</label>
                    <input disabled value={user?.email || ""} className="w-full mt-1 p-2 rounded bg-gray-800 text-white" />
                </div>

                <div className="mb-4">
                    <label className="text-sm text-gray-300">Username *</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full mt-1 p-2 rounded bg-gray-800 text-white"
                        placeholder="e.g. saksham01"
                    />
                </div>

                <div className="mb-4">
                    <label className="text-sm text-gray-300">Role</label>
                    <input disabled value="student" className="w-full mt-1 p-2 rounded bg-gray-800 text-white" />
                </div>

                <button onClick={handleSave} className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 rounded mt-4 text-white">
                    Save & Continue
                </button>
            </div>
        </div>
    );
};

export default ProfileForm;