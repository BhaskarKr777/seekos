'use client';

import React, { useEffect, useState } from 'react';
import { Search, Shield, Server, ExternalLink, Sun, Moon } from 'lucide-react';
import { ClientIcon } from './ClientIcon';
import { checkBackendHealth } from '@/lib/api';
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
    <header className="sticky top-0 z-50 theme-card border-b bg-opacity-90 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#345386] via-[#4272a9] to-[#c07597] p-0.5 shadow-md shadow-[#0d344a]/30">
            <div className="h-full w-full bg-[#0e0d26] rounded-[10px] flex items-center justify-center">
              <ClientIcon icon={Search} className="h-5 w-5 text-[#c07597]" />
            </div>
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight flex items-center gap-1">
              <span className="text-[var(--text-primary)]">Seek</span>
              <span className="accent-gradient-text">OS</span>
            </span>
            <span className="text-[11px] text-[var(--text-secondary)] hidden sm:block font-medium">
              Private Search
            </span>
          </div>
        </div>

        {/* Right Nav Items */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-input)] text-[var(--text-primary)] hover:border-[#c07597] hover:text-[#c07597] transition-all cursor-pointer"
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
              <span className="flex items-center text-emerald-400 font-medium">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse mr-1"></span>
                Online
              </span>
            ) : (
              <span className="flex items-center text-rose-400 font-medium">
                <span className="h-2 w-2 rounded-full bg-rose-500 mr-1"></span>
                Offline
              </span>
            )}
          </div>

          {/* Privacy badge */}
          <div className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] text-xs text-[#c07597] font-medium">
            <ClientIcon icon={Shield} className="h-3.5 w-3.5" />
            <span>Private</span>
          </div>

          {/* Docs Link */}
          <a
            href="http://localhost:8000/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-xs text-[var(--text-secondary)] hover:text-[#c07597] transition-colors px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-input)]"
          >
            <span>Docs</span>
            <ClientIcon icon={ExternalLink} className="h-3 w-3" />
          </a>
        </div>
      </div>
    </header>
  );
}
