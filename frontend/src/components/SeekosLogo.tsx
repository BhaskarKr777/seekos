'use client';

import React from 'react';
import Link from 'next/link';

interface SeekosLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
}

export function SeekosLogo({
  size = 'md',
  showSubtitle = true,
  className = '',
}: SeekosLogoProps) {
  const iconDimensions = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  }[size];

  const titleSize = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  }[size];

  return (
    <Link
      href="/"
      aria-label="SeekOS Home"
      className={`group inline-flex items-center space-x-3 cursor-pointer select-none transition-transform duration-200 active:scale-95 ${className}`}
    >
      {/* Iconic Vector Emblem without star */}
      <div
        className={`relative ${iconDimensions} rounded-xl p-0.5 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:shadow-blue-500/25 group-hover:scale-105`}
      >
        <svg
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full rounded-[10px] bg-[#09090b]"
        >
          <defs>
            {/* Primary Gradient */}
            <linearGradient
              id="seekos-brand-grad"
              x1="6"
              y1="6"
              x2="38"
              y2="38"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="35%" stopColor="#3b82f6" />
              <stop offset="70%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>

          {/* Clean Dual-Ribbon Interlocking S Emblem */}
          <path
            d="M 30 14 C 29.5 9.5 25.5 8 21.5 8 C 15.5 8 12 12 12 17 C 12 23.5 19.5 23 22.5 25 C 25 26.6 25 29 22.5 30.5 C 19 32.5 14.5 31.5 12.5 28"
            stroke="url(#seekos-brand-grad)"
            strokeWidth="3.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path
            d="M 14 30 C 14.5 34.5 18.5 36 22.5 36 C 28.5 36 32 32 32 27 C 32 20.5 24.5 21 21.5 19 C 19 17.4 19 15 21.5 13.5 C 25 11.5 29.5 12.5 31.5 16"
            stroke="url(#seekos-brand-grad)"
            strokeWidth="3.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <span className={`${titleSize} font-extrabold tracking-tight flex items-center leading-none`}>
          <span className="text-[var(--text-primary)] transition-colors group-hover:text-blue-500">
            Seek
          </span>
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
            OS
          </span>
        </span>
        {showSubtitle && (
          <span className="text-[10px] sm:text-[11px] text-[var(--text-secondary)] font-medium tracking-wide transition-colors mt-0.5">
            Private Search
          </span>
        )}
      </div>
    </Link>
  );
}
