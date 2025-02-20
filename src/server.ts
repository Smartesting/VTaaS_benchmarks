import { TestRunStatus } from '@vtaas/models'

const VTAAS_API_SERVER_URL = process.env.VTAAS_API_SERVER_URL || 'http://localhost:3001'

export function fetchApiJson<T>(url: string, method: 'GET' | 'POST' = 'GET', body?: object): Promise<T> {
  const init: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  }
  if (body) init.body = JSON.stringify(body)
  return fetch(VTAAS_API_SERVER_URL + url, init)
    .then((response) => response.json())
    .catch(console.error)
}

export async function waitForTestRunStatus(
  runId: string,
  checkFn: (status: TestRunStatus) => boolean,
  interval = 300
): Promise<TestRunStatus> {
  const result: { testStatus: TestRunStatus } = await fetchApiJson('/api/testRuns/' + runId)
  if (checkFn(result.testStatus)) return result.testStatus
  await new Promise((resolve) => setTimeout(resolve, interval))
  return waitForTestRunStatus(runId, checkFn, interval)
}
