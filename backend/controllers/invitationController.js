const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const generateInviteToken = require('../utils/generateInviteToken');
const Invitation = require('../models/Invitation');
const Membership = require('../models/Membership');
const User = require('../models/User');
const Organization = require('../models/Organization');
const { ORG_ROLES } = require('../models/Membership');

const INVITE_EXPIRY_DAYS = 7;

// @route POST /api/organizations/:orgId/invitations  (admin only)
const createInvitation = asyncHandler(async (req, res) => {
  const { email, role } = req.body;
  const { orgId } = req.params;

  if (!email) throw new ApiError(400, 'Email is required');
  const targetRole = role && ORG_ROLES.includes(role) ? role : 'member';

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    const alreadyMember = await Membership.findOne({
      user: existingUser._id,
      organization: orgId,
      status: 'active',
    });
    if (alreadyMember) throw new ApiError(409, 'This user is already a member of the organization');
  }

  const existingInvite = await Invitation.findOne({
    organization: orgId,
    email: email.toLowerCase(),
    status: 'pending',
  });
  if (existingInvite) throw new ApiError(409, 'An invitation is already pending for this email');

  const token = generateInviteToken();
  const expiresAt = new Date(Date.now() + INVITE_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

  const invitation = await Invitation.create({
    organization: orgId,
    email: email.toLowerCase(),
    role: targetRole,
    token,
    invitedBy: req.user._id,
    expiresAt,
  });

  // In production this would email the invite link. For now we return it directly
  // so it can be shared/tested without a mail provider configured.
  const inviteLink = `${process.env.CLIENT_URL}/invitations/accept?token=${token}`;

  res.status(201).json({ success: true, data: { invitation, inviteLink } });
});

// @route GET /api/organizations/:orgId/invitations  (admin only) - list pending invites
const getOrganizationInvitations = asyncHandler(async (req, res) => {
  const invitations = await Invitation.find({
    organization: req.params.orgId,
    status: 'pending',
  }).sort({ createdAt: -1 });

  res.status(200).json({ success: true, data: { invitations } });
});

// @route DELETE /api/organizations/:orgId/invitations/:invitationId  (admin only) - revoke
const revokeInvitation = asyncHandler(async (req, res) => {
  const invitation = await Invitation.findOne({
    _id: req.params.invitationId,
    organization: req.params.orgId,
  });
  if (!invitation) throw new ApiError(404, 'Invitation not found');

  invitation.status = 'revoked';
  await invitation.save();

  res.status(200).json({ success: true, data: {} });
});

// @route POST /api/invitations/accept  (authenticated user, any org)
const acceptInvitation = asyncHandler(async (req, res) => {
  const { token } = req.body;
  if (!token) throw new ApiError(400, 'Invitation token is required');

  const invitation = await Invitation.findOne({ token });
  if (!invitation) throw new ApiError(404, 'Invitation not found');

  if (invitation.status !== 'pending') {
    throw new ApiError(400, `This invitation has already been ${invitation.status}`);
  }
  if (invitation.expiresAt < new Date()) {
    invitation.status = 'expired';
    await invitation.save();
    throw new ApiError(400, 'This invitation has expired');
  }
  if (invitation.email !== req.user.email.toLowerCase()) {
    throw new ApiError(403, 'This invitation was sent to a different email address');
  }

  const existingMembership = await Membership.findOne({
    user: req.user._id,
    organization: invitation.organization,
  });

  let membership;
  if (existingMembership) {
    existingMembership.status = 'active';
    existingMembership.role = invitation.role;
    membership = await existingMembership.save();
  } else {
    membership = await Membership.create({
      user: req.user._id,
      organization: invitation.organization,
      role: invitation.role,
      status: 'active',
      invitedBy: invitation.invitedBy,
    });
  }

  invitation.status = 'accepted';
  await invitation.save();

  const organization = await Organization.findById(invitation.organization);

  res.status(200).json({ success: true, data: { membership, organization } });
});

module.exports = {
  createInvitation,
  getOrganizationInvitations,
  revokeInvitation,
  acceptInvitation,
};
