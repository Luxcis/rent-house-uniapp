export enum BillStatus {
  CHECKED_IN, // 入住
  RENEW, // 续租
  CHECKED_OUT, // 退租
}

export const BillStatusName = (status?: number): string => {
  switch (status) {
    case BillStatus.CHECKED_IN:
      return '入住'
    case BillStatus.RENEW:
      return '续租'
    case BillStatus.CHECKED_OUT:
      return '退租'
    default:
      return '未知'
  }
}

export const BillStatusColor = (status?: number): 'primary' | 'success' | 'danger' | 'default' => {
  switch (status) {
    case BillStatus.CHECKED_IN:
      return 'success'
    case BillStatus.RENEW:
      return 'primary'
    case BillStatus.CHECKED_OUT:
      return 'danger'
    default:
      return 'default'
  }
}
