export interface TabbarItem {
  name: string
  value: number | null
  active: boolean
  title: string
  icon: string
  show: boolean
}

const tabbarItems = ref<TabbarItem[]>([
  { name: 'index', value: null, active: true, title: '首页', icon: 'chart-pie', show: true },
  { name: 'room', value: null, active: false, title: '房间', icon: 'home', show: true },
  { name: 'bill', value: null, active: false, title: '账单', icon: 'a-rootlist', show: true },
  { name: 'manage', value: null, active: false, title: '管理', icon: 'app', show: true },
])

export function useTabbar() {
  const tabbarList = computed(() => tabbarItems.value.filter(i => i.show))

  const activeTabbar = computed(() => {
    const item = tabbarItems.value.find(item => item.active)
    return item || tabbarItems.value[0]
  })

  const getTabbarItemValue = (name: string) => {
    const item = tabbarItems.value.find(item => item.name === name)
    return item && item.value ? item.value : null
  }

  const setTabbarItem = (name: string, value: number) => {
    const tabbarItem = tabbarItems.value.find(item => item.name === name)
    if (tabbarItem) {
      tabbarItem.value = value
    }
  }

  const setTabbarItemActive = (name: string) => {
    tabbarItems.value.forEach((item) => {
      if (item.name === name) {
        item.active = true
      }
      else {
        item.active = false
      }
    })
  }

  return {
    tabbarList,
    activeTabbar,
    getTabbarItemValue,
    setTabbarItem,
    setTabbarItemActive,
  }
}
