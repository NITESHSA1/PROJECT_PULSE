const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ProjectMember = require('../models/ProjectMember');
const Membership = require('../models/Membership');
const Project = require('../models/Project');

// Usage: requireProjectRole('project_manager', 'team_lead')
// Expects req.params.projectId. Org admins always pass (org-wide override).
// Attaches req.projectMember (if scoped) and req.project for downstream handlers.
const requireProjectRole = (...allowedRoles) =>
  asyncHandler(async (req, res, next) => {
    const { projectId } = req.params;
    if (!projectId) throw new ApiError(400, 'Project ID is required');

    const project = await Project.findById(projectId);
    if (!project) throw new ApiError(404, 'Project not found');

    // Org admins bypass project-level role checks entirely.
    const orgMembership = await Membership.findOne({
      user: req.user._id,
      organization: project.organization,
      status: 'active',
    });

    if (!orgMembership) {
      throw new ApiError(403, 'You are not a member of this organization');
    }

    if (orgMembership.role === 'admin') {
      req.project = project;
      req.membership = orgMembership;
      return next();
    }

    const projectMember = await ProjectMember.findOne({
      project: projectId,
      user: req.user._id,
    });

    if (!projectMember) {
      throw new ApiError(403, 'You do not have access to this project');
    }

    if (allowedRoles.length && !allowedRoles.includes(projectMember.role)) {
      throw new ApiError(403, 'You do not have permission to perform this action');
    }

    req.project = project;
    req.projectMember = projectMember;
    req.membership = orgMembership;
    next();
  });

module.exports = requireProjectRole;
