const mongoose = require('mongoose');

const DiagramSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  name: String,
  nodes: Array,
  edges: Array,
  rawInput: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Diagram', DiagramSchema);
