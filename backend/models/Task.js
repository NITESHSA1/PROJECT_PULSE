const mongoose = require('mongoose');

// A "Task" also covers Issues/Bugs via `type` + the optional issueDetails block below,
// rather than maintaining a fully separate collection - keeps the Kanban/board logic
// unified while still supporting bug-specific fields when type === 'bug'.
const taskSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    code: { type: String, required: true }, // e.g. "PP-101", set from Project.taskCounter
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    type: { type: String, enum: ['task', 'bug', 'story', 'epic'], default: 'task' },
    status: {
      type: String,
      enum: ['backlog', 'todo', 'in_progress', 'in_review', 'blocked', 'done'],
      default: 'backlog',
    },
    priority: { type: String, enum: ['lowest', 'low', 'medium', 'high', 'highest'], default: 'medium' },
    storyPoints: { type: Number, min: 0 },
    sprint: { type: mongoose.Schema.Types.ObjectId, ref: 'Sprint', default: null },
    milestone: { type: mongoose.Schema.Types.ObjectId, ref: 'Milestone', default: null },
    assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    labels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Label' }],
    dependencies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }], // "blocked by" tasks
    dueDate: { type: Date },
    // populated only when type === 'bug'
    issueDetails: {
      severity: { type: String, enum: ['low', 'medium', 'high', 'critical'] },
      stepsToReproduce: { type: String },
      environment: { type: String },
      resolution: { type: String },
    },
    order: { type: Number, default: 0 }, // for drag-and-drop ordering within a status column
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

taskSchema.index({ project: 1, code: 1 }, { unique: true });
taskSchema.index({ project: 1, status: 1 });
taskSchema.index({ sprint: 1 });

module.exports = mongoose.model('Task', taskSchema);
