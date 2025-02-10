import { mountPcMode } from '@opentiny-internal/vue-test-utils'
import { describe, expect, test } from 'vitest'
import MonthRange from '@opentiny/vue-month-range'
import { nextTick } from 'vue'

describe('PC Mode', () => {
  const mount = mountPcMode

  test('value', async () => {
    let value = '2025'
    const wrapper = mount(() => <MonthRange v-model={value}></MonthRange>)

    await nextTick()
    expect(wrapper.find('.tiny-picker-panel').exists()).toBe(true)
  })
})
