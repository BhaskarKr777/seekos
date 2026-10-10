'use client';

import React from 'react';

export function ResultSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((n) => (
        <div
          key={n}
          className="glass-panel rounded-2xl p-5 border border-slate-800/80 animate-pulse-subtle"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="h-3 w-32 bg-slate-800 rounded"></div>
            <div className="h-3 w-16 bg-slate-800 rounded"></div>
          </div>
          <div className="h-6 w-3/4 bg-slate-800 rounded mb-2"></div>
          <div className="h-3 w-1/2 bg-slate-800/60 rounded mb-3"></div>
          <div className="space-y-2">
            <div className="h-3 w-full bg-slate-800/40 rounded"></div>
            <div className="h-3 w-5/6 bg-slate-800/40 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
