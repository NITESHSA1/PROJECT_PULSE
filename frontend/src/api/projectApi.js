import axiosClient from './axiosClient';

export const getProject = (projectId) =>
  axiosClient.get(`/projects/${projectId}`).then((res) => res.data);

export const updateProject = (projectId, data) =>
  axiosClient.patch(`/projects/${projectId}`, data).then((res) => res.data);

export const getProjectMembers = (projectId) =>
  axiosClient.get(`/projects/${projectId}/members`).then((res) => res.data);

export const addProjectMember = (projectId, data) =>
  axiosClient.post(`/projects/${projectId}/members`, data).then((res) => res.data);

// --- Sprints ---
export const getSprints = (projectId) =>
  axiosClient.get(`/projects/${projectId}/sprints`).then((res) => res.data);

export const createSprint = (projectId, data) =>
  axiosClient.post(`/projects/${projectId}/sprints`, data).then((res) => res.data);

export const updateSprint = (projectId, sprintId, data) =>
  axiosClient.patch(`/projects/${projectId}/sprints/${sprintId}`, data).then((res) => res.data);

// --- Milestones ---
export const getMilestones = (projectId) =>
  axiosClient.get(`/projects/${projectId}/milestones`).then((res) => res.data);

export const createMilestone = (projectId, data) =>
  axiosClient.post(`/projects/${projectId}/milestones`, data).then((res) => res.data);

export const updateMilestone = (projectId, milestoneId, data) =>
  axiosClient.patch(`/projects/${projectId}/milestones/${milestoneId}`, data).then((res) => res.data);
