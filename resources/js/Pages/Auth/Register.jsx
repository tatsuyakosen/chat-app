import { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('register'));
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-900">
            <GuestLayout>
                <Head title="Register" />

                <form onSubmit={submit} className="w-full max-w-2xl mx-auto bg-white rounded-lg p-10 shadow-lg">
                    <div>
                        <InputLabel htmlFor="name" value="Name" className="text-3xl" />
                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            className="mt-2 block w-full text-2xl p-4"
                            autoComplete="name"
                            isFocused={true}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} className="mt-2 text-xl" />
                    </div>

                    <div className="mt-6">
                        <InputLabel htmlFor="email" value="Email" className="text-3xl" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-2 block w-full text-2xl p-4"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            required
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
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        <InputError message={errors.password} className="mt-2 text-xl" />
                    </div>

                    <div className="mt-6">
                        <InputLabel htmlFor="password_confirmation" value="Confirm Password" className="text-3xl" />
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="mt-2 block w-full text-2xl p-4"
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                        />
                        <InputError message={errors.password_confirmation} className="mt-2 text-xl" />
                    </div>

                    <div className="flex items-center justify-end mt-8">
                        <Link
                            href={route('login')}
                            className="underline text-xl text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Already registered?
                        </Link>

                        <PrimaryButton className="ms-4 text-xl px-10 py-4" disabled={processing}>
                            登録する
                        </PrimaryButton>
                    </div>
                </form>
            </GuestLayout>
        </div>
    );
}
