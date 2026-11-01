'use client';

import React from 'react';

interface ResultSkeletonProps {
  category?: string;
}

export function ResultSkeleton({ category = 'general' }: ResultSkeletonProps) {
  if (category === 'images') {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 animate-pulse">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <div
            key={n}
            className="theme-card rounded-2xl overflow-hidden border border-[var(--border-subtle)]"
          >
            <div className="aspect-square w-full bg-[var(--bg-input)]" />
            <div className="p-3 space-y-2">
              <div className="h-3 w-3/4 bg-[var(--border-subtle)]/50 rounded" />
              <div className="h-2.5 w-1/2 bg-[var(--border-subtle)]/30 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3, 4].map((n) => (
        <div
          key={n}
          className="theme-card rounded-2xl p-5 border border-[var(--border-subtle)]"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="h-3 w-32 bg-[var(--border-subtle)]/50 rounded" />
            <div className="h-3 w-16 bg-[var(--border-subtle)]/30 rounded" />
          </div>
          <div className="h-6 w-3/4 bg-[var(--border-subtle)]/60 rounded mb-2" />
          <div className="h-3 w-1/2 bg-[var(--border-subtle)]/40 rounded mb-3" />
          <div className="space-y-2">
            <div className="h-3 w-full bg-[var(--border-subtle)]/30 rounded" />
            <div className="h-3 w-5/6 bg-[var(--border-subtle)]/20 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
