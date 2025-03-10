import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Create a root instance and render the React application
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App /> {/* Main application component */}
  </React.StrictMode>
);

// Measure and report web vitals (performance metrics)
// This helps in monitoring and optimizing app performance.
reportWebVitals();
