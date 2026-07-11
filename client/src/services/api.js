import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
