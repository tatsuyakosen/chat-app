// resources/js/app.jsx

import './bootstrap';
import '../css/app.css';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Chat from './components/Chat';
import GroupChat from './Pages/GroupChat';
import Dashboard from './Pages/Dashboard'; // Dashboardのインポート

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <Router>
                <Routes>
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/group-chat" element={<GroupChat />} />
                    <Route path="/dashboard" element={<Dashboard />} /> {/* Dashboardルートの追加 */}
                    <Route path="*" element={<App {...props} />} />
                </Routes>
            </Router>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
