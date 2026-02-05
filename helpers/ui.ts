import { Page, expect } from "@playwright/test";

//Button
export async function button(page: Page, text: string | RegExp) {
  await page.locator("button", { hasText: text }).click();
}

export async function link(page: Page, text: string) {
  await page.getByRole("link", { name: text }).click();
}

export async function buttonByOnclick(page: Page, action: string) {
  await page.locator(`button[onclick="${action}"]`).click();
}

//INPUT FUNCTIONS
export async function input(page: Page, placeholder: string, value: string) {
  await page.fill(`input[placeholder="${placeholder}"]`, value);
}

export async function selectOption(page: Page, label: string, option: string) {
  await page.click(`#${label}`);
  await page.fill(".select2-search__field", option);
  await page.locator(".select2-results__option", { hasText: option }).click();
}



//EXPECTER FUNCTIONS
export async function expectModal(page: Page, locator: string, text: string) {
  await expect(page.locator(locator)).toHaveText(text);
}

export async function expectTable(page: Page, label: string) {
    const rows = page.locator('table tbody tr');
    await expect(rows.first()).toBeVisible();
    await expect(rows).toContainText(label);
}























export async function getText(page: Page, selector: string): Promise<string> {
  return await page.locator(selector).innerText();
}

export async function navigateTo(page: Page, urlPart: string) {
  await page.goto(`https://admincargo-beta.kai.id/${urlPart}`);
}

export async function expectUrlContains(page: Page, urlPart: string) {
  await page.waitForURL(new RegExp(urlPart));
}



export async function waitForTimeout(page: Page, milliseconds: number) {
  await page.waitForTimeout(milliseconds);
}

export async function clickLocator(page: Page, locator: string) {
  await page.locator(locator).click();
}

export async function expectLocatorToHaveText(page: Page, locator: string, text: string) {
  const locatorHandle = page.locator(locator);
  await locatorHandle.waitFor();
  const locatorText = await locatorHandle.innerText();
  if (locatorText.trim() !== text) {
    throw new Error(`Expected text "${text}" but found "${locatorText.trim()}"`);
  }
}

export async function fillInputByName(page: Page, name: string, value: string) {
  await page.fill(`input[name="${name}"]`, value);
}

export async function clickButtonByText(page: Page, text: string) {
  await page.click(`button:has-text("${text}")`);
}

export async function expectPageUrlNotToContain(page: Page, urlPart: string) {
  await page.waitForFunction(
    (part) => !window.location.href.includes(part),
    urlPart
  );
}

export async function screenshot(page: Page, path: string) {
  await page.screenshot({ path });
}
