const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');
const { uploadResume, getMyResumes } = require('../controllers/resumeController');

// All routes are protected
router.post('/upload', authMiddleware, upload.single('resume'), uploadResume);
router.get('/my-resumes', authMiddleware, getMyResumes);

module.exports = router;