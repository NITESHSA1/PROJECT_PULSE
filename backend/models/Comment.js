const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    body: { type: String, required: true, trim: true },
    mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isEdited: { type: Boolean, default: false },
  },
  { timestamps: true }
);

commentSchema.index({ task: 1, createdAt: 1 });

module.exports = mongoose.model('Comment', commentSchema);
