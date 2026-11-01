'use client';

import React, { useState } from 'react';
import { ExternalLink, Globe, Maximize2, X, Copy, Check, Download } from 'lucide-react';
import { ClientIcon } from './ClientIcon';
import { SearchResult } from '@/types/search';

interface ImageGalleryProps {
  results: SearchResult[];
}

export function ImageGallery({ results }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<SearchResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const handleCopy = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImageError = (url: string) => {
    setFailedImages((prev) => ({ ...prev, [url]: true }));
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {results.map((result, idx) => {
          const displayUrl = result.thumbnail_url || result.img_url || result.url;
          const isFailed = failedImages[displayUrl];
          const domain = result.domain || (result.url ? new URL(result.url).hostname : '');

          return (
            <div
              key={`${result.url}-${idx}`}
              onClick={() => setSelectedImage(result)}
              className="group relative flex flex-col justify-between theme-card rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 border border-[var(--border-subtle)]"
            >
              {/* Image Container */}
              <div className="relative aspect-square w-full bg-[var(--bg-input)] overflow-hidden flex items-center justify-center">
                {!isFailed ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={displayUrl}
                    alt={result.title}
                    loading="lazy"
                    onError={() => handleImageError(displayUrl)}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-[var(--text-muted)] p-4 text-center">
                    <ClientIcon icon={Globe} className="h-8 w-8 mb-2 opacity-50" />
                    <span className="text-[11px] font-mono truncate max-w-full">{domain}</span>
                  </div>
                )}

                {/* Hover overlay with zoom icon */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3">
                  <div className="flex justify-end">
                    <span className="p-1.5 rounded-lg bg-black/50 text-white backdrop-blur-sm">
                      <ClientIcon icon={Maximize2} className="h-3.5 w-3.5" />
                    </span>
                  </div>
                  <div className="text-white space-y-1">
                    <p className="text-xs font-medium line-clamp-2 leading-snug drop-shadow-sm">
                      {result.title}
                    </p>
                    <p className="text-[10px] text-gray-300 font-mono truncate">
                      {domain}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom caption bar */}
              <div className="p-2.5 space-y-1">
                <p className="text-xs font-medium text-[var(--text-primary)] truncate" title={result.title}>
                  {result.title}
                </p>
                <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                  <span className="truncate max-w-[130px] font-mono">{domain}</span>
                  {result.snippet && (
                    <span className="text-[10px] bg-[var(--bg-input)] px-1.5 py-0.5 rounded border border-[var(--border-subtle)]">
                      {result.snippet}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox / Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors cursor-pointer"
              title="Close preview (Esc)"
            >
              <ClientIcon icon={X} className="h-5 w-5" />
            </button>

            {/* Left side: Large Image View */}
            <div className="flex-1 bg-black/40 flex items-center justify-center p-4 min-h-[300px] md:min-h-[460px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedImage.img_url || selectedImage.thumbnail_url || selectedImage.url}
                alt={selectedImage.title}
                className="max-h-[70vh] max-w-full object-contain rounded-lg"
              />
            </div>

            {/* Right side: Image Details & Actions */}
            <div className="w-full md:w-80 p-6 flex flex-col justify-between border-t md:border-t-0 md:border-l border-[var(--border-subtle)] bg-[var(--bg-surface)]">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-xs text-[var(--accent)] font-mono">
                  <ClientIcon icon={Globe} className="h-4 w-4" />
                  <span className="truncate font-medium">
                    {selectedImage.domain || (selectedImage.url ? new URL(selectedImage.url).hostname : '')}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[var(--text-primary)] leading-snug">
                  {selectedImage.title}
                </h3>

                {selectedImage.snippet && (
                  <p className="text-xs text-[var(--text-secondary)]">
                    {selectedImage.snippet}
                  </p>
                )}

                <div className="pt-2 text-xs text-[var(--text-muted)] space-y-1 border-t border-[var(--border-subtle)]">
                  <div className="flex justify-between">
                    <span>Source:</span>
                    <span className="font-mono text-[var(--text-secondary)]">{selectedImage.source}</span>
                  </div>
                  {selectedImage.duration && (
                    <div className="flex justify-between">
                      <span>Dimensions:</span>
                      <span className="font-mono text-[var(--text-secondary)]">{selectedImage.duration}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-6">
                <a
                  href={selectedImage.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl accent-button text-xs font-semibold shadow-sm transition-all cursor-pointer"
                >
                  <span>Visit Web Page</span>
                  <ClientIcon icon={ExternalLink} className="h-3.5 w-3.5" />
                </a>

                {selectedImage.img_url && (
                  <a
                    href={selectedImage.img_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:bg-[var(--bg-input)] text-[var(--text-primary)] transition-colors cursor-pointer"
                  >
                    <span>Open Full Image</span>
                    <ClientIcon icon={Download} className="h-3.5 w-3.5" />
                  </a>
                )}

                <button
                  type="button"
                  onClick={(e) => handleCopy(selectedImage.url, e)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:bg-[var(--bg-input)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                >
                  <ClientIcon icon={copied ? Check : Copy} className="h-3.5 w-3.5 text-emerald-400" />
                  <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
