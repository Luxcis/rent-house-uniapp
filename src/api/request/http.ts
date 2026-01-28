import type { uniappRequestAdapter } from '@alova/adapter-uniapp'
import AdapterUniapp from '@alova/adapter-uniapp'
import { createAlova } from 'alova'
import { createServerTokenAuthentication } from 'alova/client'
import VueHook from 'alova/vue'
import { sha256 } from 'js-sha256'
import router from '@/router'
// import { toLoginPage } from '@/utils/toLoginPage'
import { ContentTypeEnum, ResultEnum, ShowMessage } from './enum'

// 通用响应格式（兼容 msg + message 字段）
interface IResponse<T = any> {
  code: number
  data: T
  message: string
  success: boolean
  timestamp: string
}

// 配置动态Tag
export const API_DOMAINS = {
  DEFAULT: import.meta.env.VITE_GLOB_API_URL_PREFIX,
}

/**
 * 创建请求实例
 */
const { onAuthRequired, onResponseRefreshToken } = createServerTokenAuthentication<
  typeof VueHook,
  typeof uniappRequestAdapter
>({
  // 如果下面拦截不到，请使用 refreshTokenOnSuccess
  refreshTokenOnError: {
    isExpired: (error) => {
      return error.response.status === ResultEnum.Unauthorized
    },
    handler: async () => {
      router.replaceAll({ name: 'login' })
      throw new Error('跳转登录页面')
    },
  },
  refreshTokenOnSuccess: {
    isExpired: (response) => {
      const {
        statusCode,
        data: rawData,
      } = response as UniNamespace.RequestSuccessCallbackResult
      const { code } = rawData as IResponse
      return statusCode === ResultEnum.Unauthorized || code === ResultEnum.Unauthorized
    },
    handler: async () => {
      router.replaceAll({ name: 'login' })
      throw new Error('跳转登录页面')
    },
  },
})

const buildSignature = (data: Record<string, any>): Record<string, any> => {
  const nonce = randomString(32)
  const timestamp = Date.now()
  const obj: Record<string, any> = { ...data, nonce, timestamp }
  // const token = 'getToken()'
  const keys = Object.keys(obj).sort()
  let signStr = ''
  for (const key of keys) {
    let value = obj[key]
    if (value === null || value === undefined || value === '' || typeof value === 'object') {
      continue
    }
    value = formatIfNumber(value)
    signStr += `${key}${String(value)}`
  }
  const { token } = useAuthStore()
  console.log('签名内容:', `${signStr}${token}`)
  const signature = sha256(`${signStr}${token}`)
  return { ...obj, signature }
}

/**
 * alova 请求实例
 */
const alovaInstance = createAlova({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  ...AdapterUniapp(),
  timeout: 5000,
  statesHook: VueHook,
  cacheFor: null,

  // 请求拦截器
  beforeRequest: onAuthRequired((method) => {
    // 设置默认 Content-Type
    method.config.headers = {
      ContentType: ContentTypeEnum.JSON,
      Accept: 'application/json, text/plain, */*',
      ...method.config.headers,
    }

    const { config } = method
    const ignoreAuth = !config.meta?.ignoreAuth
    console.log('忽略认证===>', !ignoreAuth)
    // 处理认证信息   自行处理认证问题
    if (ignoreAuth) {
      config.meta = {
        authRole: 'refreshToken',
        ...config.meta,
      }
      // const token = 'getToken()'
      const { token } = useAuthStore()
      if (token) {
        // throw new Error('[请求错误]：未登录')
        method.config.headers.Authorization = `Bearer ${token}`
      }
    }

    // 处理动态域名
    if (config.meta?.domain) {
      method.baseURL = config.meta.domain
      console.log('当前域名', method.baseURL)
    }

    // 处理签名
    const sign = config.meta.sign ?? false
    console.log('数据签名===>', sign)
    if (sign) {
      method.data = buildSignature(method.data as Record<string, any>)
    }
  }),

  // 响应拦截器
  responded: onResponseRefreshToken((response, method) => {
    const { config } = method
    const { requestType } = config
    const {
      statusCode,
      data: rawData,
      errMsg,
    } = response as UniNamespace.RequestSuccessCallbackResult

    // 处理特殊请求类型（上传/下载）
    if (requestType === 'upload' || requestType === 'download') {
      return response
    }

    // 处理 HTTP 状态码错误
    if (statusCode !== 200) {
      const errorMessage = ShowMessage(statusCode) || `HTTP请求错误[${statusCode}]`
      console.error('errorMessage===>', errorMessage)
      uni.showToast({
        title: errorMessage,
        icon: 'error',
      })
      throw new Error(`${errorMessage}：${errMsg}`)
    }

    // 处理业务逻辑错误
    const { code, message, data } = rawData as IResponse
    // 0和200当做成功都很普遍，这里直接兼容两者，见 ResultEnum
    if (code !== ResultEnum.Success0) {
      if (config.meta?.toast !== false) {
        uni.showToast({
          title: message,
          icon: 'none',
        })
      }
      throw new Error(`请求错误[${code}]：${message}`)
    }
    // 处理成功响应，返回业务数据
    return data
  }),
})

export const httpRequest = alovaInstance
