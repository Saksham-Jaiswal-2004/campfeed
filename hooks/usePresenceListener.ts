// "use client";

// import { useEffect, useState } from "react";
// import { socket } from "@/lib/socket";

// export const usePresenceListener = () => {
//   const [presence, setPresence] = useState({});

//   useEffect(() => {
//     const updatePresence = ({ userId, status }) => {
//       console.log("Updating: ", userId, status);
//       setPresence((prev) => ({
//           ...prev,
//           [userId]: status,
//         }));
//     };
    
//     const loadOnlineUsers = (users: any) => {
//       console.log("Load online users");
//       const initialState = {};

//       users.forEach((id: any) => {
//         initialState[id] = "online";
//       });

//       setPresence(initialState);
//     };

//     socket.on("presence-update", updatePresence);
//     socket.on("online-users", loadOnlineUsers);

//     return () => {
//       socket.off("presence-update", updatePresence);
//       socket.off("online-users", loadOnlineUsers);
//     };
//   }, []);

//   return presence;
// };