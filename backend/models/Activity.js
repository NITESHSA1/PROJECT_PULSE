const mongoose = require('mongoose');

// Generic activity log entry, scoped to a project, for the project's activity feed.
// `entityType`/`entityId` point at whatever was changed (Task, Sprint, Milestone, etc).
const activitySchema = new mongoose.Schema(
  {
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true }, // e.g. "task.created", "task.status_changed", "sprint.started"
    entityType: { type: String, required: true }, // "Task" | "Sprint" | "Milestone" | "Project" | "Comment"
    entityId: { type: mongoose.Schema.Types.ObjectId, required: true },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} }, // e.g. { from: 'todo', to: 'in_progress' }
  },
  { timestamps: true }
);

activitySchema.index({ project: 1, createdAt: -1 });

module.exports = mongoose.model('Activity', activitySchema);
