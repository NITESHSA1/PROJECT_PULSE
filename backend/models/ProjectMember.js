const mongoose = require('mongoose');

// Project-scoped role, independent from org role - lets e.g. a org "member" be a
// "project_manager" on one specific project, or a stakeholder get read-only access
// to just one project without org-wide visibility.
const PROJECT_ROLES = ['project_manager', 'team_lead', 'member', 'stakeholder'];

const projectMemberSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: PROJECT_ROLES, default: 'member' },
  },
  { timestamps: true }
);

projectMemberSchema.index({ project: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('ProjectMember', projectMemberSchema);
module.exports.PROJECT_ROLES = PROJECT_ROLES;
