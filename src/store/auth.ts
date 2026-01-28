import type { User } from '@/api/types'
import { defineStore } from 'pinia'

export interface AuthState {
  token?: string
  user?: User
  roles: string[]
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: undefined,
    user: undefined,
    roles: [],
  }),

  getters: {
    platform: () => uni.getSystemInfoSync().uniPlatform,
    isWechatMp(): boolean {
      return this.platform === 'mp-weixin'
    },
  },

  actions: {
    setToken(token: string) {
      this.token = token
    },
    setUser(user: User) {
      this.user = user
      this.roles = user.roles ?? []
    },
    hasRole(role: string): boolean {
      return this.roles.includes(role)
    },
  },
})
