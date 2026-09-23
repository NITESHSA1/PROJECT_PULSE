const mongoose = require('mongoose');

const labelSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    name: { type: String, required: true, trim: true },
    color: { type: String, default: '#6366f1' },
  },
  { timestamps: true }
);

labelSchema.index({ project: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Label', labelSchema);
