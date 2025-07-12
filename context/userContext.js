"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Firebase user
    const [userData, setUserData] = useState(null); // Firestore user data
    const [loading, setLoading] = useState(true); // Global loading state

    const fetchUserData = async (uid) => {
        try {
            const userRef = doc(db, "users", uid);
            const docSnap = await getDoc(userRef);
            if (docSnap.exists()) {
                setUserData(docSnap.data());
            } else {
                console.warn("⚠️ Firestore user document not found.");
                setUserData(null);
            }
        } catch (err) {
            console.error("Error fetching user data:", err);
            setUserData(null);
        }
    };

    const login = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            setUser(result.user);
            await fetchUserData(result.user.uid);
        } catch (err) {
            console.error("Login failed:", err.message);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            setUserData(null);
        } catch (err) {
            console.error("Logout failed:", err.message);
        }
    };

    useEffect(() => {
        let isMounted = true;
        const unsubscribe = auth.onAuthStateChanged(async (u) => {
            if (isMounted) {
                if (u) {
                    setUser(u);
                    await fetchUserData(u.uid);
                } else {
                    setUser(null);
                    setUserData(null);
                }
                setLoading(false);
            }
        });

        return () => {
            isMounted = false;
            unsubscribe();
        };
    }, []);

    return (
        <UserContext.Provider value={{ user, userData, loading, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
