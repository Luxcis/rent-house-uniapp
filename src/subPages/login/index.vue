<script setup lang="ts">
definePage({
  name: 'login',
  style: {
    navigationBarTitleText: '登录',
    navigationStyle: 'custom',
  },
})
const { setToken, setUser } = useAuthStore()
const router = useRouter()
const { prompt } = useMessage()

const loading = ref(false)

const handler = () => {
  loading.value = true
  uni.login({
    success({ code }) {
      doLogin(code).then((token) => {
        setToken(token)
        userInfo().then((user) => {
          setUser(user)
          if (!user.name) {
            // 完善信息
            prompt({
              title: '请输入用户名',
              inputType: 'nickname',
              inputValidate: val => isNotBlank(val as string),
              inputError: '请输入用户名',
            }).then((res) => {
              if (res.action === 'confirm') {
                const value = res.value as string
                doComplete(user.id, value.trim())
                  .then(() => router.pushTab({ name: 'index' }))
                  .catch(() => {
                    loading.value = false
                  })
              }
            })
          }
          else {
            router.pushTab({ name: 'index' })
          }
        })
      }).catch(() => {
        loading.value = false
      })
    },
    error: () => {
      loading.value = false
    },
  })
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
