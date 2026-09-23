const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const Task = require('../models/Task');
const Project = require('../models/Project');
const StatusHistory = require('../models/StatusHistory');
const applyApiFeatures = require('../utils/apiFeatures');
const logActivity = require('../utils/logActivity');

// Atomically increments the project's taskCounter and returns the next task code, e.g. "PP-42".
const getNextTaskCode = async (projectId) => {
  const project = await Project.findByIdAndUpdate(
    projectId,
    { $inc: { taskCounter: 1 } },
    { new: true }
  );
  return `${project.key}-${project.taskCounter}`;
};

// @route POST /api/projects/:projectId/tasks  (any project member except stakeholder)
const createTask = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    type,
    priority,
    storyPoints,
    sprint,
    milestone,
    assignees,
    labels,
    dependencies,
    dueDate,
    issueDetails,
  } = req.body;

  if (!title) throw new ApiError(400, 'Task title is required');

  const code = await getNextTaskCode(req.params.projectId);

  const task = await Task.create({
    project: req.params.projectId,
    code,
    title,
    description: description || '',
    type: type || 'task',
    priority: priority || 'medium',
    storyPoints,
    sprint: sprint || null,
    milestone: milestone || null,
    assignees: assignees || [],
    reporter: req.user._id,
    labels: labels || [],
    dependencies: dependencies || [],
    dueDate,
    issueDetails: type === 'bug' ? issueDetails : undefined,
  });

  await StatusHistory.create({
    task: task._id,
    toStatus: task.status,
    changedBy: req.user._id,
  });

  await logActivity({
    organization: req.project.organization,
    project: req.params.projectId,
    actor: req.user._id,
    action: 'task.created',
    entityType: 'Task',
    entityId: task._id,
    meta: { code: task.code, title: task.title },
  });

  res.status(201).json({ success: true, data: { task } });
});

// @route GET /api/projects/:projectId/tasks  (any project member) - supports filters/search/pagination
// Query params: status, priority, type, sprint, assignees, search, sort, page, limit
const getTasks = asyncHandler(async (req, res) => {
  const baseQuery = Task.find({ project: req.params.projectId, isArchived: false });

  const { dbQuery, mongoQuery, page, limit } = applyApiFeatures(baseQuery, req.query, {
    searchFields: ['title', 'code', 'description'],
    filterFields: ['status', 'priority', 'type', 'sprint', 'assignees', 'milestone'],
  });

  const [tasks, total] = await Promise.all([
    dbQuery.populate('assignees', 'name email avatarUrl').populate('labels'),
    Task.countDocuments({ project: req.params.projectId, isArchived: false, ...mongoQuery }),
  ]);

  res.status(200).json({
    success: true,
    data: { tasks, pagination: { page, limit, total, pages: Math.ceil(total / limit) } },
  });
});

// @route GET /api/projects/:projectId/tasks/:taskId
const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.taskId, project: req.params.projectId })
    .populate('assignees', 'name email avatarUrl')
    .populate('reporter', 'name email avatarUrl')
    .populate('labels')
    .populate('dependencies', 'code title status');

  if (!task) throw new ApiError(404, 'Task not found');

  res.status(200).json({ success: true, data: { task } });
});

// @route PATCH /api/projects/:projectId/tasks/:taskId  (general field updates)
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.taskId, project: req.params.projectId });
  if (!task) throw new ApiError(404, 'Task not found');

  const allowedFields = [
    'title',
    'description',
    'type',
    'priority',
    'storyPoints',
    'sprint',
    'milestone',
    'assignees',
    'labels',
    'dependencies',
    'dueDate',
    'issueDetails',
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) task[field] = req.body[field];
  });

  await task.save();
  await task.populate('assignees', 'name email avatarUrl');
  await task.populate('labels');

  await logActivity({
    organization: req.project.organization,
    project: req.params.projectId,
    actor: req.user._id,
    action: 'task.updated',
    entityType: 'Task',
    entityId: task._id,
    meta: { code: task.code },
  });

  res.status(200).json({ success: true, data: { task } });
});

// @route PATCH /api/projects/:projectId/tasks/:taskId/status  (Kanban drag-and-drop status change)
const updateTaskStatus = asyncHandler(async (req, res) => {
  const { status, order } = req.body;
  const validStatuses = ['backlog', 'todo', 'in_progress', 'in_review', 'blocked', 'done'];
  if (!validStatuses.includes(status)) throw new ApiError(400, 'Invalid status');

  const task = await Task.findOne({ _id: req.params.taskId, project: req.params.projectId });
  if (!task) throw new ApiError(404, 'Task not found');

  const fromStatus = task.status;
  task.status = status;
  if (order !== undefined) task.order = order;
  await task.save();

  if (fromStatus !== status) {
    await StatusHistory.create({
      task: task._id,
      fromStatus,
      toStatus: status,
      changedBy: req.user._id,
    });

    await logActivity({
      organization: req.project.organization,
      project: req.params.projectId,
      actor: req.user._id,
      action: 'task.status_changed',
      entityType: 'Task',
      entityId: task._id,
      meta: { code: task.code, from: fromStatus, to: status },
    });
  }

  res.status(200).json({ success: true, data: { task } });
});

// @route POST /api/projects/:projectId/tasks/reorder  (bulk reorder for Kanban drag-and-drop)
// Body: { updates: [{ taskId, status, order }, ...] }
// Applies multiple task position/status changes in one call, e.g. when dragging a card
// shifts several other cards' order values in the same column.
const reorderTasks = asyncHandler(async (req, res) => {
  const { updates } = req.body;
  if (!Array.isArray(updates) || updates.length === 0) {
    throw new ApiError(400, 'updates array is required');
  }

  const bulkOps = updates.map(({ taskId, status, order }) => ({
    updateOne: {
      filter: { _id: taskId, project: req.params.projectId },
      update: { $set: { status, order } },
    },
  }));

  await Task.bulkWrite(bulkOps);

  res.status(200).json({ success: true, data: {} });
});

// @route DELETE /api/projects/:projectId/tasks/:taskId  (archive, not hard delete)
const archiveTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.taskId, project: req.params.projectId });
  if (!task) throw new ApiError(404, 'Task not found');

  task.isArchived = true;
  await task.save();

  res.status(200).json({ success: true, data: {} });
});

// @route GET /api/projects/:projectId/tasks/:taskId/history  (status history / audit trail)
const getTaskHistory = asyncHandler(async (req, res) => {
  const history = await StatusHistory.find({ task: req.params.taskId })
    .populate('changedBy', 'name email avatarUrl')
    .sort({ createdAt: 1 });

  res.status(200).json({ success: true, data: { history } });
});

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  updateTaskStatus,
  reorderTasks,
  archiveTask,
  getTaskHistory,
};
