import { test, expect } from '@playwright/test'

test('[DatePanel] 测试月份/年份选择', async ({ page }) => {
  page.on('pageerror', (exception) => expect(exception).toBeNull())
  await page.goto('date-panel#basic-usage')

  // 选择月份
  await page.getByRole('button', { name: '4 月' }).click()
  await page.getByText('六月').click()
  await page.getByRole('row', { name: '4 5 6 7 8 9 10' }).getByText('4').click()
  // await expect(dateInput).toHaveValue('2023-06-04')

  // 选择年份
  await page.getByRole('button', { name: '2023 年' }).click()
  await page.getByRole('cell', { name: '2024' }).getByText('2024').click()
  await page.getByText('二月', { exact: true }).click()
  await page.getByRole('row', { name: '4 5 6 7 8 9 10' }).getByText('7').click()
  // await expect(dateInput).toHaveValue('2024-02-07')
})
