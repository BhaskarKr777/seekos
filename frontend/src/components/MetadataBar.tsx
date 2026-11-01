'use client';

import React from 'react';
import { Clock, Cpu, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { ClientIcon } from './ClientIcon';
import { SearchMetadata } from '@/types/search';

interface MetadataBarProps {
  metadata: SearchMetadata;
  query: string;
}

export function MetadataBar({ metadata, query }: MetadataBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 py-2 text-xs text-[var(--text-muted)] font-mono border-b border-[var(--border-subtle)] pb-3 mb-4">
      <div className="flex items-center space-x-3">
        <span>
          Found <strong className="text-[var(--text-primary)] font-semibold">{metadata.total}</strong> results for{' '}
          <span className="text-[var(--accent)] font-semibold">&quot;{query}&quot;</span>
        </span>

        <span className="flex items-center text-[var(--text-muted)]">
          <ClientIcon icon={Clock} className="h-3 w-3 mr-1 text-[var(--text-muted)]" />
          {metadata.took_ms} ms
        </span>
      </div>

      {/* Provider Status Badges */}
      <div className="flex items-center space-x-2">
        <ClientIcon icon={Cpu} className="h-3 w-3 text-[var(--text-muted)]" />
        <span className="text-[var(--text-muted)]">Providers:</span>

        {metadata.provider_status.map((p) => {
          if (p.status === 'success') {
            return (
              <span
                key={p.name}
                className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40"
              >
                <ClientIcon icon={CheckCircle2} className="h-2.5 w-2.5 mr-1 text-emerald-500 dark:text-emerald-400" />
                {p.name}
              </span>
            );
          }
          if (p.status === 'timeout') {
            return (
              <span
                key={p.name}
                className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-mono bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40"
              >
                <ClientIcon icon={AlertTriangle} className="h-2.5 w-2.5 mr-1 text-amber-500 dark:text-amber-400" />
                {p.name} (timeout)
              </span>
            );
          }
          return (
            <span
              key={p.name}
              className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-mono bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/40"
            >
              <ClientIcon icon={XCircle} className="h-2.5 w-2.5 mr-1 text-rose-500 dark:text-rose-400" />
              {p.name} (error)
            </span>
          );
        })}
      </div>
    </div>
  );
}
