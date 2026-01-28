<script setup lang="ts">
import type { Room } from '@/api/types'
import { useForm } from 'alova/client'
import { RoomStatus, RoomStatusColor, RoomStatusName } from './enum'

definePage({
  name: 'room',
  layout: 'tabbar',
  style: {
    navigationBarTitleText: '房间',
    enablePullDownRefresh: true,
  },
})
const { isDark, themeVars } = useTheme()
const { success: showSuccess, error: showError } = useToast()

const { data, send, onComplete } = useRequest(roomList(), { immediate: false, force: true })

const handleDelete = (id: string) => {
  console.log('handleDelete', id)
}

const show = ref(false)

const form = ref()
const {
  loading: isSubmitting,
  form: model,
  send: submit,
  updateForm,
  reset,
} = useForm<any, Room, any>(
  formData => saveRoom(formData),
  {
    initialForm: { status: RoomStatus.FOR_RENT },
    resetAfterSubmiting: true,
  },
).onSuccess(() => {
  showSuccess({ msg: '保存成功' })
  send()
  show.value = false
})

const showPopup = (data?: Room) => {
  if (data) {
    updateForm({
      id: data.id,
      name: data.name,
      rent: data.rent,
      status: data.status,
    })
  }
  else {
    reset()
  }
  show.value = true
}

const handleSubmit = () => {
  form.value
    .validate()
    .then((res: any) => {
      if (res.valid) {
        submit()
      }
    })
    .catch(() => {
      showError({ msg: '请填写完整' })
    })
}

onShow(() => send())
onComplete(() => uni.stopPullDownRefresh())
onPullDownRefresh(() => send())
</script>

<template>
  <wd-config-provider :theme-vars="themeVars">
    <view
      :class="{ 'dark-mode': isDark }"
      class="box-border py-3"
    >
      <demo-block transparent>
        <wd-cell-group
          custom-class="rounded-2! overflow-hidden"
          border
        >
          <wd-swipe-action
            v-for="(room, index) in data"
            :key="index"
          >
            <wd-cell
              :title="`${room.name} 室`"
              :label="`租金: ¥${room.rent}`"
              is-link
              @click="showPopup(room)"
            >
              <template #default>
                <wd-tag
                  :type="RoomStatusColor(room.status ?? -1)"
                  custom-class="text-xs!"
                >
                  {{ RoomStatusName(room.status ?? -1) }}
                </wd-tag>
              </template>
            </wd-cell>
            <template #right>
              <view class="h-full">
                <view
                  class="h-full flex items-center bg-red-600 px-3 text-white"
                  @click="handleDelete(room.id as string)"
                >
                  删除
                </view>
              </view>
            </template>
          </wd-swipe-action>
        </wd-cell-group>
      </demo-block>
      <demo-block transparent>
        <wd-button
          plain
          block
          :round="false"
          @click="showPopup()"
        >
          添加房间
        </wd-button>
      </demo-block>
    </view>

    <wd-popup
      v-model="show"
      custom-class="rounded-xl"
      position="bottom"
      safe-area-inset-bottom
      lock-scroll
      :close-on-click-modal="false"
      :z-index="999"
    >
      <view class="flex flex-col">
        <view class="h-10 flex items-center">
          <wd-button
            type="text"
            custom-class="text-base! text-red-600! px-3!"
            :disabled="isSubmitting"
            @click="show = false"
          >
            取消
          </wd-button>
          <text class="flex-1 text-center font-bold">
            添加房间
          </text>
          <wd-button
            type="text"
            custom-class="text-base! px-3!"
            :disabled="isSubmitting"
            @click="handleSubmit"
          >
            提交
          </wd-button>
        </view>
        <view class="flex items-center">
          <wd-form
            ref="form"
            :model="model"
            custom-class="flex-1"
          >
            <wd-cell-group border>
              <wd-input
                v-model="model.name"
                label="房间名称"
                label-width="90px"
                prop="name"
                clearable
                placeholder="请输入房间名称"
                :cursor-spacing="100"
                confirm-type="next"
                :rules="[{ required: true, message: '请填写房间名称' }]"
              />
              <wd-input
                v-model="model.rent"
                label="基础租金"
                label-width="90px"
                prop="rent"
                clearable
                placeholder="请输入基础租金"
                inputmode="numeric"
                :cursor-spacing="50"
                confirm-type="next"
                :rules="[{ required: true, message: '请填写基础租金' }]"
              />
              <wd-radio-group
                v-model="model.status"
                shape="dot"
                cell
                inline
                class="flex justify-between"
              >
                <wd-radio :value="RoomStatus.FOR_RENT">
                  空置中
                </wd-radio>
                <wd-radio :value="RoomStatus.RENTED">
                  已出租
                </wd-radio>
                <wd-radio :value="RoomStatus.STOP_RENT">
                  暂停出租
                </wd-radio>
              </wd-radio-group>
            </wd-cell-group>
          </wd-form>
        </view>
      </view>
    </wd-popup>
  </wd-config-provider>
</template>
