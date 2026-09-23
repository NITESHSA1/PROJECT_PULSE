const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const Comment = require('../models/Comment');
const Task = require('../models/Task');
const Notification = require('../models/Notification');
const logActivity = require('../utils/logActivity');

// @route POST /api/projects/:projectId/tasks/:taskId/comments
const createComment = asyncHandler(async (req, res) => {
  const { body, mentions } = req.body;
  if (!body) throw new ApiError(400, 'Comment body is required');

  const task = await Task.findOne({ _id: req.params.taskId, project: req.params.projectId });
  if (!task) throw new ApiError(404, 'Task not found');

  const comment = await Comment.create({
    task: task._id,
    author: req.user._id,
    body,
    mentions: mentions || [],
  });

  // Notify mentioned users
  if (mentions && mentions.length) {
    await Notification.insertMany(
      mentions
        .filter((userId) => userId.toString() !== req.user._id.toString())
        .map((userId) => ({
          recipient: userId,
          type: 'mention',
          message: `${req.user.name} mentioned you in a comment on ${task.code}`,
          relatedTask: task._id,
        }))
    );
  }

  // Notify assignees (excluding the commenter) that a new comment was added
  const assigneesToNotify = (task.assignees || []).filter(
    (a) => a.toString() !== req.user._id.toString()
  );
  if (assigneesToNotify.length) {
    await Notification.insertMany(
      assigneesToNotify.map((userId) => ({
        recipient: userId,
        type: 'comment',
        message: `${req.user.name} commented on ${task.code}`,
        relatedTask: task._id,
      }))
    );
  }

  await logActivity({
    organization: req.project.organization,
    project: req.params.projectId,
    actor: req.user._id,
    action: 'comment.created',
    entityType: 'Comment',
    entityId: comment._id,
    meta: { taskCode: task.code },
  });

  const populated = await comment.populate('author', 'name email avatarUrl');

  res.status(201).json({ success: true, data: { comment: populated } });
});

// @route GET /api/projects/:projectId/tasks/:taskId/comments
const getComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ task: req.params.taskId })
    .populate('author', 'name email avatarUrl')
    .sort({ createdAt: 1 });

  res.status(200).json({ success: true, data: { comments } });
});

// @route PATCH /api/projects/:projectId/tasks/:taskId/comments/:commentId  (author only)
const updateComment = asyncHandler(async (req, res) => {
  const { body } = req.body;
  const comment = await Comment.findOne({ _id: req.params.commentId, task: req.params.taskId });
  if (!comment) throw new ApiError(404, 'Comment not found');

  if (comment.author.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You can only edit your own comments');
  }

  comment.body = body;
  comment.isEdited = true;
  await comment.save();

  res.status(200).json({ success: true, data: { comment } });
});

// @route DELETE /api/projects/:projectId/tasks/:taskId/comments/:commentId  (author or project_manager)
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findOne({ _id: req.params.commentId, task: req.params.taskId });
  if (!comment) throw new ApiError(404, 'Comment not found');

  const isAuthor = comment.author.toString() === req.user._id.toString();
  const isManager = req.projectMember?.role === 'project_manager' || req.membership?.role === 'admin';

  if (!isAuthor && !isManager) {
    throw new ApiError(403, 'You do not have permission to delete this comment');
  }

  await comment.deleteOne();

  res.status(200).json({ success: true, data: {} });
});

module.exports = { createComment, getComments, updateComment, deleteComment };
