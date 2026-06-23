const axios = require('axios');
const Resume = require('../models/Resume');
const path = require('path');

exports.uploadResume = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { jobDescription } = req.body;

    if (!jobDescription) {
      return res.status(400).json({ message: 'Job description is required' });
    }

    // Get absolute path of uploaded file
    const pdfPath = path.resolve(req.file.path);

    // Send path to Python service for text extraction
    const extractRes = await axios.post('http://localhost:8000/extract', {
      pdf_path: pdfPath
    });

    const resumeText = extractRes.data.text;
    const wordCount = extractRes.data.word_count;

    // Save to MongoDB
    const resume = await Resume.create({
      userId: req.user.id,
      fileName: req.file.originalname,
      extractedText: resumeText,
      analysisResult: {
        matchPercentage: 0,
        missingKeywords: [],
        suggestions: [],
        predictedRole: 'Pending Analysis'
      }
    });

    res.status(201).json({
      success: true,
      message: 'Resume uploaded and text extracted successfully!',
      resumeId: resume._id,
      fileName: req.file.originalname,
      wordCount,
      extractedText: resumeText.substring(0, 200) + '...' // preview only
    });

  } catch (err) {
    console.error('Upload error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.getMyResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    res.json(resumes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};