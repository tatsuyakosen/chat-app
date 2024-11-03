// Login.jsx
import { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-900">
            <GuestLayout>
                <Head title="Log in" />

                {status && <div className="mb-4 font-medium text-xl text-green-600">{status}</div>}

                {/* フォームサイズと文字サイズをさらに拡大 */}
                <form onSubmit={submit} className="w-full max-w-2xl mx-auto bg-white rounded-lg p-10 shadow-lg">
                    <div>
                        <InputLabel htmlFor="email" value="Email" className="text-3xl" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-2 block w-full text-2xl p-4"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <InputError message={errors.email} className="mt-2 text-xl" />
                    </div>

                    <div className="mt-6">
                        <InputLabel htmlFor="password" value="Password" className="text-3xl" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-2 block w-full text-2xl p-4"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <InputError message={errors.password} className="mt-2 text-xl" />
                    </div>

                    <div className="block mt-6">
                        <label className="flex items-center">
                            
                        </label>
                    </div>

                    <div className="flex items-center justify-end mt-8">
                       
                        <PrimaryButton className="ml-4 text-xl px-10 py-4" disabled={processing}>
                            ログイン
                        </PrimaryButton>
                    </div>
                </form>
            </GuestLayout>
        </div>
    );
}
