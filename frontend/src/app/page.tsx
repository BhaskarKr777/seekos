'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { SearchBar } from '@/components/SearchBar';
import { SearchCategories } from '@/components/SearchCategories';
import { SearchFilters } from '@/components/SearchFilters';
import { ResultCard } from '@/components/ResultCard';
import { ImageGallery } from '@/components/ImageGallery';
import { VideoCard } from '@/components/VideoCard';
import { NewsCard } from '@/components/NewsCard';
import { ShoppingCard } from '@/components/ShoppingCard';
import { SeekosLogo } from '@/components/SeekosLogo';
import { ResultSkeleton } from '@/components/ResultSkeleton';
import { MetadataBar } from '@/components/MetadataBar';
import { Pagination } from '@/components/Pagination';
import { ClientIcon } from '@/components/ClientIcon';
import { fetchSearchResults } from '@/lib/api';
import { SearchResponse, SearchOptions } from '@/types/search';
import { Shield, RefreshCw, AlertCircle, Search, Terminal } from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const queryParam = searchParams.get('q') || '';
  const pageParam = Number(searchParams.get('page')) || 1;
  const limitParam = Number(searchParams.get('limit')) || 10;
  const languageParam = searchParams.get('language') || null;
  const timeRangeParam = searchParams.get('time_range') || null;
  const categoryParam = (searchParams.get('category') as SearchOptions['category']) || 'general';

  const [response, setResponse] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const options: SearchOptions = {
    page: pageParam,
    limit: limitParam,
    language: languageParam,
    time_range: timeRangeParam,
    category: categoryParam,
  };

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
      const timer = window.setTimeout(() => {
        void executeSearch(queryParam, {
          page: pageParam,
          limit: limitParam,
          language: languageParam,
          time_range: timeRangeParam,
          category: categoryParam,
        });
      }, 0);
      return () => window.clearTimeout(timer);
    } else {
      const timer = window.setTimeout(() => setResponse(null), 0);
      return () => window.clearTimeout(timer);
    }
  }, [queryParam, pageParam, limitParam, languageParam, timeRangeParam, categoryParam, executeSearch]);

  const updateQueryParams = (newQuery: string, newOpts: SearchOptions) => {
    const params = new URLSearchParams();
    if (newQuery) params.set('q', newQuery);
    if (newOpts.page && newOpts.page > 1) params.set('page', newOpts.page.toString());
    if (newOpts.limit && newOpts.limit !== 10) params.set('limit', newOpts.limit.toString());
    if (newOpts.language) params.set('language', newOpts.language);
    if (newOpts.time_range) params.set('time_range', newOpts.time_range);
    if (newOpts.category && newOpts.category !== 'general') params.set('category', newOpts.category);

    router.push(`/?${params.toString()}`);
  };

  const handleSearchTrigger = (newQuery: string) => {
    updateQueryParams(newQuery, { ...options, page: 1 });
  };

  const handleCategoryChange = (newCategory: NonNullable<SearchOptions['category']>) => {
    updateQueryParams(queryParam, { ...options, category: newCategory, page: 1 });
  };

  const handleFilterChange = (updatedOptions: SearchOptions) => {
    updateQueryParams(queryParam, updatedOptions);
  };

  const handleFilterReset = () => {
    const resetOpts: SearchOptions = {
      page: 1,
      limit: 10,
      language: null,
      time_range: null,
      category: categoryParam,
    };
    updateQueryParams(queryParam, resetOpts);
  };

  const handlePageChange = (newPage: number) => {
    const updatedOpts = { ...options, page: newPage };
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
            <div className="text-center py-10 sm:py-16 space-y-4">
              <div className="flex justify-center mb-1">
                <SeekosLogo size="lg" showSubtitle={false} />
              </div>
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs text-[var(--text-secondary)] font-medium shadow-xs">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Private metasearch engine</span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
                <span className="text-[var(--text-primary)]">Search without </span>
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  tracking
                </span>
              </h1>
              <p className="text-[var(--text-secondary)] max-w-xl mx-auto text-base sm:text-lg">
                Fast, private, multi-provider search engine with images, videos, news, and shopping filters.
              </p>
            </div>
          )}

          <div className={queryParam ? 'max-w-4xl mx-auto space-y-3' : 'max-w-2xl mx-auto space-y-4'}>
            <SearchBar
              initialQuery={queryParam}
              onSearch={handleSearchTrigger}
              isLoading={isLoading}
            />

            {/* Category Filter Tabs */}
            <div className="flex items-center justify-between overflow-x-auto pt-1 pb-1">
              <SearchCategories
                category={categoryParam}
                onChange={handleCategoryChange}
              />
            </div>

            {!queryParam && (
              <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                <span className="text-xs text-[var(--text-muted)] flex items-center gap-1 mr-1">
                  <ClientIcon icon={Terminal} className="h-3 w-3" /> Try searching:
                </span>
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSearchTrigger(prompt)}
                    className="px-3 py-1 rounded-full text-xs bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--accent)]/40 transition-all cursor-pointer shadow-xs"
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

            {isLoading && <ResultSkeleton category={categoryParam} />}

            {error && !isLoading && (
              <div className="theme-card rounded-2xl p-6 text-center space-y-3 border-rose-500/30">
                <div className="inline-flex p-3 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
                  <ClientIcon icon={AlertCircle} className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-rose-600 dark:text-rose-400">Search Error</h3>
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
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  No {categoryParam !== 'general' ? categoryParam : ''} results found
                </h3>
                <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
                  We couldn&apos;t find any {categoryParam !== 'general' ? categoryParam : 'results'} matching &quot;{queryParam}&quot;. Try broadening your query or switching category filters.
                </p>
              </div>
            )}

            {response && response.results.length > 0 && !isLoading && (
              <div className="space-y-4">
                {/* Specialized Views depending on active category filter */}
                {categoryParam === 'images' ? (
                  <ImageGallery results={response.results} />
                ) : categoryParam === 'videos' ? (
                  <div className="space-y-3">
                    {response.results.map((result, index) => (
                      <VideoCard key={`${result.url}-${index}`} result={result} />
                    ))}
                  </div>
                ) : categoryParam === 'news' ? (
                  <div className="space-y-3">
                    {response.results.map((result, index) => (
                      <NewsCard key={`${result.url}-${index}`} result={result} />
                    ))}
                  </div>
                ) : categoryParam === 'shopping' ? (
                  <div className="space-y-3">
                    {response.results.map((result, index) => (
                      <ShoppingCard key={`${result.url}-${index}`} result={result} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {response.results.map((result, index) => (
                      <ResultCard key={`${result.url}-${index}`} result={result} />
                    ))}
                  </div>
                )}

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
          <ClientIcon icon={Shield} className="h-3.5 w-3.5 text-[var(--accent)]" />
          SeekOS Search Engine • Private by design
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
