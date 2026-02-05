import { test } from "@playwright/test";
import { loginSuccess } from "../helpers/login";


//TESTCASE ID: C361708 - TITLE: test automation
test("C36170810 - test automation", async ({ page }) => {
    const caseId = "361708"; // ganti sesuai case ID di TestRail
    
    try {
        await loginSuccess(page);
        //screenshot after
        await page.screenshot({ path: `test-results/example-C${caseId}---test-automation/test-finished-1.png` });
    } catch (error) {
        await page.screenshot({ path: `test-results/example-C${caseId}---test-automation/issue.png` });
        throw error; // re-throw biar test tetap gagal
    }
    
});

