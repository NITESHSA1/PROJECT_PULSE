const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true }, // e.g. "mention", "assignment", "status_change", "comment"
    message: { type: String, required: true },
    link: { type: String }, // relative frontend path to navigate to
    isRead: { type: Boolean, default: false },
    relatedTask: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  },
  { timestamps: true }
);

notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
