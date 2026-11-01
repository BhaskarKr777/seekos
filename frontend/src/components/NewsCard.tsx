'use client';

import React, { useState } from 'react';
import { ExternalLink, Globe, Copy, Check, Calendar, Newspaper, Clock } from 'lucide-react';
import { ClientIcon } from './ClientIcon';
import { SearchResult } from '@/types/search';

interface NewsCardProps {
  result: SearchResult;
}

export function NewsCard({ result }: NewsCardProps) {
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(result.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const domain = result.domain || (result.url ? new URL(result.url).hostname : '');
  const formattedDate = result.published_at
    ? new Date(result.published_at).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;

  const thumbnail = result.thumbnail_url || result.img_url;

  return (
    <article className="group theme-card rounded-2xl p-5 flex flex-col sm:flex-row gap-4 items-start justify-between transition-all duration-200 hover:shadow-md border border-[var(--border-subtle)]">
      <div className="flex-1 min-w-0 space-y-2">
        {/* Publisher info & timestamp */}
        <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
          <div className="flex items-center space-x-2 truncate">
            <span className="p-1 rounded-md bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--accent)]">
              <ClientIcon icon={Newspaper} className="h-3.5 w-3.5" />
            </span>
            <span className="font-semibold text-[var(--text-primary)] truncate">
              {result.author || domain}
            </span>
            {formattedDate && (
              <span className="text-[var(--text-muted)] flex items-center gap-1">
                • <ClientIcon icon={Clock} className="h-3 w-3" /> {formattedDate}
              </span>
            )}
          </div>

          <button
            onClick={handleCopy}
            className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-input)] transition-colors cursor-pointer shrink-0"
            title="Copy article link"
          >
            <ClientIcon icon={copied ? Check : Copy} className="h-3.5 w-3.5 text-emerald-400" />
          </button>
        </div>

        {/* Headline Link */}
        <a
          href={result.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group-hover:text-[var(--accent)] text-[var(--text-primary)] font-bold text-lg sm:text-xl leading-snug tracking-tight hover:underline flex items-start justify-between gap-2 transition-colors block"
        >
          <span>{result.title}</span>
        </a>

        {/* Snippet */}
        {result.snippet && (
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-3 font-normal">
            {result.snippet}
          </p>
        )}

        {/* Domain origin */}
        <div className="pt-2 flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-mono">
          <ClientIcon icon={Globe} className="h-3 w-3 text-[var(--accent)]" />
          <span className="truncate">{domain}</span>
          <ClientIcon icon={ExternalLink} className="h-3 w-3 opacity-60 ml-auto" />
        </div>
      </div>

      {/* Thumbnail image if available */}
      {thumbnail && !imgError && (
        <a
          href={result.url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 w-full sm:w-36 h-28 sm:h-28 rounded-xl overflow-hidden bg-[var(--bg-input)] border border-[var(--border-subtle)] block cursor-pointer"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnail}
            alt={result.title}
            onError={() => setImgError(true)}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </a>
      )}
    </article>
  );
}
