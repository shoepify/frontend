import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot
import App from './pages/App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserProvider } from './context/UserContext';

// Get the root DOM element
const container = document.getElementById('root');
const root = createRoot(container); // Create the React root

// Render the application
root.render(
    <UserProvider>
        <App />
    </UserProvider>
);
