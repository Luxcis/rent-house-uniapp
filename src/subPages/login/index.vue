<script setup lang="ts">
definePage({
  name: 'login',
  style: {
    navigationBarTitleText: '登录',
    navigationStyle: 'custom',
  },
})
const { isWechatMp, setToken, setUser } = useAuthStore()
const router = useRouter()
const isDev = import.meta.env.DEV

const loading = ref(false)

const handler = () => {
  loading.value = true
  if (isDev) {
    devLogin().then((token) => {
      setToken(token)
      setUser()
      router.pushTab({ name: 'index' })
    })
    return
  }
  if (isWechatMp) {
    wx.login({
      success: (res) => {
        doLogin(res.code).then((token) => {
          setToken(token)
          setUser()
          router.pushTab({ name: 'index' })
        })
      },
    })
  }
  else {
    console.error('请使用微信小程序访问')
  }
  loading.value = false
}
</script>

<template>
  <view class="h-[80vh] w-full flex flex-col items-center justify-center">
    <wd-avatar
      icon="user"
      shape="square"
      size="large"
    />
    <wd-button
      block
      size="large"
      custom-class="mt-5 w-2/3"
      :loading="loading"
      @click="handler"
    >
      登录
    </wd-button>
  </view>
</template>
