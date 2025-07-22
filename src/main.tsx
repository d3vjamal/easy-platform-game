import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './lib/i18n';
import './styles/main.css';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
    <React.StrictMode>
        <Suspense fallback="loading">
            <App />
        </Suspense>
    </React.StrictMode>
);
