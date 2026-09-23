const mongoose = require('mongoose');

// Org-level role. Project-level role (ProjectMember) can further scope permissions per project.
const ORG_ROLES = ['admin', 'project_manager', 'team_lead', 'member', 'stakeholder'];

const membershipSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
    role: { type: String, enum: ORG_ROLES, default: 'member' },
    status: { type: String, enum: ['invited', 'active', 'removed'], default: 'active' },
    invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

membershipSchema.index({ user: 1, organization: 1 }, { unique: true });

module.exports = mongoose.model('Membership', membershipSchema);
module.exports.ORG_ROLES = ORG_ROLES;
