export interface Token {
  token: string
  expired: number
}

export interface User {
  id: string
  name?: string
  active?: boolean
  roles?: string[]
}

export interface Role {
  id: string
  name?: string
  code?: string
}

export interface Config {
  id: string
  name?: string
  code?: string
  value?: string
}

export interface Log {
  id: string
  type: string
  isSuccess: boolean
  method: string
  api: string
  businessId: string
  parameters: string
  result: string
  exception: string
  ip: string
  logTime: string
}

export interface Room {
  id?: string
  name?: string
  rent?: number
  status?: number
}

export interface Bill {
  id?: string
  roomId?: string
  rent?: number
  water?: number
  waterUsage?: number
  waterPrice?: number
  waterFee?: number
  electric?: number
  electricUsage?: number
  electricPrice?: number
  electricFee?: number
  managementPrice?: number
  garbagePrice?: number
  extPrice?: number
  extRemark?: string
  sumPrice?: number
  status?: number
  isPaid?: boolean
  createTime?: string
}

export interface Statistics {
  empty?: number
  total?: number
}

export interface Notification {
  room?: number
  price?: number
  date?: string
}

export interface Income {
  room?: number
  price?: number
  date?: string
}

export interface Index {
  statistics: Statistics
  notification: Notification[]
  income: Income[]
}
