'use client';

import React, { useState } from 'react';
import { Play, ExternalLink, Globe, Copy, Check, Clock, User, Calendar } from 'lucide-react';
import { ClientIcon } from './ClientIcon';
import { SearchResult } from '@/types/search';

interface VideoCardProps {
  result: SearchResult;
}

export function VideoCard({ result }: VideoCardProps) {
  const [copied, setCopied] = useState(false);
  const [imageError, setImageError] = useState(false);

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
    <article className="group theme-card rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row gap-4 items-start justify-between transition-all duration-200 hover:shadow-md border border-[var(--border-subtle)]">
      {/* Video Thumbnail with Play Overlay */}
      <a
        href={result.url}
        target="_blank"
        rel="noopener noreferrer"
        className="relative shrink-0 w-full md:w-56 aspect-video bg-[var(--bg-input)] rounded-xl overflow-hidden border border-[var(--border-subtle)] flex items-center justify-center cursor-pointer group/thumb"
      >
        {thumbnail && !imageError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnail}
            alt={result.title}
            onError={() => setImageError(true)}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover/thumb:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-[var(--text-muted)] p-2">
            <ClientIcon icon={Play} className="h-8 w-8 text-[var(--accent)] opacity-70 mb-1" />
            <span className="text-[10px] font-mono">{domain}</span>
          </div>
        )}

        {/* Play Button Icon Overlay */}
        <div className="absolute inset-0 bg-black/30 group-hover/thumb:bg-black/10 transition-colors flex items-center justify-center">
          <div className="h-10 w-10 rounded-full bg-black/60 backdrop-blur-sm text-white flex items-center justify-center shadow-md group-hover/thumb:scale-110 transition-transform">
            <ClientIcon icon={Play} className="h-4 w-4 fill-white ml-0.5" />
          </div>
        </div>

        {/* Duration badge */}
        {result.duration && (
          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/75 text-white text-[11px] font-mono font-medium flex items-center gap-1 backdrop-blur-xs">
            <ClientIcon icon={Clock} className="h-2.5 w-2.5" />
            <span>{result.duration}</span>
          </div>
        )}
      </a>

      {/* Video Details */}
      <div className="flex-1 flex flex-col justify-between min-w-0 w-full space-y-2">
        <div>
          {/* Header row: Platform domain, author, copy button */}
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-1">
            <div className="flex items-center space-x-2 truncate">
              <span className="p-1 rounded-md bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--accent)]">
                <ClientIcon icon={Globe} className="h-3 w-3" />
              </span>
              <span className="font-medium text-[var(--text-secondary)] truncate">{domain}</span>
              {result.author && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[var(--text-muted)]">
                  • <ClientIcon icon={User} className="h-3 w-3" /> {result.author}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-1.5 shrink-0">
              <button
                onClick={handleCopy}
                className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-input)] transition-colors cursor-pointer"
                title="Copy video link"
              >
                <ClientIcon icon={copied ? Check : Copy} className="h-3.5 w-3.5 text-emerald-400" />
              </button>
            </div>
          </div>

          {/* Title */}
          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group-hover:text-[var(--accent)] text-[var(--text-primary)] font-semibold text-base sm:text-lg leading-snug tracking-tight hover:underline flex items-start justify-between gap-2 transition-colors"
          >
            <span className="line-clamp-2">{result.title}</span>
            <ClientIcon icon={ExternalLink} className="h-4 w-4 shrink-0 text-[var(--text-muted)] group-hover:text-[var(--accent)] mt-1 transition-colors" />
          </a>

          {/* Snippet / Description */}
          {result.snippet && (
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mt-1 line-clamp-2 font-normal">
              {result.snippet}
            </p>
          )}
        </div>

        {/* Footer info: author on mobile, date */}
        <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] text-[var(--text-muted)] border-t border-[var(--border-subtle)]">
          {result.author && (
            <span className="sm:hidden flex items-center gap-1 text-[var(--text-secondary)]">
              <ClientIcon icon={User} className="h-3 w-3" /> {result.author}
            </span>
          )}
          {formattedDate && (
            <span className="flex items-center gap-1">
              <ClientIcon icon={Calendar} className="h-3 w-3" /> {formattedDate}
            </span>
          )}
          <span className="ml-auto inline-flex items-center gap-1 font-mono text-[10px] text-[var(--accent)]">
            Watch on {domain}
          </span>
        </div>
      </div>
    </article>
  );
}
