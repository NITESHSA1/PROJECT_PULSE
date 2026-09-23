const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const Project = require('../models/Project');
const ProjectMember = require('../models/ProjectMember');
const logActivity = require('../utils/logActivity');

// @route POST /api/organizations/:orgId/projects  (org admin or project_manager)
const createProject = asyncHandler(async (req, res) => {
  const { name, key, description, startDate, endDate } = req.body;
  const { orgId } = req.params;

  if (!name || !key) throw new ApiError(400, 'Project name and key are required');

  const normalizedKey = key.trim().toUpperCase();
  const existing = await Project.findOne({ organization: orgId, key: normalizedKey });
  if (existing) throw new ApiError(409, `A project with key "${normalizedKey}" already exists in this organization`);

  const project = await Project.create({
    organization: orgId,
    name,
    key: normalizedKey,
    description: description || '',
    startDate,
    endDate,
    createdBy: req.user._id,
  });

  // Creator becomes the project's project_manager by default.
  await ProjectMember.create({
    project: project._id,
    user: req.user._id,
    role: 'project_manager',
  });

  await logActivity({
    organization: orgId,
    project: project._id,
    actor: req.user._id,
    action: 'project.created',
    entityType: 'Project',
    entityId: project._id,
  });

  res.status(201).json({ success: true, data: { project } });
});

// @route GET /api/organizations/:orgId/projects  (any active org member)
const getProjectsForOrg = asyncHandler(async (req, res) => {
  const projects = await Project.find({ organization: req.params.orgId, isArchived: { $ne: true } }).sort({
    createdAt: -1,
  });

  res.status(200).json({ success: true, data: { projects } });
});

// @route GET /api/projects/:projectId  (project member or org admin)
const getProject = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: { project: req.project } });
});

// @route PATCH /api/projects/:projectId  (project_manager or org admin)
const updateProject = asyncHandler(async (req, res) => {
  const { name, description, status, startDate, endDate } = req.body;
  const project = req.project;

  if (name) project.name = name;
  if (description !== undefined) project.description = description;
  if (status) project.status = status;
  if (startDate !== undefined) project.startDate = startDate;
  if (endDate !== undefined) project.endDate = endDate;

  await project.save();

  await logActivity({
    organization: project.organization,
    project: project._id,
    actor: req.user._id,
    action: 'project.updated',
    entityType: 'Project',
    entityId: project._id,
  });

  res.status(200).json({ success: true, data: { project } });
});

// @route DELETE /api/projects/:projectId  (project_manager or org admin) - archive, not hard delete
const archiveProject = asyncHandler(async (req, res) => {
  req.project.status = 'archived';
  req.project.isArchived = true;
  await req.project.save();

  res.status(200).json({ success: true, data: {} });
});

// @route GET /api/projects/:projectId/members
const getProjectMembers = asyncHandler(async (req, res) => {
  const members = await ProjectMember.find({ project: req.params.projectId })
    .populate('user', 'name email avatarUrl')
    .sort({ createdAt: 1 });

  res.status(200).json({ success: true, data: { members } });
});

// @route POST /api/projects/:projectId/members  (project_manager or org admin) - add an org member to this project
const addProjectMember = asyncHandler(async (req, res) => {
  const { userId, role } = req.body;
  const { PROJECT_ROLES } = require('../models/ProjectMember');

  if (!userId) throw new ApiError(400, 'userId is required');
  const targetRole = role && PROJECT_ROLES.includes(role) ? role : 'member';

  const existing = await ProjectMember.findOne({ project: req.params.projectId, user: userId });
  if (existing) throw new ApiError(409, 'This user is already a member of the project');

  const member = await ProjectMember.create({
    project: req.params.projectId,
    user: userId,
    role: targetRole,
  });

  res.status(201).json({ success: true, data: { member } });
});

// @route PATCH /api/projects/:projectId/members/:memberId  (project_manager or org admin)
const updateProjectMemberRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const { PROJECT_ROLES } = require('../models/ProjectMember');
  if (!PROJECT_ROLES.includes(role)) throw new ApiError(400, 'Invalid project role');

  const member = await ProjectMember.findOne({ _id: req.params.memberId, project: req.params.projectId });
  if (!member) throw new ApiError(404, 'Project member not found');

  member.role = role;
  await member.save();

  res.status(200).json({ success: true, data: { member } });
});

// @route DELETE /api/projects/:projectId/members/:memberId  (project_manager or org admin)
const removeProjectMember = asyncHandler(async (req, res) => {
  const member = await ProjectMember.findOneAndDelete({
    _id: req.params.memberId,
    project: req.params.projectId,
  });
  if (!member) throw new ApiError(404, 'Project member not found');

  res.status(200).json({ success: true, data: {} });
});

module.exports = {
  createProject,
  getProjectsForOrg,
  getProject,
  updateProject,
  archiveProject,
  getProjectMembers,
  addProjectMember,
  updateProjectMemberRole,
  removeProjectMember,
};
