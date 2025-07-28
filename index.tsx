import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import { NotificationProvider } from './context/NotificationContext';
import { EvaluationProvider } from './context/EvaluationContext';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Could not find root element to mount to");

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <NotificationProvider>
      <EvaluationProvider>
        <App />
      </EvaluationProvider>
    </NotificationProvider>
  </React.StrictMode>
);