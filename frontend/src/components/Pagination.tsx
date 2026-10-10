'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ClientIcon } from './ClientIcon';

interface PaginationProps {
  currentPage: number;
  hasMore: boolean;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, hasMore, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-between py-6 my-4 border-t border-[var(--border-subtle)] text-sm">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="flex items-center space-x-1 px-4 py-2 rounded-xl theme-card text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[#c07597] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
      >
        <ClientIcon icon={ChevronLeft} className="h-4 w-4" />
        <span>Previous</span>
      </button>

      <span className="text-[var(--text-muted)] font-mono text-xs">
        Page <strong className="text-[var(--text-primary)] font-bold">{currentPage}</strong>
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasMore}
        className="flex items-center space-x-1 px-4 py-2 rounded-xl theme-card text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[#c07597] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
      >
        <span>Next</span>
        <ClientIcon icon={ChevronRight} className="h-4 w-4" />
      </button>
    </div>
  );
}
