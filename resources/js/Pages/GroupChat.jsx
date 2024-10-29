import React, { useState, useEffect } from 'react';
import axios from 'axios';

function GroupChat() {
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        axios.get('/api/groups').then((response) => {
            setGroups(response.data);
        });
    }, []);

    useEffect(() => {
        if (selectedGroup) {
            const channel = window.Echo.channel(`group.${selectedGroup.id}`);
            channel.listen('NewMessage', (e) => {
                console.log('NewMessage event received:', e);
                const newMessage = e.message.trim();
                if (newMessage) {
                    setMessages((prevMessages) => [...prevMessages, { message: newMessage }]);
                }
            });

            return () => {
                window.Echo.leave(`group.${selectedGroup.id}`);
            };
        }
    }, [selectedGroup]);

    const selectGroup = (group) => {
        setSelectedGroup(group);
        axios.get(`/api/groups/${group.id}/messages`).then((response) => {
            setMessages(response.data);
        });
    };

    const sendMessage = () => {
        const trimmedInput = input.trim();
        if (trimmedInput === '' || !selectedGroup) return;

        axios.post('/api/send-group-message', {
            message: trimmedInput,
            group_id: selectedGroup.id
        })
        .catch((error) => {
            console.error('メッセージ送信エラー:', error);
        });
    };

    return (
        <div className="container mx-auto p-4 h-screen flex flex-col">
            <div className="bg-blue-500 text-white py-4">
                <h2 className="text-2xl font-bold text-center">グループチャット</h2>
            </div>
            <div className="flex flex-grow">
                <div className="w-1/4 bg-gray-100 p-4 rounded-lg shadow h-full overflow-y-auto">
                    <h3 className="text-lg font-semibold mb-4">グループリスト</h3>
                    <ul className="space-y-2">
                        {groups.map((group) => (
                            <li 
                                key={group.id} 
                                onClick={() => selectGroup(group)}
                                className={`cursor-pointer p-2 rounded hover:bg-blue-100 transition ${selectedGroup?.id === group.id ? 'bg-blue-200' : ''}`}
                            >
                                {group.name}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="w-3/4 p-4 h-full flex flex-col">
                    {selectedGroup ? (
                        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col flex-grow">
                            <h3 className="text-xl font-semibold mb-4">{selectedGroup.name} チャット</h3>
                            <div className="flex-grow overflow-y-auto bg-gray-50 p-4 rounded-lg mb-4 shadow-inner h-80">
                                <ul className="space-y-1">
                                    {messages.map((msg, index) => (
                                        <li key={index} className="p-2 bg-blue-50 rounded-lg border border-gray-200">
                                            {msg.message}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex space-x-2">
                                <input 
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="メッセージを入力"
                                    className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                                />
                                <button 
                                    onClick={sendMessage} 
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                                >
                                    送信
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-600 flex items-center justify-center h-full">グループを選択してください。</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default GroupChat;
