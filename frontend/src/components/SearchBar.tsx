'use client';

import React, { useState } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { ClientIcon } from './ClientIcon';

interface SearchBarProps {
  initialQuery?: string;
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export function SearchBar({ initialQuery = '', onSearch, isLoading = false }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full relative group">
      <div className="relative flex items-center theme-input rounded-2xl shadow-lg shadow-[var(--shadow-color)] overflow-hidden transition-all duration-300">
        {/* Search Icon */}
        <div className="pl-4 pr-2 flex items-center justify-center text-[var(--text-muted)] group-focus-within:text-[#c07597] transition-colors">
          {isLoading ? (
            <ClientIcon icon={Loader2} className="h-5 w-5 animate-spin text-[#c07597]" />
          ) : (
            <ClientIcon icon={Search} className="h-5 w-5" />
          )}
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the web with SeekOS..."
          className="w-full py-4 pr-24 bg-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)] text-base sm:text-lg focus:outline-none"
          autoComplete="off"
        />

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-24 p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-full hover:bg-[var(--bg-surface)] transition-colors cursor-pointer"
            title="Clear search"
          >
            <ClientIcon icon={X} className="h-4 w-4" />
          </button>
        )}

        {/* Submit Action Button */}
        <button
          type="submit"
          disabled={!query.trim() || isLoading}
          className="absolute right-2 px-5 py-2.5 rounded-xl accent-button font-medium text-sm transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          Search
        </button>
      </div>
    </form>
  );
}
