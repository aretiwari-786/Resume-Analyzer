import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
})

// Add token to every request automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token')
  if (token) {
    req.headers.Authorization = `Bearer ${token}`
  }
  return req
})

export const uploadResume = (formData) => 
  API.post('/resume/upload', formData)

export const getMyResumes = () => 
  API.get('/resume/my-resumes')

export const getResumeById = (id) => 
  API.get(`/resume/${id}`)

export default API