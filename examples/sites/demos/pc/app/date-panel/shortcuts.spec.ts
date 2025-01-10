import { test, expect } from '@playwright/test'

test('[DatePanel] 测试周次序号', async ({ page }) => {
  page.on('pageerror', (exception) => expect(exception).toBeNull())
  await page.goto('date-panel#shortcuts')
})
