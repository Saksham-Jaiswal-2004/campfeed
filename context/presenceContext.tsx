"use client";
import { createContext, useContext, useEffect, useState, } from "react";
import { socket } from "@/lib/socket";

type PresenceState = Record< string, "online" | "offline" >;

const PresenceContext = createContext<PresenceState>({});

export function PresenceProvider({ children, }: { children: React.ReactNode; }) {
    const [presence, setPresence] = useState<PresenceState>({});

    useEffect(() => {
        const updatePresence = ({ userId, status, }: {
            userId: string; status: "online" | "offline"; }) => {
            setPresence((prev) => ({ ...prev, [userId]: status, }));
        };

        const loadOnlineUsers = ( users: string[] ) => {
            const initialState: PresenceState = {};
            users.forEach((id) => { initialState[id] = "online"; });
            setPresence((prev) => ({ ...prev, ...initialState, }));
        };

        socket.on("presence-update", updatePresence);
        socket.on("online-users", loadOnlineUsers);

        return () => {
            socket.off("presence-update", updatePresence);
            socket.off("online-users", loadOnlineUsers);
        };
    }, []);

    return (
        <PresenceContext.Provider value={presence}>
            {children}
        </PresenceContext.Provider>
    );
}

export const usePresenceListener = () => {
    return useContext(PresenceContext);
};