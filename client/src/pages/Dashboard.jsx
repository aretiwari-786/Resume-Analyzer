import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f0f2f5'
    }}>
      {/* Navbar */}
      <div style={{
        backgroundColor: 'white',
        padding: '16px 32px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ color: '#4F46E5', margin: 0 }}>
          📄 Resume Analyzer
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: '#555' }}>
            Welcome, <strong>{user?.name}</strong>
          </span>
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
              backgroundColor: '#ff4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '800px',
        margin: '40px auto',
        padding: '0 20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#333', marginBottom: '16px' }}>
            🎉 Welcome to Resume Analyzer!
          </h2>
          <p style={{ color: '#555', fontSize: '16px' }}>
            Upload your resume and paste a job description to get your match score, 
            skill analysis, and AI-powered suggestions!
          </p>
          <div style={{
            marginTop: '32px',
            padding: '20px',
            backgroundColor: '#f0f0ff',
            borderRadius: '8px'
          }}>
            <p style={{ color: '#4F46E5', fontWeight: 'bold' }}>
              🚀 Resume upload feature coming in Day 4!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard