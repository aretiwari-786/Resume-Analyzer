import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444']

const Results = () => {
  const [result, setResult] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const data = localStorage.getItem('analysisResult')
    if (!data) {
      navigate('/dashboard')
    } else {
      setResult(JSON.parse(data))
    }
  }, [])

  if (!result) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500 text-xl">Loading...</p>
    </div>
  )

  const scoreData = [
    { name: 'Skills', value: result.score.skills, max: 30 },
    { name: 'Experience', value: result.score.experience, max: 25 },
    { name: 'Education', value: result.score.education, max: 20 },
    { name: 'Job Match', value: result.score.job_match, max: 25 },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">
          📄 Resume Analyzer
        </h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          ← Analyze Another
        </button>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Your Resume Analysis 📊
        </h2>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Overall Score */}
          <div className="bg-white rounded-2xl shadow-md p-6 text-center">
            <p className="text-gray-500 text-sm mb-2">Overall Score</p>
            <p className="text-5xl font-bold text-indigo-600">
              {result.score.total}
            </p>
            <p className="text-gray-400 text-sm">out of 100</p>
            <p className="text-2xl mt-2">{result.score.emoji}</p>
            <p className="font-semibold text-gray-700 mt-1">
              {result.score.grade}
            </p>
          </div>

          {/* Match Percentage */}
          <div className="bg-white rounded-2xl shadow-md p-6 text-center">
            <p className="text-gray-500 text-sm mb-2">Job Match</p>
            <p className="text-5xl font-bold text-green-500">
              {result.match_percentage}%
            </p>
            <div className="mt-3 bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-500 h-3 rounded-full"
                style={{ width: `${result.match_percentage}%` }}
              />
            </div>
          </div>

          {/* Predicted Role */}
          <div className="bg-white rounded-2xl shadow-md p-6 text-center">
            <p className="text-gray-500 text-sm mb-2">Predicted Role</p>
            <p className="text-xl font-bold text-indigo-600 mt-3">
              {result.predicted_role}
            </p>
            <div className="mt-3 space-y-1">
              {result.top_roles.map((role, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-gray-600">{role.role}</span>
                  <span className="text-indigo-500 font-semibold">
                    {role.confidence}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Score Breakdown Chart */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Score Breakdown 📈
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={scoreData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {scoreData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Skills + Missing Keywords */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Skills Found */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              ✅ Skills Found ({result.skills_count})
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-green-100 text-green-700 
                    rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Missing Keywords */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              ❌ Missing Keywords
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.missing_keywords.map((keyword, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-red-100 text-red-700 
                    rounded-full text-sm font-medium"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Education + Experience */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-md p-6 text-center">
            <p className="text-gray-500 text-sm">Education Level</p>
            <p className="text-2xl font-bold text-indigo-600 mt-2">
              🎓 {result.education}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 text-center">
            <p className="text-gray-500 text-sm">Experience</p>
            <p className="text-2xl font-bold text-indigo-600 mt-2">
              💼 {result.experience_years === 0 ? 'Fresher' : `${result.experience_years} Years`}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Results