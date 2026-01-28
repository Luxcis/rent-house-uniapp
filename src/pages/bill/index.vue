<script setup lang="ts">
import type { Bill, Room } from '@/api/types'
import { useForm } from 'alova/client'
import { BillStatus } from './enum'

definePage({
  name: 'bill',
  layout: 'tabbar',
  style: {
    navigationBarTitleText: '账单',
    enablePullDownRefresh: true,
  },
})

const { success: showSuccess, error: showError } = useToast()

const currentRoom = ref<string>('')

const state = ref<'loading' | 'error' | 'finished'>('loading')
const bills = ref<Bill[]>([])
const { send: refreshBills, onComplete } = useRequest(
  (next?: string) => billList(currentRoom.value, next),
  {
    initialData: [],
    immediate: false,
    force: true,
  },
).onSuccess(({ data }) => {
  bills.value.push(...data)
  if (data.length === 0 || data.length < 10)
    state.value = 'finished'
})

const { data: rooms, send: refreshRooms } = useRequest(roomList(), { force: true })
  .onSuccess(({ data }) => {
    if (!currentRoom.value)
      currentRoom.value = data[0].id as string
    refreshBills()
  })

const handleConfirm = (data: any) => {
  currentRoom.value = data.value
  uni.startPullDownRefresh()
}

const showAction = ref(false)
const actions = ref()

const showForm = ref(false)

const form = ref()
const {
  loading: isSubmitting,
  form: model,
  send: submit,
  reset,
  updateForm,
} = useForm<any, Bill, any>(
  formData => saveBill(formData),
  {
    initialForm: {},
    resetAfterSubmiting: true,
  },
).onSuccess(() => {
  showSuccess({ msg: '保存成功' })
  uni.startPullDownRefresh()
  showForm.value = false
})

const handleShowAction = () => {
  roomInfo(currentRoom.value).then((res) => {
    showAction.value = true
    actions.value = [
      {
        name: '入住',
        disabled: res.status !== 0,
        status: BillStatus.CHECKED_IN,
      },
      {
        name: '续租',
        disabled: res.status !== 1,
        status: BillStatus.RENEW,
      },
      {
        name: '退租',
        color: res.status !== 1 ? '' : '#ef4444',
        disabled: res.status !== 1,
        status: BillStatus.CHECKED_OUT,
      },
    ]
  })
}

const handleSelectAction = (obj: any) => {
  console.log(obj.item)
  reset()
  updateForm({
    roomId: currentRoom.value,
    status: obj.item.status,
  })
  showForm.value = true
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

onComplete(() => uni.stopPullDownRefresh())
onPullDownRefresh(() => {
  bills.value = []
  refreshRooms()
})

onReachBottom(() => {
  if (state.value === 'loading') {
    refreshBills(bills.value[bills.value.length - 1].id)
  }
})
</script>

<template>
  <view class="box-border">
    <wd-sticky>
      <wd-row custom-class="w-screen">
        <wd-col :span="18">
          <wd-picker
            v-model="currentRoom"
            class="border"
            align-right
            :columns="rooms"
            value-key="id"
            label-key="name"
            label="点击选择房间"
            :display-format="(item) => `${(item as Room).name} 室`"
            @confirm="handleConfirm"
          />
        </wd-col>
        <wd-col :span="6">
          <view
            class="h-full bg-[#4d80f0] p-[10px] text-center text-white leading-[24px]"
            @click="handleShowAction"
          >
            创建账单
          </view>
        </wd-col>
      </wd-row>
    </wd-sticky>
    <wd-status-tip
      v-if="bills.length === 0"
      image=""
      tip="暂无数据"
    />
    <bill-card
      v-for="(item, index) in bills"
      :key="index"
      :bill="item"
    />
    <wd-loadmore
      v-if="bills.length !== 0"
      :state="state"
    />
  </view>
  <!-- 账单类型选项 -->
  <wd-action-sheet
    v-model="showAction"
    :actions="actions"
    :z-index="999"
    cancel-text="取消"
    @select="handleSelectAction"
  />
  <!-- 账单表单弹出框 -->
  <wd-popup
    v-model="showForm"
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
          @click="showForm = false"
        >
          取消
        </wd-button>
        <text class="flex-1 text-center font-bold">
          创建账单
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
            <!-- 水电表读数 必填 -->
            <wd-input
              v-model="model.water"
              label="水表读数"
              label-width="90px"
              prop="water"
              clearable
              placeholder="请输入水表读数"
              :cursor-spacing="150"
              confirm-type="next"
              :rules="[{ required: true, message: '请填写水表读数' }]"
            />
            <wd-input
              v-model="model.electric"
              label="电表读数"
              label-width="90px"
              prop="electric"
              clearable
              placeholder="请输入电表读数"
              inputmode="numeric"
              :cursor-spacing="100"
              confirm-type="next"
              :rules="[{ required: true, message: '请填写电表读数' }]"
            />
            <!-- 额外信息非必填 -->
            <wd-input
              v-model="model.extPrice"
              label="额外费用"
              label-width="90px"
              prop="extPrice"
              clearable
              placeholder="请输入额外费用"
              inputmode="numeric"
              :cursor-spacing="50"
              confirm-type="next"
            />
            <wd-input
              v-model="model.extRemark"
              label="额外说明"
              label-width="90px"
              prop="extRemark"
              clearable
              placeholder="请输入额外说明"
              inputmode="text"
              confirm-type="done"
            />
          </wd-cell-group>
        </wd-form>
      </view>
    </view>
  </wd-popup>
</template>
