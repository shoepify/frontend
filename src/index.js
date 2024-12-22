import React from 'react';
import ReactDOM from 'react-dom';
import App from './pages/App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserProvider } from './context/UserContext';
import './pages/i18n'; // Import i18n configuration globally

ReactDOM.render(
    <UserProvider>
        <App />
    </UserProvider>,
    document.getElementById('root')
);
