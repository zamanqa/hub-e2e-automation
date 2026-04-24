---
description: Write Playwright automation using TypeScript and Page Object Model with storageState auth, accessible selectors, and multi-env support.
---

Write Playwright automation for $ARGUMENTS using TypeScript and Page Object Model.

**Structure:**
```ts
// Page Object
class FeaturePage {
  constructor(private page: Page) {}
  // selector: describe element
  get submitBtn() { return this.page.getByTestId('submit'); }
  // action: describe interaction
  async submit() { await this.submitBtn.click(); }
}

// Test file
test.describe('Feature', () => {
  test.beforeEach(async ({ page }) => {
    // auth via storageState (configured in playwright.config.ts)
    await page.goto(process.env.BASE_URL + '/en/cms/...');
  });

  test('should ...', async ({ page }) => { ... });
});
```

**For every UI element:**
```ts
// selector: describe the element
page.getByTestId('...') // or page.getByRole('button', { name: '...' })
// action: describe the interaction
await element.click();
// assertion
await expect(element).toBeVisible();
```

**Required:**
- `page.waitForResponse()` for API synchronisation
- `expect()` after every action
- `playwright.config.ts` baseURL from `process.env.BASE_URL`
- Screenshot on failure via built-in reporter (no extra config needed)
- Summarise repeated flows as Page Object methods
