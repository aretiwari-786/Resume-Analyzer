const axios = require('axios');
const path = require('path');
const Resume = require('../models/Resume');

exports.uploadResume = async (req, res) => {
  try {
    // Check file
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { jobDescription } = req.body;
    if (!jobDescription) {
      return res.status(400).json({ message: 'Job description is required' });
    }

    // Get absolute path
    const pdfPath = path.resolve(req.file.path);

    // Step 1: Extract text from PDF
    console.log('Extracting text from PDF...');
    const extractRes = await axios.post('http://localhost:8000/extract', {
      pdf_path: pdfPath
    });
    const resumeText = extractRes.data.text;
    console.log('Text extracted ✅');

    // Step 2: Run complete ML analysis
    console.log('Running ML analysis...');
    const analysisRes = await axios.post('http://localhost:8000/analyze', {
      resume_text: resumeText,
      job_description: jobDescription
    });
    const analysis = analysisRes.data;
    console.log('ML analysis complete ✅');

    // Step 3: Save to MongoDB
    const resume = await Resume.create({
      userId: req.user.id,
      fileName: req.file.originalname,
      extractedText: resumeText,
      skills: analysis.skills,
      experience: `${analysis.experience_years} years`,
      education: analysis.education,
      analysisResult: {
        overallScore: analysis.score.total,
        skillsScore: analysis.score.skills,
        experienceScore: analysis.score.experience,
        educationScore: analysis.score.education,
        matchPercentage: analysis.match_percentage,
        missingKeywords: analysis.missing_keywords,
        suggestions: [],
        predictedRole: analysis.predicted_role,
        grade: analysis.score.grade,
        emoji: analysis.score.emoji
      }
    });
    console.log('Saved to MongoDB ✅');

    // Return complete result
    res.status(201).json({
      success: true,
      resumeId: resume._id,
      fileName: req.file.originalname,
      skills: analysis.skills,
      skills_count: analysis.skills_count,
      experience_years: analysis.experience_years,
      education: analysis.education,
      match_percentage: analysis.match_percentage,
      missing_keywords: analysis.missing_keywords,
      predicted_role: analysis.predicted_role,
      top_roles: analysis.top_roles,
      score: analysis.score
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

exports.getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    res.json(resume);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};