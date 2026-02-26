// Import the generated components type
import type { components } from './generated/types';

// Re‑export the types from components.schemas
export type User = components['schemas']['User'];
export type Project = components['schemas']['Project'];
export type Task = components['schemas']['Task'];
export type RegisterRequest = components['schemas']['RegisterRequest'];
export type LoginRequest = components['schemas']['LoginRequest'];
export type CreateProjectRequest = components['schemas']['CreateProjectRequest'];
export type UpdateProjectRequest = components['schemas']['UpdateProjectRequest'];
export type CreateTaskRequest = components['schemas']['CreateTaskRequest'];
export type UpdateTaskRequest = components['schemas']['UpdateTaskRequest'];
export type Error = components['schemas']['Error'];
export type ValidationError = components['schemas']['ValidationError'];
export type HealthResponse = components['schemas']['HealthResponse'];
export type PaginatedProjects = components['schemas']['PaginatedProjects'];
export type PaginatedTasks = components['schemas']['PaginatedTasks'];

// Optionally export the components type itself
export type { components };

// Constants
export const OPENAPI_VERSION = '1.0.0';
export const API_BASE_PATH = '/api/v1';
