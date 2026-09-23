import axiosClient from './axiosClient';

export const getTasks = (projectId, params = {}) =>
  axiosClient.get(`/projects/${projectId}/tasks`, { params }).then((res) => res.data);

export const getTask = (projectId, taskId) =>
  axiosClient.get(`/projects/${projectId}/tasks/${taskId}`).then((res) => res.data);

export const createTask = (projectId, data) =>
  axiosClient.post(`/projects/${projectId}/tasks`, data).then((res) => res.data);

export const updateTask = (projectId, taskId, data) =>
  axiosClient.patch(`/projects/${projectId}/tasks/${taskId}`, data).then((res) => res.data);

export const updateTaskStatus = (projectId, taskId, data) =>
  axiosClient.patch(`/projects/${projectId}/tasks/${taskId}/status`, data).then((res) => res.data);

export const reorderTasks = (projectId, updates) =>
  axiosClient.post(`/projects/${projectId}/tasks/reorder`, { updates }).then((res) => res.data);

export const archiveTask = (projectId, taskId) =>
  axiosClient.delete(`/projects/${projectId}/tasks/${taskId}`).then((res) => res.data);

export const getTaskHistory = (projectId, taskId) =>
  axiosClient.get(`/projects/${projectId}/tasks/${taskId}/history`).then((res) => res.data);

export const getComments = (projectId, taskId) =>
  axiosClient.get(`/projects/${projectId}/tasks/${taskId}/comments`).then((res) => res.data);

export const createComment = (projectId, taskId, data) =>
  axiosClient.post(`/projects/${projectId}/tasks/${taskId}/comments`, data).then((res) => res.data);
