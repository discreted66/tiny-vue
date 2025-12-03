import {
  buildRadioConfig,
  buildSelectConfig,
  filter,
  getcheckedData,
  getPluginOption,
  handleVisibleChange,
  initQuery,
  mounted,
  radioChange,
  selectChange,
  syncGridSelection,
  watchValue
} from './index'

export const api = [
  'state',
  'buildRadioConfig',
  'buildSelectConfig',
  'filter',
  'radioChange',
  'selectChange',
  'getcheckedData',
  'getPluginOption',
  'mounted',
  'syncGridSelection',
  'watchValue',
  'handleVisibleChange'
]

export const renderless = (props, { reactive, computed, watch, onMounted, nextTick }, { vm, emit }) => {
  const api: any = {}

  const state = reactive({
    value: props.modelValue,
    gridData: (props.gridOp && props.gridOp.data) || [],
    remoteData: [],
    selected: props.multiple ? [] : {},
    currentKey: props.multiple ? '' : props.modelValue,
    previousQuery: null,
    modelValue: props.multiple ? (Array.isArray(props.modelValue) ? [...props.modelValue] : []) : props.modelValue,
    isMounted: false,
    firstAutoSearch: props.remoteConfig?.autoSearch || false
  })

  Object.assign(api, {
    state,
    buildRadioConfig: buildRadioConfig({ props, state }),
    buildSelectConfig: buildSelectConfig({ props, state }),
    filter: filter({ props, state, vm }),
    getcheckedData: getcheckedData({ props, state }),
    getPluginOption: getPluginOption({ api, props, state }),
    initQuery: initQuery({ props, state, vm }),
    mounted: mounted({ api, state, props, vm, nextTick }),
    radioChange: radioChange({ props, vm, emit, state }),
    selectChange: selectChange({ props, vm, emit, state, nextTick }),
    syncGridSelection: syncGridSelection({ props, vm, state, nextTick }),
    handleVisibleChange: handleVisibleChange({ api, state, props }),
    watchValue: watchValue({ api, props, vm, state })
  })

  // 计算属性：获取已选中的行 value 数组（需要在 api 对象创建之后）
  state.gridCheckedData = computed(() => api.getcheckedData())

  // 监听 gridOp.data 的变化，参考 tree-select 的实现
  watch(
    () => props.gridOp && props.gridOp.data,
    (data) => {
      if (data) {
        state.gridData = Array.isArray(data) ? data : []
      } else {
        state.gridData = []
      }
    },
    { immediate: true, deep: true }
  )

  watch(
    () => props.modelValue,
    () => {
      if (props.multiple && Array.isArray(props.modelValue)) {
        state.modelValue = [...props.modelValue]
      } else {
        state.modelValue = props.modelValue
      }
    },
    { immediate: true, deep: true }
  )

  watch(
    () => state.modelValue,
    (newValue, oldValue) => {
      // 只有在组件挂载后才执行 watchValue，避免初始化时的错误
      if (state.isMounted) {
        api.watchValue(newValue, oldValue)
      }
    }
  )

  watch(
    () => props.extraQueryParams,
    () => {
      if (props.remote) {
        api.filter(state.previousQuery || '')
      }
    },
    { deep: true }
  )

  // 监听面板打开，同步表格选中状态（通过事件处理）
  // 注意：这里不直接 watch visible，而是通过 visible-change 事件处理

  onMounted(() => {
    api.mounted()
    state.isMounted = true
  })

  return api
}
