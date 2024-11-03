import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard({ auth }) {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [invitations, setInvitations] = useState([]);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        console.log("auth object:", auth);
        
        if (auth && auth.user) { // authとauth.userが存在する場合にのみデータを取得
            fetchInvitations();
            fetchGroups();
            setLoading(false); // データ取得が完了したらロードを解除
        } else {
            // authがない場合、ログインページにリダイレクトする
            navigate("/login");
        }
    }, [auth]);

    const fetchInvitations = () => {
        axios.get('/api/invitations')
            .then((response) => {
                console.log("Invitations:", response.data);
                setInvitations(response.data);
            })
            .catch(error => {
                console.error("招待の取得エラー:", error);
            });
    };

    const fetchGroups = () => {
        axios.get('/api/user-groups')
            .then((response) => {
                setGroups(response.data);
            })
            .catch((error) => {
                console.error("グループの取得エラー:", error);
            });
    };

    const goToGroupChat = () => {
        navigate('/group-chat');
    };

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setGroupName('');
    };

    const createGroup = () => {
        if (groupName.trim() === '') return;

        axios.post('/api/groups', { name: groupName })
            .then(response => {
                alert('グループが作成されました！');
                closeModal();
                fetchGroups();
            })
            .catch(error => {
                console.error('グループ作成エラー:', error);
            });
    };

    const acceptInvitation = (groupId) => {
        axios.post(`/api/groups/${groupId}/accept`)
            .then(() => {
                setInvitations(invitations.filter(inv => inv.id !== groupId));
                alert('グループに参加しました');
                fetchGroups();
            })
            .catch(error => {
                console.error('参加エラー:', error);
            });
    };

    const declineInvitation = (groupId) => {
        axios.post(`/api/groups/${groupId}/decline`)
            .then(() => {
                setInvitations(invitations.filter(inv => inv.id !== groupId));
                alert('招待を辞退しました');
            })
            .catch(error => {
                console.error('辞退エラー:', error);
            });
    };

    if (loading) {
        return <p>Loading...</p>; // loadingがtrueの場合にロード中表示
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-white leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12 bg-gray-900 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            ログイン中
                        </div>
                        {invitations.length > 0 && (
                            <div className="p-6 text-gray-900">
                                <h3 className="font-semibold mb-4">招待されたグループ</h3>
                                <ul>
                                    {invitations.map((inv) => (
                                        <li key={inv.id} className="mb-2 flex justify-between items-center">
                                            <span>{inv.name}</span>
                                            <div>
                                                <button
                                                    onClick={() => acceptInvitation(inv.id)}
                                                    className="mr-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                                >
                                                    参加
                                                </button>
                                                <button
                                                    onClick={() => declineInvitation(inv.id)}
                                                    className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                                                >
                                                    辞退
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-center mt-8 space-x-4">
                        <button
                            onClick={goToGroupChat}
                            className="px-8 py-4 bg-purple-500 text-white text-lg font-semibold rounded-lg hover:bg-purple-600 transition"
                        >
                            グループチャットへ移動
                        </button>
                        <button
                            onClick={openModal}
                            className="px-8 py-4 bg-green-500 text-white text-lg font-semibold rounded-lg hover:bg-green-600 transition"
                        >
                            グループ作成
                        </button>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg w-80">
                        <h2 className="text-lg font-semibold mb-4">グループ作成</h2>
                        <input
                            type="text"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            placeholder="グループ名を入力"
                            className="w-full px-3 py-2 border rounded mb-4"
                        />
                        <div className="flex justify-end">
                            <button
                                onClick={createGroup}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
                            >
                                作成
                            </button>
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                                キャンセル
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
