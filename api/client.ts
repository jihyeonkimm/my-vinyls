import axios from 'axios';

const BASE_URL =
  process.env.EXPO_PUBLIC_PROXY_SERVER_URL || 'http://192.168.0.169:3001';

const apiClient = axios.create({
  baseURL: BASE_URL,
});

export default apiClient;
