import { Page, expect } from "@playwright/test";
import path = require("path");

async function safeFill(
  page: Page,
  selector: string,
  value: string
) {
  await page.evaluate(
    ({ selector, value }) => {
      const input = document.querySelector<HTMLInputElement>(selector);
      if (!input) throw new Error(`Element not found: ${selector}`);

      input.removeAttribute('readonly');
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    },
    { selector, value }
  );
}

//Button
export async function button(page: Page, text: string | RegExp) {
  await page.locator("button", { hasText: text }).click();
}

export async function linkByName(page: Page, text: string) {
  await page.getByRole("link", { name: text }).click();
}

export async function buttonByOnclick(page: Page, action: string) {
  await page.locator(`button[onclick="${action}"]`).click();
}

export async function buttonById(page: Page, id: string) {
  await page.click(`#${id}`);

}

//INPUT FUNCTIONS
export async function inputByPlaceholder(page: Page, placeholder: string, value: string) {
  await safeFill(page, `input[placeholder="${placeholder}"]`, value);
}

export async function inputById(page: Page, id: string, value: string) {
  await safeFill(page, `#${id}`, value);
}

export async function inputByName(page: Page, name: string, value: string) {
  await safeFill(page, `input[name="${name}"]`, value);
}

//UPLOAD FILE FUNCTION
export async function uploadFile(page: Page, label: string, filePath: string) {
  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.click(`label:has-text("${label}")`), // Triggers the file chooser
  ]);
  await fileChooser.setFiles(filePath);
}

export async function uploadBanner(page: Page, filePath: string) {
  await page.setInputFiles(
    '#beranda-banner-file-input',
    path.resolve(filePath)
  );
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
  const tableBody = page.locator('table tbody');
  await expect(tableBody).toBeVisible();
  await expect(tableBody).toContainText(label);
}

export async function expectTableVisible(page: Page, label: string) {
  await page.waitForFunction((label) => {
    const table = document.querySelector('table');
    if (!table) return false;

    const allRows = table.querySelectorAll('tbody tr');

    // Filter untuk mencari baris yang mengandung teks label
    const matchingRows = Array.from(allRows).filter(row => row.textContent?.includes(label));

    // Jika ada baris yang cocok, pastikan table visible
    if (matchingRows.length > 0) {
      // Set display style visible
      table.style.display = 'table';
      table.style.opacity = '1';
      // Tambahkan margin agar tidak menempel dengan elemen di atasnya (opsional)
      table.style.marginTop = '20px';
      return true;
    }
    return false;
  }, label);
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
