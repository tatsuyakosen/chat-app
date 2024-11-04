import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserIcon from "../components/UserIcon";
import GroupOptionsMenu from "../components/GroupOptionsMenu";
import { FaHome } from "react-icons/fa";

function GroupChat() {
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [inviteEmail, setInviteEmail] = useState("");
    const [members, setMembers] = useState([]);
    const [showMessageOptions, setShowMessageOptions] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null); // 開いているメニューのIDを管理
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const navigate = useNavigate();
    const menuRef = useRef(null);
    const userMenuRef = useRef(null);

    const fetchGroups = () => {
        axios.get("/api/user-groups")
            .then((response) => {
                setGroups(response.data);
            })
            .catch((error) => {
                console.error("グループの取得エラー:", error);
            });
    };

    const fetchMembers = (groupId) => {
        axios.get(`/api/groups/${groupId}/members`)
            .then((response) => {
                setMembers(response.data);
            })
            .catch((error) => {
                console.error("メンバーの取得エラー:", error);
            });
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    useEffect(() => {
        if (selectedGroup) {
            fetchMembers(selectedGroup.id);
            const channel = window.Echo.channel(`group.${selectedGroup.id}`);
            channel.listen("NewMessage", (e) => {
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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenuId(null); // グループメニューを閉じる
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false); // ユーザーアイコンのメニューを閉じる
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const selectGroup = (group) => {
        setSelectedGroup(group);
        axios.get(`/api/groups/${group.id}/messages`).then((response) => {
            setMessages(response.data);
        });
    };

    const sendMessage = () => {
        const trimmedInput = input.trim();
        if (trimmedInput === "" || !selectedGroup) return;

        axios.post("/api/send-group-message", {
            message: trimmedInput,
            group_id: selectedGroup.id
        }).catch((error) => {
            console.error("メッセージ送信エラー:", error);
        });
        setInput("");
    };

    const inviteUser = () => {
        const email = prompt("招待するユーザーのメールアドレスを入力してください");
        if (email && email.trim() !== "" && selectedGroup) {
            axios.post(`/api/groups/${selectedGroup.id}/invite`, { email })
                .then(() => {
                    alert(`ユーザー ${email} が招待されました`);
                    fetchMembers(selectedGroup.id); // 招待後にメンバー情報を再取得
                })
                .catch((error) => {
                    console.error("ユーザー招待エラー:", error);
                });
        }
    };

    const toggleMessageOptions = (index) => {
        setShowMessageOptions(showMessageOptions === index ? null : index);
    };

    const deleteMessage = (messageId) => {
        axios.delete(`/api/messages/${messageId}`)
            .then(() => {
                setMessages(messages.filter((msg) => msg.id !== messageId));
                setShowMessageOptions(null);
            })
            .catch((error) => {
                console.error("メッセージ削除エラー:", error);
            });
    };

    const renameGroup = (group) => {
        const newName = prompt("新しいグループ名を入力してください:", group.name);
        if (newName) {
            axios.put(`/api/groups/${group.id}`, { name: newName })
                .then(() => {
                    fetchGroups();
                    if (selectedGroup?.id === group.id) {
                        setSelectedGroup({ ...selectedGroup, name: newName });
                    }
                })
                .catch((error) => {
                    console.error("グループ名変更エラー:", error);
                });
        }
    };

    const deleteGroup = (group) => {
        if (window.confirm("本当にこのグループを削除しますか？")) {
            axios.delete(`/api/groups/${group.id}`)
                .then(() => {
                    fetchGroups();
                    if (selectedGroup?.id === group.id) {
                        setSelectedGroup(null);
                    }
                })
                .catch((error) => {
                    console.error("グループ削除エラー:", error);
                });
        }
    };

    return (
        <div className="w-full h-screen flex flex-col bg-gray-900 overflow-hidden">
            <div className="bg-gray-700 text-gray-200 py-4 w-full flex justify-between items-center">
                <FaHome
                    onClick={() => navigate("/")}
                    className="text-white text-2xl cursor-pointer ml-4"
                />
                <h2 className="text-2xl font-bold text-center flex-grow">motive room</h2>
            </div>

            <div className="flex flex-grow overflow-hidden">
                <div className="w-1/6 bg-gray-100 p-4 h-full overflow-y-auto">
                    <h3 className="text-lg font-semibold mb-4">グループ</h3>
                    <ul className="space-y-2">
                        {groups.map((group) => (
                            <li key={group.id} className={`cursor-pointer p-2 rounded hover:bg-blue-100 transition ${selectedGroup?.id === group.id ? "bg-blue-200" : ""}`}>
                                <div className="flex justify-between items-center">
                                    <span onClick={() => selectGroup(group)}>{group.name}</span>
                                    <GroupOptionsMenu
                                        onRename={() => renameGroup(group)}
                                        onDelete={() => deleteGroup(group)}
                                        isOpen={openMenuId === group.id}
                                        toggleMenu={() => setOpenMenuId(openMenuId === group.id ? null : group.id)}
                                        ref={menuRef}
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="w-5/6 p-4 h-full flex flex-col">
                    {selectedGroup ? (
                        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col flex-grow overflow-hidden">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold">{selectedGroup.name}</h3>
                                <div className="flex items-center space-x-2" ref={userMenuRef}>
                                    <UserIcon members={members} isMenuOpen={isUserMenuOpen} toggleMenu={() => setIsUserMenuOpen(!isUserMenuOpen)} />
                                    <button onClick={inviteUser} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
                                        招待
                                    </button>
                                </div>
                            </div>
                            <div className="flex-grow overflow-y-auto bg-gray-50 p-4 rounded-lg mb-4 shadow-inner relative" style={{ maxHeight: '80vh' }}>
                                <ul className="space-y-1">
                                    {messages.map((msg, index) => (
                                        <li key={index} className="p-2 bg-blue-50 rounded-lg border border-gray-200 relative group">
                                            <span>{msg.message}</span>
                                            <button
                                                onClick={() => toggleMessageOptions(index)}
                                                className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100"
                                            >
                                                ・・・
                                            </button>
                                            {showMessageOptions === index && (
                                                <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-lg p-2 z-20">
                                                    <button
                                                        onClick={() => deleteMessage(msg.id)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        削除する
                                                    </button>
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex space-x-2">
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            sendMessage(); // Enterキーが押されたときに送信
                                        }
                                    }}
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
