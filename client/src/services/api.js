import axios from 'axios';

const localHostnames = new Set(['localhost', '127.0.0.1', '[::1]', '::1']);

const isPrivateIpv4 = (hostname = '') =>
  /^10\./.test(hostname) ||
  /^192\.168\./.test(hostname) ||
  /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname);

const getDevApiUrl = () => {
  if (typeof window === 'undefined') {
    return 'http://localhost:5000/api';
  }

  return `${window.location.protocol}//${window.location.hostname}:5000/api`;
};

const getApiUrl = () => {
  const configuredUrl = String(import.meta.env.VITE_API_URL || '').trim();

  if (!configuredUrl) {
    return getDevApiUrl();
  }

  if (typeof window === 'undefined') {
    return configuredUrl;
  }

  try {
    const apiUrl = new URL(configuredUrl);
    const pageHostname = window.location.hostname;
    const apiIsLocal = localHostnames.has(apiUrl.hostname) || apiUrl.hostname === '[::1]';
    const pageIsLocal = localHostnames.has(pageHostname) || isPrivateIpv4(pageHostname);

    if (apiIsLocal && pageIsLocal && apiUrl.hostname !== pageHostname) {
      apiUrl.hostname = pageHostname;
      return apiUrl.toString().replace(/\/$/, '');
    }
  } catch {
    return configuredUrl;
  }

  return configuredUrl.replace(/\/$/, '');
};

const API_URL = getApiUrl();

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 30000
});

const unwrapItems = ({ data }) => data.items || [];
const unwrapItem = ({ data }) => data.item || data;

const getAllProjects = (params = {}) => api.get('/portfolio', { params }).then(unwrapItems);
const getFeaturedProjects = () => api.get('/portfolio/featured').then(unwrapItems);
const getProjectsByType = (type, params = {}) => api.get(`/portfolio/type/${type}`, { params }).then(unwrapItems);
const getProjectById = (id) => api.get(`/portfolio/${id}`).then(unwrapItem);
const updateProject = (id, payload) => api.put(`/portfolio/${id}`, payload).then(unwrapItem);
const deleteProject = (id) => api.delete(`/portfolio/${id}`).then(({ data }) => data);

export {
  api,
  API_URL,
  deleteProject,
  getAllProjects,
  getFeaturedProjects,
  getProjectById,
  getProjectsByType,
  updateProject
};
