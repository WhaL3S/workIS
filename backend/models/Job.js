const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, enum: ['Part-time', 'Full-time', 'Flexible'], required: true },
  salary: { type: Number, required: true },
  company: { type: String, required: true }, 
  employer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  applications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }],
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
