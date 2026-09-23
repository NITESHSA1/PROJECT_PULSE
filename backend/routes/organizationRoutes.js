const express = require('express');
const protect = require('../middleware/auth');
const requireOrgRole = require('../middleware/requireOrgRole');
const {
  createOrganization,
  getMyOrganizations,
  getOrganization,
  updateOrganization,
  getOrganizationMembers,
  updateMemberRole,
  removeMember,
} = require('../controllers/organizationController');
const {
  createInvitation,
  getOrganizationInvitations,
  revokeInvitation,
} = require('../controllers/invitationController');
const { createProject, getProjectsForOrg } = require('../controllers/projectController');

const router = express.Router();

router.use(protect); // every route below requires authentication

router.post('/', createOrganization);
router.get('/', getMyOrganizations);

router.get('/:orgId', requireOrgRole(), getOrganization); // any active member
router.patch('/:orgId', requireOrgRole('admin'), updateOrganization);

router.get('/:orgId/members', requireOrgRole(), getOrganizationMembers);
router.patch('/:orgId/members/:membershipId', requireOrgRole('admin'), updateMemberRole);
router.delete('/:orgId/members/:membershipId', requireOrgRole('admin'), removeMember);

router.post('/:orgId/invitations', requireOrgRole('admin'), createInvitation);
router.get('/:orgId/invitations', requireOrgRole('admin'), getOrganizationInvitations);
router.delete('/:orgId/invitations/:invitationId', requireOrgRole('admin'), revokeInvitation);

router.post('/:orgId/projects', requireOrgRole('admin', 'project_manager'), createProject);
router.get('/:orgId/projects', requireOrgRole(), getProjectsForOrg);

module.exports = router;
