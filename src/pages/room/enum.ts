export enum RoomStatus {
  FOR_RENT, // 空置中
  RENTED, // 已出租
  STOP_RENT, // 暂停出租
}

export const RoomStatusName = (status: number): string => {
  switch (status) {
    case RoomStatus.FOR_RENT:
      return '空置中'
    case RoomStatus.RENTED:
      return '已出租'
    case RoomStatus.STOP_RENT:
      return '暂停出租'
    default:
      return '未知'
  }
}

export const RoomStatusColor = (status: number): 'primary' | 'success' | 'warning' | 'default' => {
  switch (status) {
    case RoomStatus.FOR_RENT:
      return 'primary'
    case RoomStatus.RENTED:
      return 'success'
    case RoomStatus.STOP_RENT:
      return 'warning'
    default:
      return 'default'
  }
}
