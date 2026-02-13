// This is a placeholder for generated types
// Run npm run generate to generate types from OpenAPI

export interface User {
  id: string
  email: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface Project {
  id: string
  name: string
  ownerId: string
  createdAt: string
  updatedAt: string
}

export interface Task {
  id: string
  title: string
  status: 'todo' | 'in_progress' | 'done'
  projectId: string
  createdAt: string
  updatedAt: string
}

export const API_BASE_PATH = '/api/v1'
