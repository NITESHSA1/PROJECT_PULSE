const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const slugify = require('../utils/slugify');
const Organization = require('../models/Organization');
const Membership = require('../models/Membership');

// @route POST /api/organizations
// Creates an org and makes the creator its admin.
const createOrganization = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  if (!name) throw new ApiError(400, 'Organization name is required');

  let slug = slugify(name);
  const existing = await Organization.findOne({ slug });
  if (existing) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  const org = await Organization.create({
    name,
    slug,
    description: description || '',
    owner: req.user._id,
  });

  await Membership.create({
    user: req.user._id,
    organization: org._id,
    role: 'admin',
    status: 'active',
  });

  res.status(201).json({ success: true, data: { organization: org } });
});

// @route GET /api/organizations
// Lists all orgs the current user belongs to.
const getMyOrganizations = asyncHandler(async (req, res) => {
  const memberships = await Membership.find({ user: req.user._id, status: 'active' }).populate(
    'organization'
  );

  const organizations = memberships.map((m) => ({
    ...m.organization.toObject(),
    myRole: m.role,
  }));

  res.status(200).json({ success: true, data: { organizations } });
});

// @route GET /api/organizations/:orgId
const getOrganization = asyncHandler(async (req, res) => {
  const org = await Organization.findById(req.params.orgId);
  if (!org) throw new ApiError(404, 'Organization not found');

  res.status(200).json({ success: true, data: { organization: org, myRole: req.membership.role } });
});

// @route PATCH /api/organizations/:orgId  (admin only)
const updateOrganization = asyncHandler(async (req, res) => {
  const { name, description, settings } = req.body;
  const org = await Organization.findById(req.params.orgId);
  if (!org) throw new ApiError(404, 'Organization not found');

  if (name) org.name = name;
  if (description !== undefined) org.description = description;
  if (settings) org.settings = { ...org.settings.toObject(), ...settings };

  await org.save();

  res.status(200).json({ success: true, data: { organization: org } });
});

// @route GET /api/organizations/:orgId/members
const getOrganizationMembers = asyncHandler(async (req, res) => {
  const members = await Membership.find({ organization: req.params.orgId, status: 'active' })
    .populate('user', 'name email avatarUrl')
    .sort({ createdAt: 1 });

  res.status(200).json({ success: true, data: { members } });
});

// @route PATCH /api/organizations/:orgId/members/:membershipId  (admin only) - change a member's role
const updateMemberRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const { ORG_ROLES } = require('../models/Membership');

  if (!ORG_ROLES.includes(role)) throw new ApiError(400, 'Invalid role');

  const membership = await Membership.findOne({
    _id: req.params.membershipId,
    organization: req.params.orgId,
  });
  if (!membership) throw new ApiError(404, 'Membership not found');

  if (membership.user.toString() === req.user._id.toString() && role !== 'admin') {
    throw new ApiError(400, 'You cannot demote yourself');
  }

  membership.role = role;
  await membership.save();

  res.status(200).json({ success: true, data: { membership } });
});

// @route DELETE /api/organizations/:orgId/members/:membershipId  (admin only) - remove a member
const removeMember = asyncHandler(async (req, res) => {
  const membership = await Membership.findOne({
    _id: req.params.membershipId,
    organization: req.params.orgId,
  });
  if (!membership) throw new ApiError(404, 'Membership not found');

  if (membership.user.toString() === req.user._id.toString()) {
    throw new ApiError(400, 'You cannot remove yourself from the organization');
  }

  membership.status = 'removed';
  await membership.save();

  res.status(200).json({ success: true, data: {} });
});

module.exports = {
  createOrganization,
  getMyOrganizations,
  getOrganization,
  updateOrganization,
  getOrganizationMembers,
  updateMemberRole,
  removeMember,
};
