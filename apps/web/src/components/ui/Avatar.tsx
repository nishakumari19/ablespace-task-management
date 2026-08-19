'use client';

import React from 'react';

interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function DexterAvatarSVG({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`rounded-full flex-shrink-0 ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle */}
      <circle cx="50" cy="50" r="50" fill="#7C3AED" />
      <circle cx="50" cy="50" r="48" fill="url(#avatar_grad)" />
      <defs>
        <radialGradient id="avatar_grad" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#C084FC" />
          <stop offset="60%" stopColor="#7E22CE" />
          <stop offset="100%" stopColor="#4C1D95" />
        </radialGradient>
      </defs>
      
      {/* Cartoon Hair Back */}
      <path
        d="M20 50 C20 20, 80 20, 80 50 C82 62, 75 75, 70 80 L30 80 C25 75, 18 62, 20 50 Z"
        fill="#DC2626"
      />
      {/* Face */}
      <ellipse cx="50" cy="52" rx="26" ry="24" fill="#FED7AA" />
      {/* Ears */}
      <circle cx="24" cy="52" r="6" fill="#FDBA74" />
      <circle cx="76" cy="52" r="6" fill="#FDBA74" />
      {/* Hair Top / Front Spikes */}
      <path
        d="M26 35 C28 20, 45 15, 52 18 C58 12, 72 16, 75 28 C78 22, 84 25, 82 36 C75 32, 65 30, 50 32 C38 31, 30 33, 26 35 Z"
        fill="#EF4444"
      />
      {/* Dexter Black/Dark Glasses Frame */}
      <rect x="30" y="44" width="17" height="14" rx="3" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
      <rect x="53" y="44" width="17" height="14" rx="3" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
      <rect x="47" y="49" width="6" height="3" fill="#0F172A" />
      {/* Glasses Lenses (Light Cyan reflection) */}
      <rect x="32" y="46" width="13" height="10" rx="1.5" fill="#E0F2FE" />
      <rect x="55" y="46" width="13" height="10" rx="1.5" fill="#E0F2FE" />
      <path d="M34 47 L41 54" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M57 47 L64 54" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
      {/* Smile / Mouth */}
      <path d="M44 65 Q50 69 56 65" stroke="#9A3412" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Lab Coat / Shirt */}
      <path d="M28 85 L72 85 L68 76 L32 76 Z" fill="#F8FAFC" />
      <path d="M42 76 L50 85 L58 76" stroke="#94A3B8" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

export function Avatar({ src, name = 'Dexter', size = 'md', className = '' }: AvatarProps) {
  const sizeClasses = {
    xs: 'w-5 h-5 text-[10px]',
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm',
    xl: 'w-12 h-12 text-base',
  };

  const isDexter = name.toLowerCase().includes('dexter');

  if (isDexter && (!src || src.includes('dicebear') || src.includes('dexter'))) {
    return <DexterAvatarSVG className={`${sizeClasses[size]} ${className}`} />;
  }

  if (src && !src.includes('dicebear')) {
    return (
      <img
        src={src}
        alt={name}
        className={`rounded-full object-cover border border-neutral-200 dark:border-neutral-700 flex-shrink-0 ${sizeClasses[size]} ${className}`}
      />
    );
  }

  // Handle specific initial badges e.g. "CN" or roles
  if (name.toUpperCase() === 'CN') {
    return (
      <div
        className={`rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 font-semibold flex items-center justify-center flex-shrink-0 ${sizeClasses[size]} ${className}`}
      >
        CN
      </div>
    );
  }

  const getInitials = (n: string) => {
    const parts = n.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  // Color generator based on name hash for consistency
  const colorMap: Record<string, string> = {
    Admin: 'bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300',
    'QA Team': 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300',
    Designer: 'bg-pink-100 text-pink-700 dark:bg-pink-900/60 dark:text-pink-300',
    Security: 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300',
    'Dev Team': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300',
    Product: 'bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300',
    Engineering: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300',
  };

  const chosenColor =
    colorMap[name] ||
    'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700';

  return (
    <div
      className={`rounded-full font-semibold flex items-center justify-center flex-shrink-0 ${chosenColor} ${sizeClasses[size]} ${className}`}
    >
      {getInitials(name)}
    </div>
  );
}
