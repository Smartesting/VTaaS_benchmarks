import * as fs from 'fs'
import * as path from 'path'
import { BenchmarkTest } from './benchmarkTest.model'
import { Benchmark, TestRunStatus } from '@smartesting/vtaas-service'
import { fetchApiJson, waitForTestRunStatus } from './server'

const testsDir = path.join(__dirname, './tests')

const ALL_TESTS = fs
  .readdirSync(testsDir)
  .filter((file) => file.endsWith('.ts'))
  .map((file) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require(path.join(testsDir, file)).default
  })

describe('benchmarks', () => {
  const benchmark: Benchmark = global.benchmark

  ALL_TESTS.forEach((test: BenchmarkTest) => {
    return it(test.name, async () => {
      benchmark.record('test.name', test.name)

      const runId = await fetchApiJson<string>('/api/testRuns', 'POST', test)

      await waitForTestRunStatus(runId, (status: TestRunStatus) => status !== 'waiting')
      const testStatus: TestRunStatus = await benchmark.track('test.duration', () =>
        waitForTestRunStatus(runId, finalStatus, 1000)
      )

      benchmark.record('test.result', testStatus === test.expectedStatus)
      expect(testStatus).toEqual(test.expectedStatus)
    })
  })
})

function finalStatus(status: TestRunStatus): boolean {
  return !pendingStatus(status)
}

function pendingStatus(status: TestRunStatus): boolean {
  return status === 'running' || status === 'waiting'
}
