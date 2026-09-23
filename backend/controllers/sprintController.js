const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const Sprint = require('../models/Sprint');
const logActivity = require('../utils/logActivity');

// @route POST /api/projects/:projectId/sprints  (project_manager, team_lead, or org admin)
const createSprint = asyncHandler(async (req, res) => {
  const { name, goal, startDate, endDate } = req.body;
  if (!name) throw new ApiError(400, 'Sprint name is required');

  const sprint = await Sprint.create({
    project: req.params.projectId,
    name,
    goal: goal || '',
    startDate,
    endDate,
  });

  await logActivity({
    organization: req.project.organization,
    project: req.params.projectId,
    actor: req.user._id,
    action: 'sprint.created',
    entityType: 'Sprint',
    entityId: sprint._id,
  });

  res.status(201).json({ success: true, data: { sprint } });
});

// @route GET /api/projects/:projectId/sprints
const getSprints = asyncHandler(async (req, res) => {
  const sprints = await Sprint.find({ project: req.params.projectId }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: { sprints } });
});

// @route GET /api/projects/:projectId/sprints/:sprintId
const getSprint = asyncHandler(async (req, res) => {
  const sprint = await Sprint.findOne({ _id: req.params.sprintId, project: req.params.projectId });
  if (!sprint) throw new ApiError(404, 'Sprint not found');
  res.status(200).json({ success: true, data: { sprint } });
});

// @route PATCH /api/projects/:projectId/sprints/:sprintId  (project_manager, team_lead, or org admin)
const updateSprint = asyncHandler(async (req, res) => {
  const { name, goal, startDate, endDate, status } = req.body;
  const sprint = await Sprint.findOne({ _id: req.params.sprintId, project: req.params.projectId });
  if (!sprint) throw new ApiError(404, 'Sprint not found');

  if (name) sprint.name = name;
  if (goal !== undefined) sprint.goal = goal;
  if (startDate !== undefined) sprint.startDate = startDate;
  if (endDate !== undefined) sprint.endDate = endDate;
  if (status) sprint.status = status;

  await sprint.save();

  if (status) {
    await logActivity({
      organization: req.project.organization,
      project: req.params.projectId,
      actor: req.user._id,
      action: 'sprint.status_changed',
      entityType: 'Sprint',
      entityId: sprint._id,
      meta: { status },
    });
  }

  res.status(200).json({ success: true, data: { sprint } });
});

// @route DELETE /api/projects/:projectId/sprints/:sprintId  (project_manager or org admin)
const deleteSprint = asyncHandler(async (req, res) => {
  const sprint = await Sprint.findOneAndDelete({ _id: req.params.sprintId, project: req.params.projectId });
  if (!sprint) throw new ApiError(404, 'Sprint not found');
  res.status(200).json({ success: true, data: {} });
});

module.exports = { createSprint, getSprints, getSprint, updateSprint, deleteSprint };
