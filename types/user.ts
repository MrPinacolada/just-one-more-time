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
  sortBy?: keyof User
  sortOrder?: 'asc' | 'desc'
}

export interface Pagination {
  page: number
  limit: number
  total: number
}

export interface UserListParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: keyof User
  sortOrder?: 'asc' | 'desc'
}

export interface UserListResponse {
  users: User[]
  pagination: Pagination
}

export interface UserAPI {
  getUsers(params?: UserListParams): Promise<UserListResponse>
  getUser(id: number): Promise<User>
  createUser(user: CreateUser): Promise<User>
  updateUser(user: UpdateUser): Promise<User>
  deleteUser(id: number): Promise<void>
}