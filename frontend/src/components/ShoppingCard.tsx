'use client';

import React, { useState } from 'react';
import { ExternalLink, Globe, Copy, Check, ShoppingBag, Tag } from 'lucide-react';
import { ClientIcon } from './ClientIcon';
import { SearchResult } from '@/types/search';

interface ShoppingCardProps {
  result: SearchResult;
}

export function ShoppingCard({ result }: ShoppingCardProps) {
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
  const thumbnail = result.thumbnail_url || result.img_url;

  return (
    <article className="group theme-card rounded-2xl p-5 flex flex-col sm:flex-row gap-5 items-start justify-between transition-all duration-200 hover:shadow-md border border-[var(--border-subtle)]">
      {/* Product Image preview or shopping icon */}
      <a
        href={result.url}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 w-full sm:w-36 h-36 rounded-xl overflow-hidden bg-[var(--bg-input)] border border-[var(--border-subtle)] flex items-center justify-center cursor-pointer"
      >
        {thumbnail && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnail}
            alt={result.title}
            onError={() => setImgError(true)}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-[var(--text-muted)] p-4 text-center">
            <ClientIcon icon={ShoppingBag} className="h-8 w-8 text-[var(--accent)] opacity-60 mb-1" />
            <span className="text-[10px] font-mono truncate max-w-full">{domain}</span>
          </div>
        )}
      </a>

      {/* Product Information */}
      <div className="flex-1 min-w-0 flex flex-col justify-between w-full h-full space-y-3">
        <div>
          {/* Top row: store domain & price */}
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-1">
            <div className="flex items-center space-x-2 truncate">
              <span className="p-1 rounded-md bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--accent)]">
                <ClientIcon icon={Globe} className="h-3 w-3" />
              </span>
              <span className="font-medium text-[var(--text-secondary)] truncate font-mono">{domain}</span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-[var(--bg-input)] text-[var(--accent)] border border-[var(--border-subtle)]">
                <ClientIcon icon={Tag} className="h-2.5 w-2.5 mr-1" /> Store
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {result.price && (
                <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-400 font-bold text-sm font-mono">
                  {result.price}
                </span>
              )}
              <button
                onClick={handleCopy}
                className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-input)] transition-colors cursor-pointer"
                title="Copy product link"
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
            className="group-hover:text-[var(--accent)] text-[var(--text-primary)] font-semibold text-lg leading-snug tracking-tight hover:underline flex items-start justify-between gap-2 transition-colors"
          >
            <span className="line-clamp-2">{result.title}</span>
            <ClientIcon icon={ExternalLink} className="h-4 w-4 shrink-0 text-[var(--text-muted)] group-hover:text-[var(--accent)] mt-1 transition-colors" />
          </a>

          {/* Snippet / Description */}
          {result.snippet && (
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mt-1 line-clamp-2 font-normal">
              {result.snippet}
            </p>
          )}
        </div>

        {/* Action Button & Store link */}
        <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
          <span className="text-xs text-[var(--text-muted)] font-mono truncate max-w-[200px]">
            {result.url}
          </span>

          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl accent-button text-xs font-semibold shadow-xs transition-transform active:scale-95 cursor-pointer shrink-0"
          >
            <ClientIcon icon={ShoppingBag} className="h-3.5 w-3.5" />
            <span>Visit Store</span>
          </a>
        </div>
      </div>
    </article>
  );
}
