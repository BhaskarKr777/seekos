'use client';

import React, { useEffect, useState } from 'react';
import { Shield, Server, ExternalLink, Sun, Moon } from 'lucide-react';
import { ClientIcon } from './ClientIcon';
import { SeekosLogo } from './SeekosLogo';
import { API_BASE_URL, checkBackendHealth } from '@/lib/api';
import { useTheme } from '@/context/ThemeContext';

export function Navbar() {
  const [isBackendHealthy, setIsBackendHealthy] = useState<boolean | null>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    checkBackendHealth().then(setIsBackendHealthy);
    const interval = setInterval(() => {
      checkBackendHealth().then(setIsBackendHealthy);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[var(--bg-header)] backdrop-blur-md border-b border-[var(--border-subtle)] transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Iconic Brand Logo */}
        <SeekosLogo size="md" />

        {/* Right Nav Items */}
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-input)] text-[var(--text-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors cursor-pointer"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            <ClientIcon icon={theme === 'dark' ? Sun : Moon} className="h-4 w-4" />
          </button>

          {/* Backend Status Badge */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] font-medium">
            <ClientIcon icon={Server} className="h-3.5 w-3.5 text-[var(--text-muted)]" />
            <span className="hidden sm:inline">API:</span>
            {isBackendHealthy === null ? (
              <span className="text-[var(--text-muted)] animate-pulse font-mono">...</span>
            ) : isBackendHealthy ? (
              <span className="flex items-center text-emerald-600 dark:text-emerald-400 font-medium">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse mr-1.5"></span>
                Online
              </span>
            ) : (
              <span className="flex items-center text-rose-600 dark:text-rose-400 font-medium">
                <span className="h-2 w-2 rounded-full bg-rose-500 mr-1.5"></span>
                Offline
              </span>
            )}
          </div>

          {/* Privacy badge */}
          <div className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] text-xs text-[var(--accent)] font-medium">
            <ClientIcon icon={Shield} className="h-3.5 w-3.5" />
            <span>Private</span>
          </div>

          {/* Docs Link */}
          <a
            href={`${API_BASE_URL}/docs`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-xs text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-input)]"
          >
            <span>Docs</span>
            <ClientIcon icon={ExternalLink} className="h-3 w-3" />
          </a>
        </div>
      </div>
    </header>
  );
}
