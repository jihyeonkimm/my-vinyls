import apiClient from './client';
import { SearchOptions, SearchResponse } from './types';

export const searchVinyls = async (
  options: SearchOptions
): Promise<SearchResponse> => {
  const response = await apiClient.get('/api/search', {
    params: options,
  });

  return response.data;
};
