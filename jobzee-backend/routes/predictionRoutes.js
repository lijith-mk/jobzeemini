const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Job = require('../models/Job');
const Internship = require('../models/Internship');
const decisionTreePrediction = require('../services/decisionTreePrediction');

/**
 * POST /api/predictions/job-success
 * Predict success probability for a specific job
 */
router.post('/job-success', auth, async (req, res) => {
  try {
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({ message: 'Job ID is required' });
    }

    // Get user profile
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get job details
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Get detailed prediction
    const prediction = decisionTreePrediction.getDetailedAnalysis(user, job, 'job');

    res.json({
      success: true,
      prediction
    });
  } catch (error) {
    console.error('Job success prediction error:', error);
    res.status(500).json({ message: 'Failed to predict success' });
  }
});

/**
 * POST /api/predictions/internship-success
 * Predict success probability for a specific internship
 */
router.post('/internship-success', auth, async (req, res) => {
  try {
    const { internshipId } = req.body;

    if (!internshipId) {
      return res.status(400).json({ message: 'Internship ID is required' });
    }

    // Get user profile
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get internship details
    const internship = await Internship.findById(internshipId);
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    // Get detailed prediction
    const prediction = decisionTreePrediction.getDetailedAnalysis(user, internship, 'internship');

    res.json({
      success: true,
      prediction
    });
  } catch (error) {
    console.error('Internship success prediction error:', error);
    res.status(500).json({ message: 'Failed to predict success' });
  }
});

/**
 * GET /api/predictions/job-success/:jobId
 * Get prediction for a job (alternative GET endpoint)
 */
router.get('/job-success/:jobId', auth, async (req, res) => {
  try {
    const { jobId } = req.params;

    // Get user profile
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get job details
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Get detailed prediction
    const prediction = decisionTreePrediction.getDetailedAnalysis(user, job, 'job');

    res.json({
      success: true,
      prediction
    });
  } catch (error) {
    console.error('Job success prediction error:', error);
    res.status(500).json({ message: 'Failed to predict success' });
  }
});

/**
 * GET /api/predictions/internship-success/:internshipId
 * Get prediction for an internship (alternative GET endpoint)
 */
router.get('/internship-success/:internshipId', auth, async (req, res) => {
  try {
    const { internshipId } = req.params;

    // Get user profile
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get internship details
    const internship = await Internship.findById(internshipId);
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    // Get detailed prediction
    const prediction = decisionTreePrediction.getDetailedAnalysis(user, internship, 'internship');

    res.json({
      success: true,
      prediction
    });
  } catch (error) {
    console.error('Internship success prediction error:', error);
    res.status(500).json({ message: 'Failed to predict success' });
  }
});

module.exports = router;
