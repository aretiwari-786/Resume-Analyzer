const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');
const { 
  uploadResume, 
  getMyResumes,
  getResumeById 
} = require('../controllers/resumeController');

// All routes protected
router.post('/upload', authMiddleware, upload.single('resume'), uploadResume);
router.get('/my-resumes', authMiddleware, getMyResumes);
router.get('/:id', authMiddleware, getResumeById);

module.exports = router;