<template>
  <div class="demo-date-panel-wrap">
    <div class="value">{{ value }}</div>
    <tiny-date-panel v-model="value"></tiny-date-panel>
    <div class="value1">{{ value1 }}</div>
    <tiny-date-range
      type="daterange"
      v-model="value1"
      :disabledDate="disabledDate"
      popperClass="cus------------------------"
      :shortcuts="shortcuts1"
      :show-week-number="true"
      @select-change="handleSelectChange1"
      :unlink-panels="true"
    ></tiny-date-range>
    <!-- <div class="value2">{{ value2 }}</div>
    <tiny-month-range v-model="value2"></tiny-month-range> -->
    <!-- {{ value3 }}
    <tiny-year-range v-model="value3"></tiny-year-range> -->
  </div>
</template>

<script setup>
import { ref } from 'vue'

import { TinyDatePanel, TinyDateRange } from '@opentiny/vue'

// import {  TinyYearRange TinyMonthRange} from '@opentiny/vue'

const value = ref('2025-01-15')
const value1 = ref(['2025-01-15', '2025-02-15'])
// const value2 = ref(['2024-01', '2025-02'])
// const value3 = ref(['2024', '2028'])

const shortcuts1 = [
  {
    text: '最近一周',
    onClick(picker) {
      console.info(picker)
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      picker.$emit('pick', [start, end])
    }
  },
  {
    text: '最近一个月',
    onClick(picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      picker.$emit('pick', [start, end])
    }
  },
  {
    text: '最近三个月',
    onClick(picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      picker.$emit('pick', [start, end])
    }
  }
]

const handleSelectChange = (val) => {
  console.info('3333', val)
}
const handleSelectChange1 = (val) => {
  console.info('444', val)
}
const disabledDate = (val) => {
  // console.info(val)
  return val.getFullYear() < 2024
}
// }
</script>

<style scoped lang="less">
.demo-date-panel-wrap {
  width: 560px;

  & > * {
    margin-top: 12px;
  }

  .tiny-date-range-picker {
    width: 668px;
  }
}
</style>
