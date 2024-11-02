const mongoose = require('mongoose');

const codeUsageSchema = new mongoose.Schema({
  codeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Code', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User ', required: true },
  fechaUso: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CodeUsage', codeUsageSchema);