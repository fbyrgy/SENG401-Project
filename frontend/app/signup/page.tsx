'use client'

import React, { useState } from "react";
import Header from '../components/header';
import BackButton from '../components/back';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { BACKEND_URL } from '../config';

export default function LoginPage() {
    
    const [error, setError] = useState("");

    const router = useRouter();
    const { login } = useAuth();

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Code for signing up
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check if the email is valid
        const email = (e.target as HTMLFormElement).email.value;
        if (!emailRegex.test(email)) {
            setError("Invalid email");
            return;
        }

        // Check if passwords match
        const password = (e.target as HTMLFormElement).password.value;
        const passwordConfirm = (e.target as HTMLFormElement).passwordConfirm.value;
        if (password !== passwordConfirm) {
            setError("Passwords do not match");
            return;
        }

        setError("");

        try {
            const response = await fetch(`${BACKEND_URL}/connection/add_user`, {
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
                login(email); // Log the user in
                // Redirect to the homepage after signing up
                router.push("/");
            } else {
                setError("Failed to sign up");
            }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            setError("Failed to sign up");

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

                        {/* Sign Up Text */}
                        <h1 className="text-white text-4xl select-none">Sign Up</h1>
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

                        {/* Confirm Password Input */}
                        <div className="flex items-center bg-charcoal rounded-xl p-4 mb-6 select-none">
                            <input
                                type="password"
                                name="passwordConfirm"
                                placeholder="Confirm Password"
                                className="bg-transparent outline-none text-white flex-1 pl-2"
                                required
                            />
                        </div>

                        {/* Display text if passwords don't match */}
                        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                        {/* Sign Up Button */}
                        <button
                            type="submit"
                            className="bg-lightBlue hover:bg-blue-600 rounded-xl w-full py-3 text-white text-lg select-none"
                        >
                            Sign Up
                        </button>

                        {/* Link to Sign In */}
                        <p className="text-white text-center mt-6 select-none">
                            Already have an account?{' '}
                            <a href="/login" className="text-blue-400 underline">
                                Sign in
                            </a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
