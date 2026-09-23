const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ['upcoming', 'at_risk', 'completed', 'missed'], default: 'upcoming' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Milestone', milestoneSchema);
