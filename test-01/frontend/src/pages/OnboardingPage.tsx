import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';

interface OnboardingPageProps {
  onLogin: (clientId: string) => void;
}

function OnboardingPage({ onLogin }: OnboardingPageProps) {
  const [name, setName] = useState('');
  const [done, setDone] = useState(false);

  const handleStart = () => {
    onLogin(name.trim() || 'Guest');
    setDone(true);
  };

  const handleContinueAsGuest = () => {
    onLogin('Guest');
    setDone(true);
  };

  if (done) return <Navigate to="/dashboard" replace />;

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm text-center">
        <h1 className="text-3xl font-bold text-amber-900 mb-2">Welcome Corn Counter!</h1>
        <p className="text-gray-600 mb-6">Enter your name to start harvesting</p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
        <button
          onClick={handleStart}
          className="w-full bg-amber-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-amber-600 transition-colors duration-300"
        >
          Start Harvesting
        </button>
        <div className="my-4 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-500">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        <button
          onClick={handleContinueAsGuest}
          className="w-full bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-300"
        >
          Continue as Guest
        </button>
      </div>
    </div>
  );
}

export default OnboardingPage;
