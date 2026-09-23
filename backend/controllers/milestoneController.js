const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const Milestone = require('../models/Milestone');
const logActivity = require('../utils/logActivity');

// @route POST /api/projects/:projectId/milestones  (project_manager or org admin)
const createMilestone = asyncHandler(async (req, res) => {
  const { title, description, dueDate } = req.body;
  if (!title || !dueDate) throw new ApiError(400, 'Milestone title and dueDate are required');

  const milestone = await Milestone.create({
    project: req.params.projectId,
    title,
    description: description || '',
    dueDate,
  });

  await logActivity({
    organization: req.project.organization,
    project: req.params.projectId,
    actor: req.user._id,
    action: 'milestone.created',
    entityType: 'Milestone',
    entityId: milestone._id,
  });

  res.status(201).json({ success: true, data: { milestone } });
});

// @route GET /api/projects/:projectId/milestones
const getMilestones = asyncHandler(async (req, res) => {
  const milestones = await Milestone.find({ project: req.params.projectId }).sort({ dueDate: 1 });
  res.status(200).json({ success: true, data: { milestones } });
});

// @route PATCH /api/projects/:projectId/milestones/:milestoneId  (project_manager or org admin)
const updateMilestone = asyncHandler(async (req, res) => {
  const { title, description, dueDate, status } = req.body;
  const milestone = await Milestone.findOne({ _id: req.params.milestoneId, project: req.params.projectId });
  if (!milestone) throw new ApiError(404, 'Milestone not found');

  if (title) milestone.title = title;
  if (description !== undefined) milestone.description = description;
  if (dueDate) milestone.dueDate = dueDate;
  if (status) milestone.status = status;

  await milestone.save();
  res.status(200).json({ success: true, data: { milestone } });
});

// @route DELETE /api/projects/:projectId/milestones/:milestoneId  (project_manager or org admin)
const deleteMilestone = asyncHandler(async (req, res) => {
  const milestone = await Milestone.findOneAndDelete({
    _id: req.params.milestoneId,
    project: req.params.projectId,
  });
  if (!milestone) throw new ApiError(404, 'Milestone not found');
  res.status(200).json({ success: true, data: {} });
});

module.exports = { createMilestone, getMilestones, updateMilestone, deleteMilestone };
