import type { Bill, Room } from './types'
import { httpRequest } from '@/api/request/http'

export const userStatusChange = (id: string, active: boolean) => {
  return httpRequest.Post(
    '/user/status',
    { id, active },
    {
      meta: { sign: true },
    },
  )
}

export const userBindRoles = (id: string, roles: string[]) => {
  return httpRequest.Post('/user/bindRoles', { id, roles })
}

export const updateConfigValue = (code: string, value: string) => {
  return httpRequest.Post(
    '/config/update',
    { code, value },
    {
      meta: { sign: true },
    },
  )
}

export const saveRoom = (data: Room) => {
  return httpRequest.Post(
    '/room/save',
    data,
    {
      meta: { sign: true },
    },
  )
}

export const saveBill = (data: Bill) => {
  return httpRequest.Post(
    '/bill/save',
    data,
    {
      meta: { sign: true },
    },
  )
}

export const payBill = (id: string, isPaid: boolean) => {
  return httpRequest.Post(
    '/bill/pay',
    { id, isPaid },
    {
      meta: { sign: true },
    },
  )
}
