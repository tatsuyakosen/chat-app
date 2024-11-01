import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserIcon from "../components/UserIcon"; // UserIconコンポーネントをインポート

function GroupChat() {
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [inviteEmail, setInviteEmail] = useState('');
    const [showMembers, setShowMembers] = useState(false); // メンバー表示トグルの状態
    const [members, setMembers] = useState([]); // 現在のグループのメンバーリスト

    const fetchGroups = () => {
        axios.get('/api/user-groups')
            .then((response) => {
                setGroups(response.data);
            })
            .catch((error) => {
                console.error("グループの取得エラー:", error);
            });
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    useEffect(() => {
        if (selectedGroup) {
            const channel = window.Echo.channel(`group.${selectedGroup.id}`);
            channel.listen('NewMessage', (e) => {
                const newMessage = e.message.trim();
                if (newMessage) {
                    setMessages((prevMessages) => [...prevMessages, { message: newMessage }]);
                }
            });

            fetchMembers(selectedGroup.id); // グループ選択時にメンバーを取得

            return () => {
                window.Echo.leave(`group.${selectedGroup.id}`);
            };
        }
    }, [selectedGroup]);

    const fetchMembers = (groupId) => {
        axios.get(`/api/groups/${groupId}/members`)
            .then((response) => {
                setMembers(response.data);
            })
            .catch((error) => {
                console.error("メンバーの取得エラー:", error);
            });
    };

    const toggleMembers = () => {
        setShowMembers(!showMembers); // メンバー表示をトグル
    };

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
        }).catch((error) => {
            console.error('メッセージ送信エラー:', error);
        });
        setInput('');
    };

    const inviteUser = () => {
        if (inviteEmail.trim() === '' || !selectedGroup) return;

        axios.post(`/api/groups/${selectedGroup.id}/invite`, {
            email: inviteEmail
        }).then(() => {
            alert(`ユーザー ${inviteEmail} が招待されました`);
            setInviteEmail('');
        }).catch((error) => {
            console.error('ユーザー招待エラー:', error);
        });
    };

    return (
        <div className="w-full h-screen flex flex-col bg-gray-900">
            <div className="bg-gray-700 text-gray-200 py-4 w-full flex items-center justify-center relative">
                <h2 className="text-2xl font-bold">motive room</h2>
                {selectedGroup && (
                    <div className="absolute right-4 flex items-center space-x-2">
                        
                        <UserIcon onClick={toggleMembers} /> {/* メンバー表示トグルアイコン */}
                    </div>
                )}
            </div>
            <div className="flex flex-grow">
                <div className="w-1/6 bg-gray-100 p-4 h-full overflow-y-auto">
                    <h3 className="text-lg font-semibold mb-4">グループ</h3>
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
                <div className="w-5/6 p-4 h-full flex flex-col">
                    {selectedGroup ? (
                        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col flex-grow">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold">{selectedGroup.name}</h3>
                                {showMembers && (
                                    <div className="flex space-x-2">
                                        {members.map((member, index) => (
                                            <span key={index} className="text-gray-700 bg-gray-200 px-2 py-1 rounded-full">
                                                {member.name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="flex-grow overflow-y-auto bg-gray-50 p-4 rounded-lg mb-4 shadow-inner">
                                <ul className="space-y-1">
                                    {messages.map((msg, index) => (
                                        <li key={index} className="p-2 bg-blue-50 rounded-lg border border-gray-200">
                                            {msg.message}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex space-x-2 mb-4">
                                <input 
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    placeholder="ユーザーのメールを入力"
                                    className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                                />
                                <button 
                                    onClick={inviteUser} 
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                                >
                                    招待
                                </button>
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
                                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
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
