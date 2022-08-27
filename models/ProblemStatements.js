const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const problemSchema = new Schema({
  title: { type: String, required: true },
  theme: { type: String, required: true },
  category: { type: String, required: true, default: 'Software' },
  submitCount: { type: Number, default: 0 },
});

module.exports = mongoose.model('ProblemStatement', problemSchema);
