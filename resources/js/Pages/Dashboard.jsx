// resources/js/Pages/Dashboard.jsx

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';

export default function Dashboard({ auth }) {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [groupName, setGroupName] = useState('');

    const goToChat = () => {
        navigate('/chat');
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
            })
            .catch(error => {
                console.error('グループ作成エラー:', error);
            });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            ログイン中
                            <button
                                onClick={goToChat}
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                チャットへ移動
                            </button>
                            <button
                                onClick={goToGroupChat}
                                className="mt-4 ml-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                            >
                                グループチャットへ移動
                            </button>
                            <button
                                onClick={openModal}
                                className="mt-4 ml-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                グループ作成
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* モーダル */}
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
