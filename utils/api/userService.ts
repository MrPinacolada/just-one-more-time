import type { User, CreateUser, UpdateUser, UserListParams, UserListResponse } from '~/types/user'
import { HttpClient } from './httpClient'

class UserService {
  private httpClient: HttpClient

  constructor(baseURL: string) {
    this.httpClient = new HttpClient(baseURL)
  }

  async getUsers(params?: UserListParams): Promise<UserListResponse> {
    try {
      return await this.httpClient.post<UserListResponse>('/users', params || {})
    } catch (error: any) {
      throw new Error(`Не удалось загрузить список пользователей: ${error.message}`)
    }
  }

  async getUser(id: number): Promise<User> {
    try {
      return await this.httpClient.get<User>(`/users/${id}`)
    } catch (error: any) {
      throw new Error(`Не удалось загрузить данные пользователя: ${error.message}`)
    }
  }

  async createUser(user: CreateUser): Promise<User> {
    try {
      const userData = {
        ...user,
        lastVisitedAt: user.lastVisitedAt || Date.now()
      }
      return await this.httpClient.post<User>('/users', userData)
    } catch (error: any) {
      throw new Error(`Не удалось создать пользователя: ${error.message}`)
    }
  }

  async updateUser(user: UpdateUser): Promise<User> {
    try {
      return await this.httpClient.put<User>(`/users/${user.id}`, user)
    } catch (error: any) {
      throw new Error(`Не удалось обновить данные пользователя: ${error.message}`)
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      await this.httpClient.delete<void>(`/users/${id}`)
    } catch (error: any) {
      throw new Error(`Не удалось удалить пользователя: ${error.message}`)
    }
  }
}

export { UserService }