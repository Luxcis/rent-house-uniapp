<script setup lang="ts">
import type { Config, Log, User } from '@/api/types'

definePage({
  name: 'manage',
  layout: 'tabbar',
  style: {
    navigationBarTitleText: '管理',
  },
})

const { prompt } = useMessage()
const { success: showSuccess } = useToast()

const { data: users, send: refreshUser } = useRequest(userList)
const { data: roles } = useRequest(roleList, { initialData: [] })
const { data: configs, send: refreshConfig } = useRequest(configList)

const state = ref<'loading' | 'error' | 'finished'>('loading')
const logs = ref<Log[]>([])
const { send: loadLogs } = useRequest(id => logList(id))
  .onSuccess(({ data }) => {
    logs.value.push(...data)
    if (data.length === 0 || data.length < 10)
      state.value = 'finished'
  })

const handleEditConfig = (config: Config) => {
  prompt({
    title: config.name,
    inputValue: config.value,
    inputPlaceholder: `请输入${config.name}`,
    inputValidate: (value) => {
      console.log(value, typeof value)
      return true
    },
    inputError: `请输入${config.name}`,
    inputType: 'number',
  }).then((obj) => {
    updateConfigValue(config.code as string, Number(obj.value).toFixed(2)).then(() => {
      refreshConfig()
    })
  }).catch(() => {})
}

const show = ref(false)
const model = ref<{ id?: string, roles?: string[] }>({ id: '', roles: [] })
const submit = () => {
  userBindRoles(model.value.id as string, model.value.roles ?? [])
    .then(() => {
      showSuccess({ msg: '保存成功' })
      refreshUser()
      show.value = false
    })
}

const showRoleBind = (user: User) => {
  // updateForm({ id: user.id, roles: user.roles })
  model.value = { id: user.id, roles: user.roles }
  show.value = true
}

const handleActive = (user: User) => {
  userStatusChange(user.id, !user.active).then(() => refreshUser())
}

onReachBottom(() => {
  if (state.value === 'loading') {
    loadLogs(logs.value[logs.value.length - 1].id)
  }
})
</script>

<template>
  <view class="box-border">
    <wd-tabs animated>
      <wd-tab title="用户">
        <view class="bg-gray-100">
          <wd-cell-group>
            <wd-cell
              v-for="(user, index) in users"
              :key="index"
              :title="user.name"
              icon="user"
              clickable
              @click="showRoleBind(user)"
            >
              <wd-tag
                :type="user.active ? 'primary' : 'danger'"
                round
                @click.stop="handleActive(user)"
              >
                {{ user.active ? '启用' : '禁用' }}
              </wd-tag>
            </wd-cell>
          </wd-cell-group>
        </view>
      </wd-tab>
      <wd-tab title="角色">
        <view class="bg-gray-100">
          <wd-cell-group>
            <wd-cell
              v-for="(role, index) in roles"
              :key="index"
              :title="role.name"
              :value="role.code"
              icon="hourglass"
            />
          </wd-cell-group>
        </view>
      </wd-tab>
      <wd-tab title="配置">
        <view class="bg-gray-100">
          <wd-cell-group>
            <wd-cell
              v-for="(config, index) in configs"
              :key="index"
              :title="config.name"
              :value="config.value"
              icon="link"
              clickable
              @click="handleEditConfig(config)"
            />
          </wd-cell-group>
        </view>
      </wd-tab>
      <wd-tab title="日志">
        <view class="bg-gray-100 py-3">
          <wd-card
            v-for="(log, index) in logs"
            :key="index"
          >
            <template #title>
              <view class="flex items-center gap-2">
                <wd-tag
                  type="primary"
                  custom-class="text-xs!"
                >
                  {{ log.type }}
                </wd-tag>
                <wd-tag
                  :type="log.isSuccess ? 'success' : 'danger'"
                  plain
                  custom-class="text-xs!"
                >
                  {{ log.isSuccess ? '成功' : '失败' }}
                </wd-tag>
                <text class="flex-1 text-right text-gray-400">
                  {{ log.logTime }}
                </text>
              </view>
            </template>
            <template #default>
              <view class="pb-4">
                <wd-tag
                  custom-class="text-xs!"
                  mark
                  plain
                >
                  {{ log.method }}
                </wd-tag>
                <text class="ml-2">
                  {{ log.api }}
                </text>
              </view>
            </template>
          </wd-card>
          <wd-loadmore :state="state" />
        </view>
      </wd-tab>
    </wd-tabs>
  </view>
  <wd-popup
    v-model="show"
    custom-class="rounded-xl"
    position="bottom"
    safe-area-inset-bottom
    lock-scroll
    :z-index="999"
  >
    <view class="flex flex-col">
      <view class="h-10 flex items-center">
        <wd-button
          type="text"
          custom-class="text-base! text-red-600! px-3!"
          @click="show = false"
        >
          取消
        </wd-button>
        <text class="flex-1 text-center font-bold">
          绑定角色
        </text>
        <wd-button
          type="text"
          custom-class="text-base! px-3!"
          @click="submit"
        >
          提交
        </wd-button>
      </view>
      <view class="flex items-center p-5">
        <wd-checkbox-group
          v-model="model.roles"
          size="large"
        >
          <wd-checkbox
            v-for="(role, index) in roles"
            :key="index"
            :model-value="role.code"
          >
            {{ role.name }}
          </wd-checkbox>
        </wd-checkbox-group>
      </view>
    </view>
  </wd-popup>
</template>
