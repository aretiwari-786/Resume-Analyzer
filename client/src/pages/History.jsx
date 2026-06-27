import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyResumes } from '../services/api'

const History = () => {
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchResumes()
  }, [])

  const fetchResumes = async () => {
    try {
      const res = await getMyResumes()
      setResumes(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'Excellent': return 'text-green-600 bg-green-100'
      case 'Good': return 'text-blue-600 bg-blue-100'
      case 'Average': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-red-600 bg-red-100'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📄</span>
          <h1 className="text-2xl font-bold text-indigo-600">
            Resume Analyzer
          </h1>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 bg-indigo-600 text-white 
            rounded-lg hover:bg-indigo-700"
        >
          ← New Analysis
        </button>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          📋 Your Analysis History
        </h2>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-indigo-600 
              border-t-transparent rounded-full animate-spin mx-auto mb-4">
            </div>
            <p className="text-gray-500">Loading your history...</p>
          </div>
        ) : resumes.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-16 text-center">
            <p className="text-6xl mb-4">📭</p>
            <p className="text-gray-600 text-xl font-semibold">
              No analyses yet!
            </p>
            <p className="text-gray-400 mt-2">
              Upload your resume to get started
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-6 px-6 py-3 bg-indigo-600 text-white 
                rounded-xl hover:bg-indigo-700"
            >
              Analyze Now
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {resumes.map((resume, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-md p-6
                hover:shadow-lg transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">📄</span>
                      <h3 className="font-bold text-gray-800 text-lg">
                        {resume.fileName}
                      </h3>
                    </div>
                    <p className="text-gray-500 text-sm">
                      🕒 {new Date(resume.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    <div className="flex gap-3 mt-3">
                      <span className="px-3 py-1 bg-indigo-100 
                        text-indigo-700 rounded-full text-sm">
                        🎯 {resume.analysisResult?.predictedRole}
                      </span>
                      <span className="px-3 py-1 bg-green-100 
                        text-green-700 rounded-full text-sm">
                        📊 {resume.analysisResult?.matchPercentage}% Match
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-3xl font-bold text-indigo-600">
                      {resume.analysisResult?.overallScore}
                    </div>
                    <div className="text-gray-400 text-sm">out of 100</div>
                    <span className={`mt-2 inline-block px-3 py-1 
                      rounded-full text-sm font-semibold
                      ${getGradeColor(resume.analysisResult?.grade)}`}>
                      {resume.analysisResult?.grade || 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Skills */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {resume.skills?.slice(0, 6).map((skill, j) => (
                    <span key={j} className="px-2 py-1 bg-gray-100 
                      text-gray-600 rounded-full text-xs">
                      {skill}
                    </span>
                  ))}
                  {resume.skills?.length > 6 && (
                    <span className="px-2 py-1 bg-gray-100 
                      text-gray-500 rounded-full text-xs">
                      +{resume.skills.length - 6} more
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default History