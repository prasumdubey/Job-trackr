const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  companyName: String,
  jobRole: String,
  jobType: String,
  location: String,
  salary: String,
  probationPeriod: String,
  fullTimeOpportunity: String,
  extractedAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Job', jobSchema);
