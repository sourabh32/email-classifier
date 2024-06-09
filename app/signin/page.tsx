"use client";
import { signIn } from 'next-auth/react';

import { useState } from 'react';
import { toast } from 'sonner';

export default function SignIn() {
    
    const [apiKey, setApiKey] = useState('');

    const handleSaveApiKey = () => {
        localStorage.setItem('openai-api-key', apiKey);
        toast('API Key saved');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-2xl font-bold mb-4">Sign In</h1>
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4"
                onClick={async () => {
                    await signIn("google",{callbackUrl:"/"});
                    toast("Google signed in sucessfully")
                }}
            >
                Login with Google
            </button>

            <div className="flex flex-col items-center mt-4">
                <label className="mb-2 text-lg">Enter OpenAI API Key</label>
                <input
                    type="text"
                    className="border border-gray-300 p-2 rounded-lg mb-4"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                />
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded-lg"
                    onClick={handleSaveApiKey}
                >
                    Save API Key
                </button>
            </div>
        </div>
    );
}
