import { Link, Head } from '@inertiajs/react';
import React, { useState } from 'react';
import axios from 'axios';

export default function Welcome({ auth }) {
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('/api/contact', form)
            .then(() => setSubmitted(true))
            .catch((error) => console.error("Error sending contact form:", error));
    };

    return (
        <>
            <Head title="Welcome" />
            <div className="relative flex flex-col items-center justify-center min-h-screen bg-center bg-gray-900 selection:bg-red-500 selection:text-white">
                
                {/* アプリ名 */}
                <h1 className="text-9xl font-bold text-white mb-6">motive room</h1>

                {/* アプリ説明 */}
                <p className="text-2xl text-gray-400 mb-8 text-center max-w-2xl">
                    意見に名前や肩書きはいらない。「motive room」は、建前や上下関係に縛られることなく、純粋なアイデアと対話ができる場を提供します。誰が話しているかは秘密のまま、自由な発想と率直な意見を交わせる安全な空間で、あなたのチームの可能性を広げましょう。
                </p>

                {auth.user ? (
                    <Link
                        href={route('dashboard')}
                        className="px-6 py-3 bg-blue-500 text-white font-semibold text-lg rounded-lg hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
                    >
                        ダッシュボード
                    </Link>
                ) : (
                    <div className="flex space-x-4">
                        <Link
                            href={route('login')}
                            className="px-6 py-3 text-lg bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
                        >
                            ログイン
                        </Link>
                        <Link
                            href={route('register')}
                            className="px-6 py-3 text-lg bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400"
                        >
                            新規登録
                        </Link>
                    </div>
                )}

                {/* お問い合わせフォーム */}
                <div className="mt-16 w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">お問い合わせ</h2>
                    {submitted ? (
                        <p className="text-green-500">送信されました。ありがとうございます！</p>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700">名前</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded text-black"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">メールアドレス</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded text-black"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">メッセージ</label>
                                <textarea
                                    name="message"
                                    value={form.message}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded text-black"
                                    required
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                            >
                                送信
                            </button>
                        </form>
                    )}
                </div>
            </div>
            
            {/* グレーのグラデーション背景を直接設定 */}
            <style>{`
                body {
                    background: linear-gradient(to bottom right, #2b2b2b, #1a1a1a);
                    color: #ddd;
                }
            `}</style>
        </>
    );
}
