

/*
Assuming you have a backend API that authenticates users and returns user details along with their role, 
the login function in the frontend can look something like this:
Backend Response Example (for Reference)
When a user logs in, the backend should return an object like this:
!!!!!!Backend tarafinda credentials oldugu table yaratilinca test edilecek!!!!!!

ornek data
{
  "userId": "12345",
  "name": "Jane Doe",
  "role": "productManager",  // Could be "admin", "salesManager", "customer", etc.
  "token": "jwt-auth-token"   // Auth token if using JWT
}
  buradan role attribute una gore ayristirilacak frontend tarafinda



import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

const UserProvider = ({ children }) => {
    const [user, setUser] = useState({
        userId: null,
        name: null,
        role: null,          // Role could be "admin", "productManager", "salesManager", "customer"
        token: null,         // Store JWT or other token here
        isAuthenticated: false
    });

    // Login function to call the backend and set user state
    const login = async (username, password) => {
        try {
            // Replace with actual API call
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();

            if (data.token) {
                // Set user state based on response
                setUser({
                    userId: data.userId,
                    name: data.name,
                    role: data.role,
                    token: data.token,
                    isAuthenticated: true
                });
                localStorage.setItem('authToken', data.token); // Store token if needed
            } else {
                alert('Login failed!');
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    const logout = () => {
        setUser({ userId: null, name: null, role: null, token: null, isAuthenticated: false });
        localStorage.removeItem('authToken'); // Clear token on logout
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
*/

import React, { createContext, useContext, useState } from 'react';

// Create the context
const UserContext = createContext();

// Custom hook to access the UserContext easily
export const useUser = () => useContext(UserContext);

// UserProvider component that wraps the app and provides user state
const UserProvider = ({ children }) => {
    const [user, setUser] = useState({
        isAuthenticated: false,
        role: null, // Roles: 'admin', 'productManager', 'salesManager', 'customer'
    });

    // Function to handle user login
    const login = (role) => {
        setUser({
            isAuthenticated: true,
            role,
        });
    };

    // Function to handle user logout
    const logout = () => {
        setUser({
            isAuthenticated: false,
            role: null,
        });
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
