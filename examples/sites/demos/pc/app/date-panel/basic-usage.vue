<template>
  <div class="demo-date-panel-wrap">
    {{ value }}
    <tiny-date-panel
      ref="datePanel"
      readonly
      :default-panel-value="defaultDate"
      v-model="value"
      @select-change="handleSelectChange"
      @change="handleSelectChange"
    ></tiny-date-panel>
    <tiny-date-range v-model="value1" @select-change="handleSelectChange"></tiny-date-range>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { TinyDatePanel, TinyDateRange } from '@opentiny/vue'

const defaultDate = ref(new Date(2000, 10, 10, 10, 10))
const value = ref('')
const value1 = ref([])
const datePanel = ref(null)
const handleSelectChange = (val) => {
  console.info('3333', val)
}
// }
</script>

<style scoped lang="less">
.demo-date-panel-wrap {
  width: 360px;

  & > * {
    margin-top: 12px;
  }
}
</style>
