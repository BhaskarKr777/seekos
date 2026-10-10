'use client';

import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { ClientIcon } from './ClientIcon';
import { SearchOptions } from '@/types/search';

interface SearchFiltersProps {
  options: SearchOptions;
  onChange: (updatedOptions: SearchOptions) => void;
  onReset: () => void;
}

export function SearchFilters({ options, onChange, onReset }: SearchFiltersProps) {
  const hasActiveFilters = Boolean(
    (options.limit && options.limit !== 10) || options.language || options.time_range
  );

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-3 px-4 theme-card rounded-xl text-xs sm:text-sm text-[var(--text-secondary)]">
      <div className="flex items-center space-x-2 font-medium">
        <ClientIcon icon={Filter} className="h-4 w-4 text-[#c07597]" />
        <span className="text-[var(--text-primary)]">Filters:</span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Time Range Filter */}
        <div className="flex items-center space-x-1.5">
          <label htmlFor="time-range" className="text-[var(--text-muted)]">Time:</label>
          <select
            id="time-range"
            value={options.time_range || ''}
            onChange={(e) => onChange({ ...options, time_range: e.target.value || null, page: 1 })}
            className="theme-input rounded-lg px-2.5 py-1 text-[var(--text-primary)] focus:outline-none focus:border-[#c07597] cursor-pointer"
          >
            <option value="">Any time</option>
            <option value="day">Past 24 hours</option>
            <option value="week">Past week</option>
            <option value="month">Past month</option>
            <option value="year">Past year</option>
          </select>
        </div>

        {/* Language Filter */}
        <div className="flex items-center space-x-1.5">
          <label htmlFor="language" className="text-[var(--text-muted)]">Language:</label>
          <select
            id="language"
            value={options.language || ''}
            onChange={(e) => onChange({ ...options, language: e.target.value || null, page: 1 })}
            className="theme-input rounded-lg px-2.5 py-1 text-[var(--text-primary)] focus:outline-none focus:border-[#c07597] cursor-pointer"
          >
            <option value="">All languages</option>
            <option value="en">English (en)</option>
            <option value="es">Spanish (es)</option>
            <option value="fr">French (fr)</option>
            <option value="de">German (de)</option>
          </select>
        </div>

        {/* Results Limit */}
        <div className="flex items-center space-x-1.5">
          <label htmlFor="limit" className="text-[var(--text-muted)]">Per page:</label>
          <select
            id="limit"
            value={options.limit || 10}
            onChange={(e) => onChange({ ...options, limit: Number(e.target.value), page: 1 })}
            className="theme-input rounded-lg px-2.5 py-1 text-[var(--text-primary)] focus:outline-none focus:border-[#c07597] cursor-pointer"
          >
            <option value={10}>10 results</option>
            <option value={20}>20 results</option>
            <option value={30}>30 results</option>
            <option value={50}>50 results</option>
          </select>
        </div>

        {/* Reset Filters */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center space-x-1 text-xs text-[#c07597] hover:text-[var(--text-primary)] px-2 py-1 rounded-lg border border-[#c07597]/40 bg-[var(--bg-surface)] transition-colors cursor-pointer"
          >
            <ClientIcon icon={RotateCcw} className="h-3 w-3" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}
