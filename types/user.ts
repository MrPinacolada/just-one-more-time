import { SortOrder, UserFields } from './enums'

export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  lastVisitedAt: number
}

export interface CreateUser {
  firstName: string
  lastName: string
  email: string
  lastVisitedAt?: number
}

export interface UpdateUser {
  id: number
  firstName?: string
  lastName?: string
  email?: string
  lastVisitedAt?: number
}

export interface UserFilters {
  search?: string
  sortBy?: UserFields
  sortOrder?: SortOrder
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}