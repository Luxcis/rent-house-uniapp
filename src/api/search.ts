import type { Bill, Config, Index, Log, Role, Room, User } from './types'
import { httpRequest } from '@/api/request/http'

export const userList = () => {
  return httpRequest.Get<User[]>('/user/list')
}

export const roleList = () => {
  return httpRequest.Get<Role[]>('/role/list')
}

export const configList = () => {
  return httpRequest.Get<Config[]>('/config/list')
}

export const logList = (next?: string) => {
  return httpRequest.Get<Log[]>('/log/list', { params: { next } })
}

export const roomList = () => {
  return httpRequest.Get<Room[]>('/room/list')
}

export const roomInfo = (id: string) => {
  return httpRequest.Get<Room>(`/room/${id}`)
}

export const billList = (roomId: string, next = '') => {
  return httpRequest.Get<Bill[]>('/bill/list', { params: { roomId, next } })
}

export const index = () => {
  return httpRequest.Get<Index>('/index')
}
