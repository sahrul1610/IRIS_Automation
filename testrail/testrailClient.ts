import axios from 'axios';
import dotenv from 'dotenv';
import FormData from 'form-data';  // ✅ pakai FormData dari package form-data
dotenv.config();

export class TestRailClient {
    private baseUrl: string;
    private auth: string;
    private projectId: string;
    private runId: string;

    constructor() {
        this.baseUrl = process.env.TESTRAIL_HOST!;
        this.projectId = process.env.TESTRAIL_PROJECT_ID!;
        this.runId = process.env.TESTRAIL_RUN_ID!;
        this.auth = Buffer.from(`${process.env.TESTRAIL_USERNAME}:${process.env.TESTRAIL_API_KEY}`).toString('base64');

    }

    //Set result test case di TestRail
    async addResultForCase(caseId: string, statusId: number, comment: string, elapsed: string) {
        try {
            console.log(`🚀 Sending to TestRail: Run ${this.runId}, Case ${caseId}`);

            const payload = {
                status_id: statusId,
                comment: comment,
                elapsed: elapsed
            };

            const response = await axios.post(
                `${this.baseUrl}/index.php?/api/v2/add_result_for_case/${this.runId}/${caseId}`,
                payload,
                { headers: { Authorization: `Basic ${this.auth}` } }
            );

            console.log(`✅ TestRail updated for case ${caseId}`);
            return response.data;
        } catch (error: any) {
            console.error('❌ TestRail API error:', error.response?.data || error.message);
        }
    }

    //Upload attachment ke result test case di TestRail by resultId
    async addAttachmentsToResult(resultId: number, filePaths: string[]) {
        const fs = await import('fs');

        try {
            console.log(`🚀 Uploading ${filePaths.length} attachment(s) to result ${resultId}...`);
            for (const filePath of filePaths) {
                if (!fs.existsSync(filePath)) {
                    console.warn(`⚠️ File not found: ${filePath}`);
                    continue;
                }

                const formData = new FormData();
                formData.append('attachment', fs.createReadStream(filePath) as any);
                const response = await axios.post(
                    `${this.baseUrl}/index.php?/api/v2/add_attachment_to_result/${resultId}`,
                    formData,
                    {
                    headers: {
                        Authorization: `Basic ${this.auth}`,
                        ...formData.getHeaders(),
                    },
                    }
                );
                console.log(`✅ Uploaded: ${filePath} → attachment_id: ${response.data?.attachment_id || 'unknown'}`);
            }

            console.log(`📸 All attachments uploaded for result ${resultId}`);
        } catch (error: any) {
            console.error('❌ Failed to upload one or more attachments:', error.response?.data || error.message);
        }
    }


    async getTestCases(suiteId: string) {
        const response = await axios.get(
                `${this.baseUrl}/index.php?/api/v2/get_cases/${this.projectId}&suite_id=${suiteId}`,
                { headers: { Authorization: `Basic ${this.auth}` } }
            );
        console.log('Response : ', response.data.cases);
        return response.data;
    }

    async getTestCase(caseId: string) {
        const response = await axios.get(
                `${this.baseUrl}/index.php?/api/v2/get_case/${caseId}`,
                { headers: { Authorization: `Basic ${this.auth}` } }
            );
        console.log('Response : ', response.data.cases);
        return response.data;
    }

    async createJiraTicket(summary: string, description: string) {
        const projectKey = process.env.JIRA_PROJECT!;
        const res = await axios.post("/issue", {
        fields: {
            project: { key: projectKey },
            summary,
            description,
            issuetype: { name: "Bug" }
        }
        });
        return res.data;
    }

    // async getTestCases(suiteId: string) {
    //     console.log('projectId: ', this.projectId, 'suiteId: ', suiteId);
    //     return this.request(`get_cases/${this.projectId}&suite_id=${suiteId}`);
    // }

    // async getCases(projectId: number) {
    //     const res = await axios.get(`${this.baseUrl}/index.php?/api/v2/get_cases/${projectId}`, {
    //     headers: {
    //         Authorization: `Basic ${this.auth}`,
    //     },
    //     });
    //     return res.data.cases || res.data;
    // }

    // async linkJiraToTestRail(caseId: string, jiraKey: string) {
    //     const runId = process.env.TESTRAIL_RUN_ID;
    //     await axios.post(
    //     `/index.php?/api/3/issue/${runId}/${caseId}`,
    //     {
    //         status_id: 5, // Failed
    //         comment: `Linked Jira issue: ${jiraKey}`
    //     }
    //     );
    }
    



// ✅ Manual test runner (for debugging)
if (require.main === module) {
    (async () => {
        const client = new TestRailClient();

        // 1️⃣ Tambahkan hasil test
        const result = await client.addResultForCase("361708", 1, "Test automation passed", "10s");

        // 2️⃣ Upload screenshot otomatis (kalau result berhasil)
        if (result?.id) {
        await client.addAttachmentsToResult(result.id, 
            [
                "/Users/regiabdulrojak/Documents/WORK DIR/EXPLORE/QA/qa_automation/test-results/example-C361708---test-automation/test-started.png",
                "/Users/regiabdulrojak/Documents/WORK DIR/EXPLORE/QA/qa_automation/test-results/example-C361708---test-automation/test-finished-1.png"
            ]);
        }
    })();
}
