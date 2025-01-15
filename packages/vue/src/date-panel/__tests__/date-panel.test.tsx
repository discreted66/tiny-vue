import { mountPcMode } from '@opentiny-internal/vue-test-utils'
import { describe, expect, test } from 'vitest'
import { DatePanel } from '@opentiny/vue-date-panel'
import { nextTick } from 'vue'

describe('PC Mode', () => {
  const mount = mountPcMode

  test('static', async () => {
    const wrapper = mount(DatePanel, {
      props: {
        modelValue: '2025-01-14',
        format: 'yyy-MM-dd'
      }
    })
    await nextTick()
    expect(wrapper.find('.current').exists()).toBe(true)
  })
})
