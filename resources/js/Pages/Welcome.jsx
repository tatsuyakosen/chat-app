import { Link, Head } from '@inertiajs/react';

export default function Welcome({ auth }) {
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
                        className="text-lg font-semibold text-gray-300 hover:text-gray-100 focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                    >
                        Dashboard
                    </Link>
                ) : (
                    <div className="flex space-x-4">
                        <Link
                            href={route('login')}
                            className="px-6 py-3 text-lg bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition focus:outline focus:outline-2 focus:rounded-sm focus:outline-blue-500"
                        >
                            Log in
                        </Link>
                        <Link
                            href={route('register')}
                            className="px-6 py-3 text-lg bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition focus:outline focus:outline-2 focus:rounded-sm focus:outline-green-500"
                        >
                            Register
                        </Link>
                    </div>
                )}
            </div>
            
            {/* グレーのグラデーション背景を直接設定 */}
            <style>{`
                body {
                    background: linear-gradient(to bottom right, #2b2b2b, #1a1a1a);
                    color: #ddd; /* 全体の文字色を少し明るく */
                }
            `}</style>
        </>
    );
}
