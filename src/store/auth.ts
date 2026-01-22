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
    setUser(user?: User) {
      if (user) {
        this.user = user
        this.roles = user.roles ?? []
      }
      else {
        return userinfo().then((res) => {
          this.user = res
          this.roles = res.roles ?? []
          if (!res.name) {
            if (this.isWechatMp) {
              wx.getUserProfile({
                desc: '用于完善用户资料',
                success: (profile) => {
                  const name = profile.userInfo.nickName
                  doComplete(res.id, name)
                },
              })
            }
            else {
              console.error('请使用微信小程序访问')
            }
          }
        })
      }
    },
    hasRole(role: string): boolean {
      return this.roles.includes(role)
    },
  },
})
