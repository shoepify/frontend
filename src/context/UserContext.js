import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userRole, setUserRole] = useState(() => sessionStorage.getItem("userRole") || "guest");
    const [guestId, setGuestId] = useState(() => sessionStorage.getItem("guest_id") || null);
    const [sessionId, setSessionId] = useState(() => sessionStorage.getItem("session_id") || null);
    const [sessionCreatedAt, setSessionCreatedAt] = useState(() => sessionStorage.getItem("created_at") || null);

    useEffect(() => {
        // Synchronize with sessionStorage when userRole changes
        sessionStorage.setItem("userRole", userRole);
    }, [userRole]);

    useEffect(() => {
        // Fetch session data from backend if not already present
        if (!sessionId) {
            fetch("http://127.0.0.1:8000/")
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to fetch session data.");
                    }
                    return response.json();
                })
                .then((data) => {
                    setGuestId(data.guest_id);
                    setSessionId(data.session_id);
                    setSessionCreatedAt(data.created_at);

                    // Store in sessionStorage
                    sessionStorage.setItem("guest_id", data.guest_id);
                    sessionStorage.setItem("session_id", data.session_id);
                    sessionStorage.setItem("created_at", data.created_at);
                })
                .catch((error) => {
                    console.error("Error fetching session data:", error);
                });
        }
    }, [sessionId]); // Run only if sessionId is not already set

    return (
        <UserContext.Provider value={{ userRole, setUserRole, guestId, sessionId, sessionCreatedAt }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
