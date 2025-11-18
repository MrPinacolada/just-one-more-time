import type { UserService } from '~/utils/api/userService'

declare module '#app' {
  interface NuxtApp {
    $api: {
      users: UserService
    }
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $api: {
      users: UserService
    }
  }
}

export {}