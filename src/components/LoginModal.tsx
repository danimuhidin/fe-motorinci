// components/LoginModal.tsx

'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface LoginModalProps {
  onLoginSuccess: () => void;
}

export const LoginModal = ({ onLoginSuccess }: LoginModalProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Simulasi delay jaringan
    setTimeout(() => {
      if (username === 'rwrr.id' && password === 'Laleur123') {
        // Simpan status di session storage browser
        sessionStorage.setItem('is_authenticated', 'true');
        onLoginSuccess();
      } else {
        setError('Username atau password salah.');
      }
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-xs rounded-lg bg-black/20 border border-gray-700 p-6 shadow-lg shadow-white/5">
        <h2 className="text-lg font-bold text-center text-white mb-1">
          Hi, Administrator
        </h2>
        <p className="text-xs text-gray-400 text-center mb-5">
            Please login, and manage our legacy!
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-300"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 px-3 py-2 text-white shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 px-3 py-2 text-white shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "w-full justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900",
                isSubmitting && "opacity-50 cursor-not-allowed"
              )}
            >
              {isSubmitting ? 'Memproses...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};