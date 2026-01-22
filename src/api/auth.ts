import type { User } from './types'
import { httpRequest } from '@/api/request/http'

export const devLogin = () => {
  return httpRequest.Post<string>('auth/doLogin/dev')
}

export const doLogin = (code: string) => {
  console.log('doLogin ===>', code)
  return httpRequest.Post<string>(
    '/auth/doLogin/wechat',
    undefined,
    {
      params: { code },
      // meta: { ignoreAuth: true },
    },
  )
}

export const doComplete = (id: string, name: string) => {
  return httpRequest.Post<void>(
    '/auth/doComplete/wechat',
    { id, name },
    {
      meta: { sign: true },
    },
  )
}

export const ping = () => {
  return httpRequest.Post<boolean>(
    '/auth/ping',
    undefined,
    {
      meta: { sign: true },
    },
  )
}

export const userinfo = () => {
  return httpRequest.Post<User>('/auth/user_info')
}
