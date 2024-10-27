// resources/js/app.jsx


import './bootstrap'; // 先にインポート
import React from 'react';
import ReactDOM from 'react-dom/client';
import Chat from './components/Chat'; // 分割したChatコンポーネントをインポート


function App() {
    return (
        <div>
            <h1>リアルタイムチャットアプリケーション</h1>
            <Chat />
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);
