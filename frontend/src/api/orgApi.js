import axiosClient from './axiosClient';

export const createOrganization = (data) =>
  axiosClient.post('/organizations', data).then((res) => res.data);

export const getMyOrganizations = () =>
  axiosClient.get('/organizations').then((res) => res.data);

export const getOrganization = (orgId) =>
  axiosClient.get(`/organizations/${orgId}`).then((res) => res.data);

export const getOrganizationMembers = (orgId) =>
  axiosClient.get(`/organizations/${orgId}/members`).then((res) => res.data);

export const inviteMember = (orgId, data) =>
  axiosClient.post(`/organizations/${orgId}/invitations`, data).then((res) => res.data);

export const getOrganizationInvitations = (orgId) =>
  axiosClient.get(`/organizations/${orgId}/invitations`).then((res) => res.data);

export const acceptInvitation = (token) =>
  axiosClient.post('/invitations/accept', { token }).then((res) => res.data);

export const getProjectsForOrg = (orgId) =>
  axiosClient.get(`/organizations/${orgId}/projects`).then((res) => res.data);

export const createProject = (orgId, data) =>
  axiosClient.post(`/organizations/${orgId}/projects`, data).then((res) => res.data);
