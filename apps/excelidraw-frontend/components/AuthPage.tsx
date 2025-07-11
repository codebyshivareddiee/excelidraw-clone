"use client";

import { useState } from "react";
import axios from "axios";
import { HTTP_BACKEND } from "@/config";
import { useRouter } from "next/navigation";

export function AuthPage({ isSignin }: { isSignin: boolean }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    async function handleAuth() {
        setError("");
        try {
            if (isSignin) {
                const res = await axios.post(`${HTTP_BACKEND}/signin`, {
                    username,
                    password
                });
                if (res.data.token) {
                    localStorage.setItem("token", res.data.token);
                    router.push("/");
                } else {
                    setError("Something went wrong");
                }
            } else {
                const res = await axios.post(`${HTTP_BACKEND}/signup`, {
                    username,
                    password,
                    name
                });
                if (res.data.userId) {
                    router.push("/signin");
                } else {
                    setError("Something went wrong");
                }
            }
        } catch (e: any) {
            setError(e?.response?.data?.message || "Something went wrong");
        }
    }

    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <div className="p-6 m-2 bg-white rounded">
                <div className="p-2">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className="border p-2 rounded w-full"
                    />
                </div>
                {!isSignin && (
                    <div className="p-2">
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="border p-2 rounded w-full"
                        />
                    </div>
                )}
                <div className="p-2">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="border p-2 rounded w-full"
                    />
                </div>
                {error && <div className="text-red-500 p-2">{error}</div>}
                <div className="pt-2">
                    <button
                        className="bg-red-200 rounded p-2 w-full"
                        onClick={handleAuth}
                    >
                        {isSignin ? "Sign in" : "Sign up"}
                    </button>
                </div>
            </div>
        </div>
    );
}