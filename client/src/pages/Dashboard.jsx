import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
      
      // Save result to localStorage and go to results page
      localStorage.setItem('analysisResult', JSON.stringify(res.data))
      navigate('/results')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">
          📄 Resume Analyzer
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">
            Welcome, <strong>{user?.name}</strong>
          </span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Analyze Your Resume 🚀
          </h2>
          <p className="text-gray-500 mt-2">
            Upload your resume and paste a job description to get your match score
          </p>
        </div>

        {/* Upload Card */}
        <div className="bg-white rounded-2xl shadow-md p-8">

          {/* Drag & Drop Area */}
          <div
            onDrop={handleFileDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all
              ${dragOver ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'}`}
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
                <p className="text-4xl mb-2">📄</p>
                <p className="text-green-600 font-semibold">{file.name}</p>
                <p className="text-gray-400 text-sm mt-1">Click to change file</p>
              </div>
            ) : (
              <div>
                <p className="text-4xl mb-2">☁️</p>
                <p className="text-gray-600 font-semibold">
                  Drag & drop your resume here
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  or click to browse — PDF only
                </p>
              </div>
            )}
          </div>

          {/* Job Description */}
          <div className="mt-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Paste Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              rows={6}
              className="w-full border border-gray-300 rounded-xl p-4 text-gray-700 
                focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-center">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`mt-6 w-full py-4 rounded-xl text-white font-bold text-lg transition-all
              ${loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700'}`}
          >
            {loading ? '⏳ Analyzing...' : '🔍 Analyze Resume'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard