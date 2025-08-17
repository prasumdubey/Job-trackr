const Job = require('../models/Job');
const gptService = require('../services/gptService');
const fs = require('fs');
const pdfParse = require('pdf-parse');

// Get all jobs for the logged-in user (with optional filters)
// controllers/jobController.js
exports.getUserJobs = async (req, res) => {
  try {
    console.log(req.user, req.user.id);
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    const { search } = req.query;

    // Always filter by logged-in user
    const query = { user: req.user.id };

    // Optional search filter
    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: "i" } },
        { jobRole: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    // Fetch jobs only for this user
    let jobs = await Job.find(query).sort({ createdAt: -1 });

    // Map backend fields to frontend expectations
    jobs = jobs.map((job) => ({
      jobRole: job.jobRole,
      companyName: job.companyName,
      location: job.location,
      id: job._id,
      jobType: job.jobType, 
      salary: job.salary,
      probationPeriod: job.probationPeriod,
      fullTimeOpportunity: job.fullTimeOpportunity,
    }));

    res.json(jobs);
  } catch (error) {
    console.error("Error fetching user jobs:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE a job
exports.deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required" });
    }

    const deletedJob = await Job.findOneAndDelete({
      _id: jobId,
      user: req.user.id,
    });

    if (!deletedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({ message: "Job deleted successfully", deletedJob });
  } catch (error) {
    res.status(500).json({ message: "Error deleting job", error: error.message });
  }
};

exports.saveJob = async (req, res) => {
  try {
    const {
      companyName,
      jobRole,
      jobType,
      location,
      salary,
      probationPeriod,
      fullTimeOpportunity
    } = req.body;

    const newJob = new Job({
      companyName,
      jobRole,
      jobType,
      location,
      salary,
      probationPeriod,
      fullTimeOpportunity,
      user: req.user.id
    });

    await newJob.save();
    res.status(201).json({ message: 'Job saved successfully', job: newJob });
  } catch (err) {
    console.error('Error saving job:', err);
    res.status(500).json({ error: 'Failed to save job' });
  }
};

exports.extractJobInfo = async (req, res) => {
  try {
    let jobDescription = req.body.jobDescription;

    // ✅ If a file is uploaded, extract text from it
    if (req.file) {
      const fileBuffer = fs.readFileSync(req.file.path);
      const pdfData = await pdfParse(fileBuffer);
      jobDescription = pdfData.text; // Extracted text from PDF
    }

    // ✅ Validation
    if (!jobDescription || jobDescription.trim() === '') {
      return res.status(400).json({ error: 'Job description or file is required' });
    }

    // ✅ Extract fields using GPT service
    const extractedFields = await gptService.extractFieldsFromText(jobDescription);

    // ✅ Save to DB with user ID
    const newJob = new Job({
      ...extractedFields,
      user: req.user.id
    });

    await newJob.save();

    res.status(201).json({ message: 'Job extracted and saved', job: newJob });
  } catch (err) {
    console.error('Error extracting job info:', err);
    res.status(500).json({ error: 'Failed to extract job info' });
  }
}; 