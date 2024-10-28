// src/index.js
import React from 'react';
import ReactDOM from 'react-dom'; // Import ReactDOM to render the app
import './styles.css'; // Import the CSS file for styling
import App from './App'; // Import the main App component

// Render the App component and attach it to the root element in index.html
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
