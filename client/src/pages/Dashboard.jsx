import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Loader from '../components/Loader'
import { useAuth } from '../context/AuthContext'
import { uploadResume } from '../services/api'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [jobDescription, setJobDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleFileDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile?.type === 'application/pdf') {
      setFile(droppedFile)
      setError('')
    } else {
      setError('Please upload a PDF file only!')
    }
  }

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile?.type === 'application/pdf') {
      setFile(selectedFile)
      setError('')
    } else {
      setError('Please upload a PDF file only!')
    }
  }

  const handleSubmit = async () => {
    if (!file) return setError('Please upload your resume!')
    if (!jobDescription.trim()) return setError('Please enter job description!')

    setLoading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('resume', file)
      formData.append('jobDescription', jobDescription)

      const res = await uploadResume(formData)
      localStorage.setItem('analysisResult', JSON.stringify(res.data))
      navigate('/results')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Loader Overlay */}
      {loading && <Loader message="Running ML analysis on your resume..." />}

      {/* Navbar */}
      <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📄</span>
          <h1 className="text-2xl font-bold text-indigo-600">
            Resume Analyzer
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-600 hidden md:block">
            👋 <strong>{user?.name}</strong>
          </span>
          <button
            onClick={() => navigate('/history')}
            className="px-4 py-2 border border-indigo-600 
              text-indigo-600 rounded-lg hover:bg-indigo-50"
          >
            📋 History
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white 
              rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800">
            Analyze Your Resume 🚀
          </h2>
          <p className="text-gray-500 mt-3 text-lg">
            Upload your resume and paste a job description to get 
            AI-powered insights
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'ML Models', value: '4', icon: '🤖' },
            { label: 'Skills Detected', value: '50+', icon: '✅' },
            { label: 'Accuracy', value: '100%', icon: '🎯' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl p-4 text-center shadow-sm">
              <p className="text-2xl">{stat.icon}</p>
              <p className="text-xl font-bold text-indigo-600">{stat.value}</p>
              <p className="text-gray-500 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Upload Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Drag & Drop */}
          <div
            onDrop={handleFileDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            className={`border-2 border-dashed rounded-xl p-10 text-center 
              cursor-pointer transition-all
              ${dragOver 
                ? 'border-indigo-500 bg-indigo-50' 
                : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'}`}
            onClick={() => document.getElementById('fileInput').click()}
          >
            <input
              id="fileInput"
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
            {file ? (
              <div>
                <p className="text-5xl mb-3">📄</p>
                <p className="text-green-600 font-bold text-lg">{file.name}</p>
                <p className="text-gray-400 text-sm mt-1">
                  ✅ Ready to analyze — click to change
                </p>
              </div>
            ) : (
              <div>
                <p className="text-5xl mb-3">☁️</p>
                <p className="text-gray-700 font-semibold text-lg">
                  Drag & drop your resume here
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  or click to browse — PDF only (max 5MB)
                </p>
              </div>
            )}
          </div>

          {/* Job Description */}
          <div className="mt-6">
            <label className="block text-gray-700 font-semibold mb-2">
              📋 Paste Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here for best results..."
              rows={6}
              className="w-full border border-gray-300 rounded-xl p-4 
                text-gray-700 focus:outline-none focus:ring-2 
                focus:ring-indigo-400 resize-none"
            />
            <p className="text-gray-400 text-sm mt-1">
              {jobDescription.length} characters
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 
              text-red-600 rounded-xl text-center">
              ⚠️ {error}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`mt-6 w-full py-4 rounded-xl text-white font-bold 
              text-lg transition-all shadow-lg
              ${loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl'}`}
          >
            {loading ? '⏳ Analyzing...' : '🔍 Analyze Resume'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard