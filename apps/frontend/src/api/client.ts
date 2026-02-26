import axios from 'axios'
import type { 
  User, 
  Project, 
  Task, 
  LoginRequest, 
  RegisterRequest,
  CreateProjectRequest,
  UpdateProjectRequest,
  CreateTaskRequest,
  UpdateTaskRequest,
  Error as ApiError
} from '@hagerehiwotlabs/contracts'

// Define pagination type to avoid using any
interface Pagination {
  total: number
  page: number
  limit: number
  pages: number
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Client-Version': '1.0.0'
  },
  timeout: 10000,
  validateStatus: (status) => status >= 200 && status < 500
})

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  // Add request ID for tracing
  config.headers['X-Request-ID'] = crypto.randomUUID()
  
  return config
}, (error) => {
  return Promise.reject(error)
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      
      // Only redirect if not on login/register pages
      if (!window.location.pathname.includes('/auth')) {
        window.location.href = '/login?session=expired'
      }
    }
    
    if (error.response?.status === 429) {
      console.warn('Rate limited, please wait...')
    }
    
    // Enhanced error logging
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers
    })
    
    return Promise.reject(error)
  }
)

// Type-safe API methods
export const authAPI = {
  login: (data: LoginRequest) => 
    api.post<{ token: string; user: User }>('/auth/login', data),
  
  register: (data: RegisterRequest) => 
    api.post<{ token: string; user: User }>('/auth/register', data),
  
  logout: () => 
    api.post('/auth/logout'),
  
  getCurrentUser: () => 
    api.get<User>('/auth/me'),
}

export const projectsAPI = {
  getAll: (params?: { page?: number; limit?: number }) => 
    api.get<{ data: Project[]; pagination: Pagination }>('/projects', { params }),
  
  getById: (id: string) => 
    api.get<Project>(`/projects/${id}`),
  
  create: (data: CreateProjectRequest) => 
    api.post<Project>('/projects', data),
  
  update: (id: string, data: UpdateProjectRequest) => 
    api.patch<Project>(`/projects/${id}`, data),
  
  delete: (id: string) => 
    api.delete(`/projects/${id}`),
}

export const tasksAPI = {
  getProjectTasks: (projectId: string, params?: { status?: string; page?: number; limit?: number }) => 
    api.get<{ data: Task[]; pagination: Pagination }>(`/projects/${projectId}/tasks`, { params }),
  
  create: (projectId: string, data: CreateTaskRequest) => 
    api.post<Task>(`/projects/${projectId}/tasks`, data),
  
  update: (taskId: string, data: UpdateTaskRequest) => 
    api.patch<Task>(`/tasks/${taskId}`, data),
  
  delete: (taskId: string) => 
    api.delete(`/tasks/${taskId}`),
}

// Health check
export const healthAPI = {
  check: () => api.get('/health')
}

// Error type guard – no `any` used
export function isApiError(error: unknown): error is ApiError {
  if (typeof error !== 'object' || error === null) return false
  
  const maybeError = error as Record<string, unknown>
  
  return (
    typeof maybeError.error === 'string' &&
    typeof maybeError.message === 'string' &&
    (maybeError.code === undefined || typeof maybeError.code === 'string') &&
    (maybeError.timestamp === undefined || typeof maybeError.timestamp === 'string')
  )
}

export default api
