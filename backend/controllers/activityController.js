const asyncHandler = require('../utils/asyncHandler');
const Activity = require('../models/Activity');

// @route GET /api/projects/:projectId/activity
const getProjectActivity = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 30;

  const [activities, total] = await Promise.all([
    Activity.find({ project: req.params.projectId })
      .populate('actor', 'name email avatarUrl')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Activity.countDocuments({ project: req.params.projectId }),
  ]);

  res.status(200).json({
    success: true,
    data: { activities, pagination: { page, limit, total, pages: Math.ceil(total / limit) } },
  });
});

module.exports = { getProjectActivity };
