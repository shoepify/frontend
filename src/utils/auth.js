// src/utils/auth.js

export const decodeToken = (token) => {
    if (!token) return null;

    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        return JSON.parse(window.atob(base64)); // Decodes the token payload
    } catch (err) {
        console.error("Error decoding token:", err);
        return null;
    }
};