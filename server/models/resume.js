const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  fileName: String,
  extractedText: String,
  skills: [String],
  experience: String,
  education: String,
  analysisResult: {
    overallScore: Number,
    skillsScore: Number,
    experienceScore: Number,
    educationScore: Number,
    matchPercentage: Number,
    missingKeywords: [String],
    suggestions: [String],
    predictedRole: String,
    grade: String,
    emoji: String
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Resume', resumeSchema);