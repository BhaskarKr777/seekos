export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
  domain?: string | null;
  published_at?: string | null;
  score?: number | null;
  thumbnail_url?: string | null;
  img_url?: string | null;
  author?: string | null;
  duration?: string | null;
  price?: string | null;
  currency?: string | null;
  category?: 'general' | 'images' | 'videos' | 'news' | 'shopping' | string | null;
}

export interface ProviderStatus {
  name: string;
  status: 'success' | 'timeout' | 'error' | string;
}

export interface SearchMetadata {
  total: number;
  providers: string[];
  provider_status: ProviderStatus[];
  took_ms: number;
}

export interface SearchResponse {
  query: string;
  results: SearchResult[];
  metadata: SearchMetadata;
}

export interface SearchOptions {
  page?: number;
  limit?: number;
  language?: string | null;
  time_range?: string | null;
  category?: 'general' | 'images' | 'videos' | 'news' | 'shopping';
}
