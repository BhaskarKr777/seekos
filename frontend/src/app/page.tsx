'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { SearchBar } from '@/components/SearchBar';
import { SearchFilters } from '@/components/SearchFilters';
import { ResultCard } from '@/components/ResultCard';
import { ResultSkeleton } from '@/components/ResultSkeleton';
import { MetadataBar } from '@/components/MetadataBar';
import { Pagination } from '@/components/Pagination';
import { ClientIcon } from '@/components/ClientIcon';
import { fetchSearchResults } from '@/lib/api';
import { SearchResponse, SearchOptions } from '@/types/search';
import { Shield, Sparkles, RefreshCw, AlertCircle, Search, Terminal } from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const queryParam = searchParams.get('q') || '';
  const pageParam = Number(searchParams.get('page')) || 1;
  const limitParam = Number(searchParams.get('limit')) || 10;
  const languageParam = searchParams.get('language') || null;
  const timeRangeParam = searchParams.get('time_range') || null;

  const [response, setResponse] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [options, setOptions] = useState<SearchOptions>({
    page: pageParam,
    limit: limitParam,
    language: languageParam,
    time_range: timeRangeParam,
  });

  useEffect(() => {
    setOptions({
      page: pageParam,
      limit: limitParam,
      language: languageParam,
      time_range: timeRangeParam,
    });
  }, [pageParam, limitParam, languageParam, timeRangeParam]);

  const executeSearch = useCallback(
    async (q: string, searchOpts: SearchOptions) => {
      if (!q.trim()) {
        setResponse(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchSearchResults(q, searchOpts);
        setResponse(data);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to connect to search service';
        setError(msg);
        setResponse(null);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (queryParam) {
      executeSearch(queryParam, {
        page: pageParam,
        limit: limitParam,
        language: languageParam,
        time_range: timeRangeParam,
      });
    } else {
      setResponse(null);
    }
  }, [queryParam, pageParam, limitParam, languageParam, timeRangeParam, executeSearch]);

  const updateQueryParams = (newQuery: string, newOpts: SearchOptions) => {
    const params = new URLSearchParams();
    if (newQuery) params.set('q', newQuery);
    if (newOpts.page && newOpts.page > 1) params.set('page', newOpts.page.toString());
    if (newOpts.limit && newOpts.limit !== 10) params.set('limit', newOpts.limit.toString());
    if (newOpts.language) params.set('language', newOpts.language);
    if (newOpts.time_range) params.set('time_range', newOpts.time_range);

    router.push(`/?${params.toString()}`);
  };

  const handleSearchTrigger = (newQuery: string) => {
    updateQueryParams(newQuery, { ...options, page: 1 });
  };

  const handleFilterChange = (updatedOptions: SearchOptions) => {
    setOptions(updatedOptions);
    updateQueryParams(queryParam, updatedOptions);
  };

  const handleFilterReset = () => {
    const resetOpts: SearchOptions = { page: 1, limit: 10, language: null, time_range: null };
    setOptions(resetOpts);
    updateQueryParams(queryParam, resetOpts);
  };

  const handlePageChange = (newPage: number) => {
    const updatedOpts = { ...options, page: newPage };
    setOptions(updatedOpts);
    updateQueryParams(queryParam, updatedOpts);
  };

  const quickPrompts = [
    'Privacy-Focused Search',
    'Self-Hosted Engine',
    'SearXNG Provider',
    'FastAPI Architecture',
  ];

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6 space-y-4">
          {!queryParam && (
            <div className="text-center py-12 sm:py-18 space-y-4 animate-fade-in">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-input)] text-xs text-[#c07597] mb-2 font-medium">
                <ClientIcon icon={Sparkles} className="h-3.5 w-3.5 text-[#4272a9]" />
                <span>SeekOS v0.1 • Aesthetic Search</span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[var(--text-primary)]">
                Search without <span className="accent-gradient-text">tracking</span>
              </h1>
              <p className="text-[var(--text-secondary)] max-w-xl mx-auto text-base sm:text-lg">
                Customizable, private, multi-provider search backend built with FastAPI, SearXNG, and Next.js.
              </p>
            </div>
          )}

          <div className={queryParam ? 'max-w-4xl mx-auto' : 'max-w-2xl mx-auto'}>
            <SearchBar
              initialQuery={queryParam}
              onSearch={handleSearchTrigger}
              isLoading={isLoading}
            />

            {!queryParam && (
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                <span className="text-xs text-[var(--text-muted)] flex items-center gap-1 mr-1">
                  <ClientIcon icon={Terminal} className="h-3 w-3" /> Try searching:
                </span>
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSearchTrigger(prompt)}
                    className="px-3 py-1 rounded-full text-xs bg-[var(--bg-input)] hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[#c07597] border border-[var(--border-subtle)] transition-colors cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {queryParam && (
            <div className="max-w-4xl mx-auto">
              <SearchFilters
                options={options}
                onChange={handleFilterChange}
                onReset={handleFilterReset}
              />
            </div>
          )}
        </div>

        {queryParam && (
          <div className="max-w-4xl mx-auto space-y-4">
            {response && !isLoading && (
              <MetadataBar metadata={response.metadata} query={response.query} />
            )}

            {isLoading && <ResultSkeleton />}

            {error && !isLoading && (
              <div className="theme-card rounded-2xl p-6 text-center space-y-3 border-rose-900/40">
                <div className="inline-flex p-3 rounded-full bg-rose-950/40 text-rose-400">
                  <ClientIcon icon={AlertCircle} className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-rose-300">Search Error</h3>
                <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">{error}</p>
                <div className="pt-2">
                  <button
                    onClick={() => executeSearch(queryParam, options)}
                    className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl accent-button text-sm font-medium transition-colors cursor-pointer"
                  >
                    <ClientIcon icon={RefreshCw} className="h-4 w-4" />
                    <span>Try Again</span>
                  </button>
                </div>
              </div>
            )}

            {response && response.results.length === 0 && !isLoading && !error && (
              <div className="theme-card rounded-2xl p-10 text-center space-y-3">
                <div className="inline-flex p-3 rounded-full bg-[var(--bg-input)] text-[var(--text-muted)]">
                  <ClientIcon icon={Search} className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">No results found</h3>
                <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
                  We couldn&apos;t find any results matching &quot;{queryParam}&quot;. Try broadening your query or resetting filters.
                </p>
              </div>
            )}

            {response && response.results.length > 0 && !isLoading && (
              <div className="space-y-4">
                {response.results.map((result, index) => (
                  <ResultCard key={`${result.url}-${index}`} result={result} />
                ))}

                <Pagination
                  currentPage={options.page || 1}
                  hasMore={response.results.length >= (options.limit || 10)}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="border-t border-[var(--border-subtle)] py-6 text-center text-xs text-[var(--text-muted)] space-y-1">
        <p className="flex items-center justify-center gap-1.5">
          <ClientIcon icon={Shield} className="h-3.5 w-3.5 text-[#c07597]" />
          SeekOS Search Engine • Aesthetic &amp; Private
        </p>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center text-[var(--text-muted)]">Loading SeekOS...</div>}>
      <SearchContent />
    </Suspense>
  );
}
