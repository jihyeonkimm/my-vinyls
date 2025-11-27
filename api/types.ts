export interface SearchOptions {
  q?: string;
  type?: 'release' | 'master' | 'artist' | 'label';
  title?: string;
  releaseTitle?: string;
  credit?: string;
  artist?: string;
  genre?: string;
  style?: string;
  country?: string;
  format?: string;
  track?: string;
}

export interface SearchResultItem {
  id: number;
  title: string;
  thumb: string;
  year: number;
  style?: string[];
  uri?: string;
  genre?: string[];
  country?: string;
}

export interface SearchResponse {
  results: SearchResultItem[];
  pagination: {
    perPage: number;
    pages: number;
    page: number;
    urls: {
      last?: string;
      next?: string;
    };
    items: number;
  };
}
