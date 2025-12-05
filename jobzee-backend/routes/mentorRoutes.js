const express = require('express');
const router = express.Router();
const mentorController = require('../controllers/mentorController');
const { uploadSingle } = require('../middleware/upload');
const { adminAuth } = require('../middleware/adminAuth');

// Public routes
router.post('/register', uploadSingle, mentorController.registerMentor);
router.post('/login', mentorController.loginMentor);

// Admin routes
router.get('/all', adminAuth, mentorController.getAllMentors);
router.put('/:mentorId/status', adminAuth, mentorController.updateMentorStatus);

module.exports = router;
