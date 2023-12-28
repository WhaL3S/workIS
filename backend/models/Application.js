const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  applicantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  surname: { type: String, required: true },
  summary: { type: String, required: true },
  resume: { type: String, required: true },
  email: { type: String, required: true },
});

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;