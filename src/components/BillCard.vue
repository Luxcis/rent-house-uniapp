<script lang="ts" setup>
import type { PropType } from 'vue'
import type { Bill } from '@/api/types'
import { BillStatus, BillStatusColor, BillStatusName } from '@/pages/bill/enum'

const props = defineProps({
  bill: {
    type: Object as PropType<Bill>,
    required: true,
  },
})

const pay = () => {
  payBill(props.bill.id as string, !props.bill.isPaid)
    .then(() => {
      props.bill.isPaid = !props.bill.isPaid
    })
}
</script>

<script lang="ts">
export default {
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
}
</script>

<template>
  <view
    class="card bill-result"
  >
    <view class="card-header">
      <view>
        账单详情
      </view>
      <view class="flex items-center gap-1">
        {{ props.bill.createTime }}
        <wd-tag
          custom-class="text-xs!"
          :type="BillStatusColor(props.bill.status)"
          plain
        >
          {{ BillStatusName(props.bill.status) }}
        </wd-tag>
      </view>
    </view>
    <view class="bill-row">
      <text>基础房租</text>
      <text>¥{{ props.bill.rent }}</text>
    </view>
    <view class="bill-row">
      <text>水表</text>
      <text>{{ props.bill.water }}</text>
    </view>
    <view
      v-if="props.bill.status !== BillStatus.CHECKED_IN"
      class="bill-row"
    >
      <text>水费</text>
      <text>({{ props.bill.waterUsage }} 吨) ¥{{ props.bill.waterFee }}</text>
    </view>
    <view class="bill-row">
      <text>电表</text>
      <text>{{ props.bill.electric }}</text>
    </view>
    <view
      v-if="props.bill.status !== BillStatus.CHECKED_IN"
      class="bill-row"
    >
      <text>电费</text>
      <text>({{ props.bill.electricUsage }} 度) ¥{{ props.bill.electricFee }}</text>
    </view>
    <view
      v-if="props.bill.status !== BillStatus.CHECKED_IN"
      class="bill-row"
    >
      <text>管理费</text>
      <text>¥{{ props.bill.managementPrice }}</text>
    </view>
    <view
      v-if="props.bill.status !== BillStatus.CHECKED_IN"
      class="bill-row"
    >
      <text>垃圾费</text>
      <text>¥{{ props.bill.garbagePrice }}</text>
    </view>
    <view
      v-if="props.bill.status !== BillStatus.CHECKED_IN"
      class="bill-row"
    >
      <text>其他费用{{ props.bill.extRemark ? `(${props.bill.extRemark})` : '' }}</text>
      <text>¥{{ props.bill.extPrice ? props.bill.extPrice : 0 }}</text>
    </view>
    <view
      v-if="props.bill.status !== BillStatus.CHECKED_IN"
      class="total-row"
    >
      <text>总计应收: ¥{{ props.bill.sumPrice }}</text>
      <wd-tag
        variant="light-outline"
        :type="props.bill.isPaid ? 'success' : 'danger'"
        round
        @click="pay"
      >
        {{ props.bill.isPaid ? '已收款' : '待支付' }}
      </wd-tag>
    </view>
  </view>
</template>

<style lang="scss">
  // 账单样式
.card {
  background: white;
  border-radius: 12px;
  padding: 15px;
  margin: 5px 15px 10px 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  /* 卡片内部垂直排列 */
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  justify-content: space-between;
  /* 垂直居中 */
  margin-bottom: 15px;
  font-weight: 600;
  font-size: 0.95rem;
}

.bill-result {
  border-top: 4px solid #3b82f6;
}

.bill-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.total-row {
  display: flex;
  justify-content: space-between;
  border-top: 1px dashed #ddd;
  margin-top: 10px;
  padding-top: 10px;
  font-weight: bold;
  font-size: 1.1rem;
  color: #3b82f6;
}
</style>
