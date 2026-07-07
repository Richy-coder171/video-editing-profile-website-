import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const TOKEN_KEY = 'cinematic_portfolio_token';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 30000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const saveToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export { api, API_URL, TOKEN_KEY, saveToken, clearToken };
