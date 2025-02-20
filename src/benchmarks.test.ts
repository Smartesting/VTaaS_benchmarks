import * as fs from 'fs'
import * as path from 'path'
import {TestRunStatus} from '@vtaas/models'
import {Benchmark} from "./utils/benchmark/Benchmark";
import {serializeTestResults} from "./utils/serializeTestResults";
import {fetchApiJson, waitForTestRunStatus} from "./server";

const testsDir = path.join(__dirname, './tests')

const ALL_TESTS = fs
    .readdirSync(testsDir)
    .filter((file) => file.endsWith('.ts'))
    .map((file) => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        return require(path.join(testsDir, file)).default
    })

describe('benchmarks', () => {
    const benchmark = new Benchmark()

    for (const test of ALL_TESTS) {
        it(test.name, async () => {
            benchmark.record('test.name', test.name)
            const runId = await fetchApiJson<string>('/api/testRuns', 'POST', test)

            await waitForTestRunStatus(runId, (status: TestRunStatus) => status !== 'waiting')
            const testStatus: TestRunStatus = await benchmark.track('test.duration', () =>
                waitForTestRunStatus(runId, finalStatus, 1000)
            )
            benchmark.record('test.result', testStatus === test.expectedStatus)
            expect(testStatus).toEqual(test.expectedStatus)
        })
    }

    afterAll(() => {
        serializeTestResults(benchmark)
    })
})

function finalStatus(status: TestRunStatus): boolean {
    return !pendingStatus(status)
}

function pendingStatus(status: TestRunStatus): boolean {
    return status === 'running' || status === 'waiting'
}
