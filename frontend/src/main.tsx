import React from 'react';
import ReactDOM from 'react-dom/client';
import { ForecastProvider } from './context/ForecastContext';
import { App } from './App';
import './style.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ForecastProvider>
        <App />
      </ForecastProvider>
    </React.StrictMode>
  );
}
