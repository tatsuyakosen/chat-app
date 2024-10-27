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
        axios.post('/send-message', { message: input })
            .then(response => {
                setInput(''); // 入力フィールドをクリア
            })
            .catch(error => {
                console.error('メッセージ送信エラー:', error);
            });
    };

    return (
        <div>
            <h2>Chatコンポーネントが表示されています</h2>
            <ul>
                {messages.map((message, index) => (
                    <li key={index}>{message}</li>
                ))}
            </ul>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="メッセージを入力"
            />
            <button onClick={sendMessage}>送信</button>
        </div>
    );
}

export default Chat;
