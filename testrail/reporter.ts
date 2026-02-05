import { FullConfig, FullResult, Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import { TestRailClient } from './testrailClient';
import path from 'path';
import fs from 'fs';

class TestRailReporter implements Reporter {

    private client = new TestRailClient();

    async onTestEnd(test: TestCase, result: TestResult) {
      try {
        // Cari tag C12345 dari nama test
        const match = test.title.match(/C(\d+)/);
        if (!match) return; // tidak ada tag, skip

        const caseId = match[1];
        const status = result.status === 'passed' ? 1 : 5; // 1=Passed, 5=Failed
        const comment = `Result: ${result.status}\nDuration: ${result.duration}ms`;

        const elapsedSeconds = Math.ceil(result.duration / 1000);
        const elapsed = `${elapsedSeconds}s`;
        console.log(`Test ${test.title} finished with status ${result.status}, sending to TestRail case C${caseId}`);

        // ✅ Kirim result ke TestRail
        const response = await this.client.addResultForCase(caseId, status, comment, elapsed);
        if (!response || !response.id) {
          console.warn(`⚠️ No valid response from TestRail when sending result for case ${caseId}`);
          return;
        }

        console.log('response : ', response.data)
        const screenshotsDir = path.resolve(`./test-results/${test.title}`);
        const filesToUpload: string[] = [];

        if (fs.existsSync(screenshotsDir)) {
          console.log(`📁 Looking for screenshots in ${screenshotsDir}`);
          const files = fs.readdirSync(screenshotsDir);

          for (const file of files) {
            const fullPath = path.join(screenshotsDir, file);
            if (fs.statSync(fullPath).isFile() && /\.(png|jpg|jpeg)$/i.test(file)) {
              filesToUpload.push(fullPath);
            }
          }
        }

        if (filesToUpload.length > 0) {
          console.log(`📎 Attaching ${filesToUpload.length} file(s) to TestRail result ${response.id}`);
          await this.client.addAttachmentsToResult(response.id, filesToUpload);
        }
        console.log(`🚀 Syncing TestRail case ${caseId} (${result.status})`);
      
      } catch (error) {
        console.error('❌ Error syncing with TestRail:', error);
      }

    }

    async onEnd(result: FullResult) {
      console.log('⏳ Waiting for final API tasks to finish...');
      await new Promise((res) => setTimeout(res, 3000)); // delay 3s
    }

}

export default TestRailReporter;

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, timeoutMessage = 'Operation timed out'): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs)),
  ]);
}
