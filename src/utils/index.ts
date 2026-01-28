/**
 * 获取当前页面路径
 * @returns 当前页面路径
 */
export function getCurrentPath() {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  return currentPage.route || ''
}

export const formatIfNumber = (value: string): string => {
  const reg = /^\d+\.\d+$/
  if (reg.test(value)) {
    return Number(value).toFixed(2)
  }
  else {
    return value
  }
}

export const isNotBlank = (value?: string): boolean => {
  return (value ?? '').trim().length > 0
}
