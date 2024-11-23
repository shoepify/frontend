import React from 'react';
import ReactDOM from 'react-dom';
import App from './pages/App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserProvider } from './context/UserContext';


ReactDOM.render(
    <UserProvider>
        <App />
    </UserProvider>,
    document.getElementById('root')
);
