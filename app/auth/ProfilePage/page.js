"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { FaRegUserCircle } from "react-icons/fa";
import { FiShield } from "react-icons/fi";

const ProfilePage = () => {
  const [username, setUsername] = useState("");
  const [branch, setBranch] = useState("");
  const [saving, setSaving] = useState(false);
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
  }, [router]);

  const handleSave = async () => {
    if (!user) return;
    if (!username.trim()) return alert("Username is required.");
    if (!branch) return alert("Please select your branch.");

    const userData = {
      name: user.displayName,
      email: user.email,
      profilePic: user.photoURL,
      metadata: {
        creationTime: user.metadata.creationTime,
        lastSignInTime: user.metadata.lastSignInTime,
      },
      username: username.trim(),
      role: "Student",
      branch,
      uid: user.uid,
    };

    try {
      setSaving(true);
      await setDoc(doc(db, "users", user.uid), userData);
      router.push("/StudentDash");
    } catch (err) {
      console.error("Error saving user data", err);
      alert("Failed to save your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020613] text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-3xl border border-gray-800 bg-[#020818] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.45)] sm:p-8">
            <Link href="/" className="text-sm text-cyan-300 transition hover:text-cyan-200">
              Back to CampFeed
            </Link>

            <div className="mt-8 flex items-center gap-5">
              <div
                className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-cyan-400/20 bg-cyan-400/10"
                aria-hidden={!user?.photoURL}
                title={user?.displayName || "Profile"}
                style={user?.photoURL ? { backgroundImage: `url(${user.photoURL})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
              >
                {!user?.photoURL && <FaRegUserCircle className="text-4xl text-cyan-300" />}
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-gray-400">Complete your profile</p>
                <h1 className="mt-2 text-3xl font-semibold text-white">Welcome to CampFeed</h1>
                <p className="mt-2 text-sm leading-6 text-gray-400">
                  Add a username and branch to finish setting up your account.
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-4 rounded-2xl border border-gray-800 bg-[#08122b] p-5">
              <div className="flex items-center justify-between gap-4 border-b border-gray-800 pb-3">
                <span className="text-sm text-gray-400">Full Name</span>
                <span className="max-w-[70%] break-all text-right text-sm text-white">{user?.displayName || "Not available"}</span>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-gray-800 pb-3">
                <span className="text-sm text-gray-400">Email</span>
                <span className="max-w-[70%] break-all text-right text-sm text-white">{user?.email || "Not available"}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-gray-400">Role</span>
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                  <FiShield /> Student
                </span>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-gray-800 bg-[#020613] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.45)] sm:p-8">
            <div className="flex items-start justify-between gap-4 border-b border-gray-800 pb-5">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-gray-400">Account Setup</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Create your profile details</h2>
                <p className="mt-2 text-sm leading-6 text-gray-400">
                  This information helps personalize your dashboard and campus activity.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-5">
              <div>
                <label className="mb-2 block text-sm text-gray-300">Username *</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-xl border border-gray-700 bg-[#08122b] px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-cyan-400/40"
                  placeholder="e.g. john_doe"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-300">Branch *</label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full rounded-xl border border-gray-700 bg-[#08122b] px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
                >
                  <option value="" disabled>Select your branch</option>
                  <option value="Admin">Admin</option>
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="AI/ML">AI/ML</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                </select>
              </div>

              <div className="rounded-2xl border border-gray-800 bg-[#08122b] p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-full border border-gray-700 bg-[#020613] p-2 text-cyan-300">
                    <FaRegUserCircle />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Profile completion</p>
                    <p className="text-sm text-gray-400">You can update your details later from your profile page.</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex w-full items-center justify-center rounded-xl bg-cyan-400 px-4 py-3 font-medium text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save & Continue"}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;