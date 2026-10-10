'use client';

import React, { useState } from 'react';
import { ExternalLink, Globe, Copy, Check, Calendar, Tag } from 'lucide-react';
import { ClientIcon } from './ClientIcon';
import { SearchResult } from '@/types/search';

interface ResultCardProps {
  result: SearchResult;
}

export function ResultCard({ result }: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(result.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const domain = result.domain || new URL(result.url).hostname;
  const formattedDate = result.published_at
    ? new Date(result.published_at).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <article className="group theme-card rounded-2xl p-5 animate-fade-in flex flex-col justify-between">
      <div>
        {/* Header domain & source info */}
        <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-2">
          <div className="flex items-center space-x-2 truncate pr-2">
            <span className="p-1 rounded-lg bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
              <ClientIcon icon={Globe} className="h-3.5 w-3.5 text-[#4272a9]" />
            </span>
            <span className="font-medium text-[var(--text-secondary)] truncate">{domain}</span>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {/* Provider Source Tag */}
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[var(--bg-input)] text-[#c07597] border border-[#c07597]/30">
              <ClientIcon icon={Tag} className="h-2.5 w-2.5 mr-1" />
              {result.source}
            </span>

            {/* Copy link button */}
            <button
              onClick={handleCopy}
              className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-input)] transition-colors cursor-pointer"
              title="Copy link address"
            >
              {copied ? (
                <ClientIcon icon={Check} className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <ClientIcon icon={Copy} className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Title & URL link */}
        <a
          href={result.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group-hover:text-[#4272a9] text-[var(--text-primary)] font-semibold text-lg sm:text-xl leading-snug tracking-tight hover:underline flex items-start justify-between gap-2 transition-colors"
        >
          <span>{result.title}</span>
          <ClientIcon icon={ExternalLink} className="h-4 w-4 shrink-0 text-[var(--text-muted)] group-hover:text-[#c07597] transition-colors mt-1" />
        </a>

        {/* URL breadcrumb */}
        <div className="text-xs font-mono text-[#4272a9] truncate mt-1 mb-2.5">
          {result.url}
        </div>

        {/* Snippet text */}
        {result.snippet && (
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-normal line-clamp-3">
            {result.snippet}
          </p>
        )}
      </div>

      {/* Published Date if present */}
      {formattedDate && (
        <div className="mt-3 pt-2.5 border-t border-[var(--border-subtle)] flex items-center text-[11px] text-[var(--text-muted)]">
          <ClientIcon icon={Calendar} className="h-3 w-3 mr-1" />
          <span>Published: {formattedDate}</span>
        </div>
      )}
    </article>
  );
}
