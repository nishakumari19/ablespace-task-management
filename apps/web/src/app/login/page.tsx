'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { PyramidLogo } from '@/components/ui/PyramidLogo';

export default function LoginPage() {
  const router = useRouter();
  const { guestLogin, isLoading } = useAuth();
  const [googleNotice, setGoogleNotice] = useState(false);

  const handleGuestLogin = async () => {
    try {
      await guestLogin();
      router.push('/tasks');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-neutral-950 flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center w-full max-w-[400px]">
        {/* Pyramid Brand Logo Header */}
        <div className="mb-6">
          <PyramidLogo size={28} />
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-7 w-full shadow-xs">
          <h1 className="text-[18px] font-bold text-center text-neutral-900 dark:text-white mb-1.5 tracking-tight">
            Let's get back on track
          </h1>
          <p className="text-[13px] text-center text-neutral-500 dark:text-neutral-400 mb-6">
            Enter your email below to login to your account.
          </p>

          {googleNotice && (
            <div className="mb-4 p-2.5 text-xs bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 rounded-xl border border-amber-200 dark:border-amber-800 text-center animate-in fade-in">
              Please use <strong>Continue as Guest</strong> to test the app.
            </div>
          )}

          <div className="flex flex-col gap-2.5">
            <button
              onClick={handleGuestLogin}
              disabled={isLoading}
              className="flex items-center justify-center w-full h-10 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 rounded-full text-[13px] font-medium transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
            >
              Continue as Guest
            </button>

            <button
              onClick={() => setGoogleNotice(true)}
              className="flex items-center justify-center w-full h-10 bg-white hover:bg-neutral-50 dark:bg-neutral-800 dark:hover:bg-neutral-700/80 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 rounded-full text-[13px] font-medium transition-colors cursor-pointer gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#111" className="dark:fill-white" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#111" className="dark:fill-white" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#111" className="dark:fill-white" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#111" className="dark:fill-white" />
              </svg>
              <span>Login with Google</span>
            </button>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <p className="mt-4 text-[11px] text-neutral-400 dark:text-neutral-500 text-center leading-relaxed">
          By clicking continue, you agree to
          <br />
          our{' '}
          <a href="#" className="text-neutral-600 dark:text-neutral-400 underline hover:text-neutral-900">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-neutral-600 dark:text-neutral-400 underline hover:text-neutral-900">
            Privacy
          </a>
          <br />
          <a href="#" className="text-neutral-600 dark:text-neutral-400 underline hover:text-neutral-900">
            Policy
          </a>
        </p>
      </div>
    </div>
  );
}
