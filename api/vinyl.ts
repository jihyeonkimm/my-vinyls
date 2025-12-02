import apiClient from './client';
import { SearchOptions, SearchResponse, VinylDetail } from './types';

export const searchVinyls = async (
  options: SearchOptions
): Promise<SearchResponse> => {
  const response = await apiClient.get('/api/search', {
    params: options,
  });

  return response.data;
};

export const getVinylDetails = async (id: number): Promise<VinylDetail> => {
  const response = await apiClient.get(`api/releases/${id}`);
  return response.data;
};
