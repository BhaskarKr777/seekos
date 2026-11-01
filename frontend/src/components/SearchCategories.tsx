'use client';

import React from 'react';
import { Image, Newspaper, Search, ShoppingBag, Video } from 'lucide-react';
import { ClientIcon } from './ClientIcon';
import { SearchOptions } from '@/types/search';

export const SEARCH_CATEGORIES = [
  { value: 'general', label: 'All', icon: Search, color: 'text-blue-600 dark:text-blue-400', dot: 'bg-blue-600 dark:bg-blue-400' },
  { value: 'images', label: 'Images', icon: Image, color: 'text-violet-600 dark:text-violet-400', dot: 'bg-violet-600 dark:bg-violet-400' },
  { value: 'videos', label: 'Videos', icon: Video, color: 'text-rose-600 dark:text-rose-400', dot: 'bg-rose-600 dark:bg-rose-400' },
  { value: 'news', label: 'News', icon: Newspaper, color: 'text-cyan-600 dark:text-cyan-400', dot: 'bg-cyan-600 dark:bg-cyan-400' },
  { value: 'shopping', label: 'Shopping', icon: ShoppingBag, color: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-600 dark:bg-emerald-400' },
] as const;

export type SearchCategoryValue = (typeof SEARCH_CATEGORIES)[number]['value'];

interface SearchCategoriesProps {
  category?: SearchOptions['category'];
  onChange: (category: NonNullable<SearchOptions['category']>) => void;
  className?: string;
}

export function SearchCategories({
  category = 'general',
  onChange,
  className = '',
}: SearchCategoriesProps) {
  const activeCategory = category || 'general';

  return (
    <nav
      aria-label="Search categories"
      className={`flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none ${className}`}
    >
      {SEARCH_CATEGORIES.map(({ value, label, icon, color, dot }) => {
        const isActive = activeCategory === value;
        return (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(value)}
            className={`inline-flex items-center gap-2 whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer select-none ${
              isActive
                ? 'bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-subtle)] shadow-sm ring-1 ring-[var(--accent)]/40'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-input)] border border-transparent'
            }`}
          >
            <ClientIcon
              icon={icon}
              className={`h-4 w-4 transition-colors ${
                isActive ? color : 'text-[var(--text-muted)]'
              }`}
            />
            <span>{label}</span>
            {isActive && (
              <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
            )}
          </button>
        );
      })}
    </nav>
  );
}
