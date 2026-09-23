const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const Membership = require('../models/Membership');

// Usage: requireOrgRole('admin') or requireOrgRole('admin', 'project_manager')
// Expects req.params.orgId (or req.body.organization) to identify the org.
// Attaches req.membership so downstream handlers can reuse it without re-querying.
const requireOrgRole = (...allowedRoles) =>
  asyncHandler(async (req, res, next) => {
    const orgId = req.params.orgId || req.body.organization;
    if (!orgId) throw new ApiError(400, 'Organization ID is required');

    const membership = await Membership.findOne({
      user: req.user._id,
      organization: orgId,
      status: 'active',
    });

    if (!membership) {
      throw new ApiError(403, 'You are not a member of this organization');
    }

    if (allowedRoles.length && !allowedRoles.includes(membership.role)) {
      throw new ApiError(403, 'You do not have permission to perform this action');
    }

    req.membership = membership;
    next();
  });

module.exports = requireOrgRole;
