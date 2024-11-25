import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    // Initialize user role from sessionStorage or default to "guest"
    const [userRole, setUserRole] = useState(() => {
        const storedRole = sessionStorage.getItem("userRole");
        return storedRole || "guest";
    });

    // Write "guest" to sessionStorage if no role is set
    useEffect(() => {
        if (!sessionStorage.getItem("userRole")) {
            sessionStorage.setItem("userRole", "guest");
        }
    }, []);

    // Function to update user role
    const updateUserRole = (role) => {
        setUserRole(role); // Update context state
        sessionStorage.setItem("userRole", role); // Store updated role in sessionStorage
    };

    // Function to log out and reset user role to "guest"
    const logoutUser = () => {
        setUserRole("guest"); // Reset role to "guest"
        sessionStorage.setItem("userRole", "guest"); // Ensure "guest" is written to sessionStorage
    };

    return (
        <UserContext.Provider value={{ userRole, setUserRole: updateUserRole, logoutUser }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use UserContext
export const useUser = () => useContext(UserContext);
