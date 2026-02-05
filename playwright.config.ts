import { defineConfig } from "@playwright/test";

export default defineConfig({
    testDir: "./tests",
    reporter: [
        ["list"],
        ["./testrail/reporter.ts"],
    ],
    use: {
        headless: false,
        screenshot: "on",
        video: "retain-on-failure",
        trace: "retain-on-failure",
        baseURL: 'https://admincargo-beta.kai.id',
        storageState: 'storageState.json',
        
        // set viewport ke null agar mengikuti window size
        viewport: null,
        
        // set window size sesuai layar (fullscreen)
        launchOptions: {
            args: ["--start-maximized"], // buka browser maksimal
        },
    },
    globalTeardown: './globalTeardown.ts'

});
