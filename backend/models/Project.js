const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
    name: { type: String, required: true, trim: true },
    key: { type: String, required: true, trim: true, uppercase: true }, // e.g. "PP" for task codes like PP-101
    description: { type: String, default: '' },
    status: { type: String, enum: ['planning', 'active', 'on_hold', 'completed', 'archived'], default: 'planning' },
    startDate: { type: Date },
    endDate: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    taskCounter: { type: Number, default: 0 }, // increments for task codes (PP-1, PP-2...)
  },
  { timestamps: true }
);

projectSchema.index({ organization: 1, key: 1 }, { unique: true });

module.exports = mongoose.model('Project', projectSchema);
