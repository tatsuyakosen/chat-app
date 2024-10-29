// resources/js/components/Chat.jsx

import React from 'react';
import axios from 'axios'; // メッセージ送信用にaxiosをインポート

function Chat() {
    const [messages, setMessages] = React.useState([]);
    const [input, setInput] = React.useState('');

    console.log('window.Echo:', window.Echo);

    React.useEffect(() => {
        // Laravel Echoを使用してリアルタイムイベントをリッスン
        window.Echo.channel('chat')
            .listen('NewMessage', (e) => {
                setMessages((prevMessages) => [...prevMessages, e.message]);
            });
    }, []);

    const sendMessage = () => {
        // メッセージをサーバーに送信
        if (input.trim() === '') return;
        
        axios.post('/send-message', { message: input })
            .then(response => {
                setInput(''); // 入力フィールドをクリア
            })
            .catch(error => {
                console.error('メッセージ送信エラー:', error);
            });
    };

    return (
        <div className="chat-container">
            <h2 className="chat-title">チャットルーム</h2>
            <div className="chat-window">
                <ul className="chat-messages">
                    {messages.map((message, index) => (
                        <li key={index} className="chat-message">{message}</li>
                    ))}
                </ul>
            </div>
            <div className="chat-input-container">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="メッセージを入力"
                    className="chat-input"
                />
                <button onClick={sendMessage} className="chat-send-button">送信</button>
            </div>
        </div>
    );
}

export default Chat;
