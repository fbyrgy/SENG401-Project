'use client'

import Header from '../components/header';
import BackButton from '../components/back';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';   

export default function LoginPage() {

    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();
    const { login } = useAuth();

    // Code for signing in
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const email = (e.target as HTMLFormElement).email.value;
        const password = (e.target as HTMLFormElement).password.value;

        try {
            const response = await fetch("http://127.0.0.1:5002/login", {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

                if (response.ok) {  
                    login(); // Log the user in
                    // Redirect to the homepage after logging in
                    router.push('/');
                } else {
                    setErrorMessage("Incorrect email or password. Please try again");
                }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            setErrorMessage("An unexpected error occurred. Please try again");  
        }
    };

    return (
        <div>
            <Header />
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="w-[654px] h-[699px] p-10 rounded-2xl flex flex-col bg-secondary">

                    <div className="relative w-full flex items-center justify-center mb-8">
                        {/* Back Arrow */}
                        <div className="absolute left-0 top-0">
                            <Link href="/">
                                <BackButton />
                            </Link>
                        </div>

                        {/* Sign In Text */}
                        <h1 className="text-white text-4xl select-none">Sign In</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto">
                        {/* Email Input */}
                        <div className="flex items-center bg-charcoal rounded-xl p-4 mb-6 select-none">
                            <input
                                type="text"
                                name="email"
                                placeholder="Email"
                                className="bg-transparent outline-none text-white flex-1 pl-2"
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div className="flex items-center bg-charcoal rounded-xl p-4 mb-6 select-none">
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                className="bg-transparent outline-none text-white flex-1 pl-2"
                                required
                            />
                        </div>

                        {/* Sign In Button */}
                        <button
                            type="submit"
                            className="bg-lightBlue hover:bg-blue-600 rounded-xl w-full py-3 text-white text-lg select-none"
                        >
                            Sign In
                        </button>
                        {/* Error Message */}
                        {errorMessage && (
                            <p className="text-red-500 text-center mt-4">{errorMessage}</p>
                        )}

                        {/* Link to Sign Up */}
                        <p className="text-white text-center mt-6 select-none">
                            Don&apos;t have an account?{' '}
                            <a href="/signup" className="text-blue-400 underline">
                                Sign up
                            </a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

