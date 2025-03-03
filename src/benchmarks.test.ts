import * as fs from 'fs'
import * as path from 'path'
import {RunStatus, TestRunFullStatus} from '@vtaas/models'
import {serializeTestResults} from "./utils/serializeTestResults";
import {fetchApiJson, waitForTestRunStatus} from "./server";
import {BenchmarkTest} from "./benchmarkTest.model";
import {TestRunReport} from "./utils/types";

const testsDir = path.join(__dirname, './tests')

const ALL_TESTS = fs
    .readdirSync(testsDir)
    .filter((file) => file.endsWith('.ts'))
    .map((file) => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        return require(path.join(testsDir, file)).default
    })

describe('benchmarks', () => {
    const testResults: Array<TestRunReport> = []

    for (const test of ALL_TESTS) {
        it(test.name, async () => {
            const testStatus = await runTest(test)
            if (testStatus) testResults.push({...testStatus, name: test.name})
            expect(testStatus?.status).toEqual(test.expectedStatus)
        })
    }

    afterAll(() => {
        if (testResults.length > 0) serializeTestResults(testResults)
    })
})

async function runTest(test: BenchmarkTest): Promise<TestRunFullStatus | null> {
    const runId = await fetchApiJson<string>('/api/testRuns', 'POST', test)
    if (isNaN(Number(runId))) return null
    return await waitForTestRunStatus(runId, finalStatus, 2000)
}


function finalStatus(status: RunStatus): boolean {
    return !pendingStatus(status)
}

function pendingStatus(status: RunStatus): boolean {
    return status === 'running' || status === 'waiting'
}
