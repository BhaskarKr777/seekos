import { SearchOptions, SearchResponse } from '@/types/search';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export async function fetchSearchResults(
  query: string,
  options: SearchOptions = {}
): Promise<SearchResponse> {
  const params = new URLSearchParams();
  params.set('q', query);

  if (options.page && options.page > 1) {
    params.set('page', options.page.toString());
  }
  if (options.limit) {
    params.set('limit', options.limit.toString());
  }
  if (options.language) {
    params.set('language', options.language);
  }
  if (options.time_range) {
    params.set('time_range', options.time_range);
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/search?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.detail || `Search failed with status ${response.status}`;
    throw new Error(message);
  }

  return response.json();
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/health`, {
      method: 'GET',
      cache: 'no-store',
    });
    if (!response.ok) return false;
    const data = await response.json();
    return data.status === 'ok';
  } catch {
    return false;
  }
}
