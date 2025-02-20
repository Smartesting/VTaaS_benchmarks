import { Test, TestRunStatus } from '@vtaas/models'

export type BenchmarkTest = Test & {
  name: string
  expectedStatus: TestRunStatus
}
