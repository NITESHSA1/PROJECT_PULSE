const Activity = require('../models/Activity');

// Fire-and-forget style helper to record an activity feed entry.
// Call this from controllers after a meaningful change (task created, status changed, etc).
const logActivity = async ({ organization, project, actor, action, entityType, entityId, meta = {} }) => {
  try {
    await Activity.create({ organization, project, actor, action, entityType, entityId, meta });
  } catch (err) {
    // Never let activity logging break the main request flow.
    console.error('Failed to log activity:', err.message);
  }
};

module.exports = logActivity;
