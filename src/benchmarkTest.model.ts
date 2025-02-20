import { Test, TestRunStatus } from '@smartesting/vtaas-service'

export type BenchmarkTest = Test & {
  name: string
  expectedStatus: TestRunStatus
}
