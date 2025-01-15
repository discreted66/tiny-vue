import { mountPcMode } from '@opentiny-internal/vue-test-utils'
import { describe, expect, test } from 'vitest'
import { DatePanel } from '@opentiny/vue-date-panel'

describe('PC Mode', () => {
  const mount = mountPcMode

  test('static', () => {
    const wrapper = mount(DatePanel, {
      props: {
        modelValue: '2025-01-14'
      }
    })

    expect(wrapper.classes()).toContain('tiny-picker-panel')
    expect(wrapper.find('td .current').exists()).toBe(true)
  })
})
