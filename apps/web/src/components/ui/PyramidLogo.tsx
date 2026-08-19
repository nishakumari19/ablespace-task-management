import React from 'react';

export function PyramidLogo({ size = 28, className = '' }: { size?: number; className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <rect width="40" height="40" rx="8" fill="#000000" />
        <path
          d="M20 10L11 26L20 30L29 26L20 10Z"
          stroke="#FFFFFF"
          strokeWidth="2.3"
          strokeLinejoin="round"
        />
        <path
          d="M20 10V30"
          stroke="#FFFFFF"
          strokeWidth="2.3"
          strokeLinecap="round"
        />
      </svg>
      <span className="text-[15px] font-bold text-neutral-900 dark:text-white tracking-tight">
        Pyramid
      </span>
    </div>
  );
}

export function PyramidIcon({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      <rect width="40" height="40" rx="8" fill="#000000" />
      <path
        d="M20 10L11 26L20 30L29 26L20 10Z"
        stroke="#FFFFFF"
        strokeWidth="2.3"
        strokeLinejoin="round"
      />
      <path
        d="M20 10V30"
        stroke="#FFFFFF"
        strokeWidth="2.3"
        strokeLinecap="round"
      />
    </svg>
  );
}
