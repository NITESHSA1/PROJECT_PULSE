const mongoose = require('mongoose');

const statusHistorySchema = new mongoose.Schema(
  {
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
    fromStatus: { type: String },
    toStatus: { type: String, required: true },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

statusHistorySchema.index({ task: 1, createdAt: -1 });

module.exports = mongoose.model('StatusHistory', statusHistorySchema);
