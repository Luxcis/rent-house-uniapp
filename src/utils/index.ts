/**
 * 获取当前页面路径
 * @returns 当前页面路径
 */
export function getCurrentPath() {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  return currentPage.route || ''
}

export const isNumber = (value: any) => {
  if (typeof value === 'number') {
    return true
  }
  else if (typeof value === 'string') {
    const reg = /^\d+(?:\.\d+)?$/
    return reg.test(value)
  }
  else {
    return false
  }
}
