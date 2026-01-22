<script setup lang="ts">
definePage({
  name: 'index',
  layout: 'tabbar',
  style: {
    navigationBarTitleText: '首页',
    enablePullDownRefresh: true,
  },
})
const { isDark, themeVars } = useTheme()

const { data, send, onComplete } = useRequest(
  index(),
  {
    immediate: false,
    force: true,
    initialData: {
      statistics: {
        empty: 0,
        total: 0,
      },
      income: [],
      notification: [],
    },
  },
)

onComplete(() => uni.stopPullDownRefresh())
onPullDownRefresh(() => send())
onShow(() => send())
</script>

<template>
  <wd-config-provider :theme-vars="themeVars">
    <view
      :class="{ 'dark-mode': isDark }"
      class="box-border py-3"
    >
      <demo-block transparent>
        <wd-row>
          <wd-col :span="11">
            <view class="box-border rounded-3 bg-white py-2 text-center dark:bg-[var(--wot-dark-background2)]">
              <text class="block text-sm text-gray-400">
                空房数
              </text>
              <text class="mt-2 block text-2xl text-blue-500 font-bold">
                {{ data.statistics.empty }}
              </text>
            </view>
          </wd-col>
          <wd-col
            :span="11"
            :offset="2"
          >
            <view class="box-border rounded-3 bg-white py-2 text-center dark:bg-[var(--wot-dark-background2)]">
              <text class="block text-sm text-gray-400">
                最近收入
              </text>
              <wd-count-to
                prefix="￥"
                :start-val="0"
                :end-val="data.statistics.total"
                :font-size="24"
                color="#3b82f6"
                :duration="1500"
                custom-class="mt-2 font-bold"
              />
            </view>
          </wd-col>
        </wd-row>
      </demo-block>

      <demo-block
        transparent
        title="收租提醒"
      >
        <wd-status-tip
          v-if="data.notification.length === 0"
          image=""
          tip="暂无数据"
        />
        <wd-cell-group
          v-else
          border
          custom-class="rounded-2! overflow-hidden"
        >
          <wd-cell
            v-for="(item, index) in data.notification"
            :key="index"
            :title="`${item.room} 室`"
            :label="`账单日期: ${item.date}`"
            :value="`¥${item.price}`"
            custom-title-class="font-bold"
            custom-value-class="text-red-500! font-bold"
          />
        </wd-cell-group>
      </demo-block>

      <demo-block
        transparent
        title="最近入账"
      >
        <wd-status-tip
          v-if="data.income.length === 0"
          image=""
          tip="暂无数据"
        />
        <wd-cell-group
          v-else
          border
          custom-class="rounded-2! overflow-hidden"
        >
          <wd-cell
            v-for="(item, index) in data.income"
            :key="index"
            :title="`${item.room} 室`"
            :label="`账单日期: ${item.date}`"
            :value="`+ ¥${item.price}`"
            custom-title-class="font-bold"
            custom-value-class="text-green-500! font-bold"
          />
        </wd-cell-group>
      </demo-block>
    </view>
  </wd-config-provider>
</template>
