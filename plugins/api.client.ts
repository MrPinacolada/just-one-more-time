import { UserService } from '~/utils/api/userService'

export default defineNuxtPlugin(() => {
  const baseURL = process.env.API_BASE_URL || 'http://localhost:3001/api'
  
  const userService = new UserService(baseURL)
  
  return {
    provide: {
      api: {
        users: userService
      }
    }
  }
})