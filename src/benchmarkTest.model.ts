import { Test, RunStatus } from '@vtaas/models'

export type BenchmarkTest = Test & {
  name: string
  expectedStatus: RunStatus
}
