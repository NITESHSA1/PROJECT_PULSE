import axiosClient from './axiosClient';

export const getProjectActivity = (projectId, params = {}) =>
  axiosClient.get(`/projects/${projectId}/activity`, { params }).then((res) => res.data);
