import {RunStatus, TestRunFullStatus} from '@vtaas/models'

const VTAAS_API_SERVER_URL = process.env.VTAAS_API_SERVER_URL || 'http://localhost:3001'

export async function fetchApiJson<T>(url: string, method: 'GET' | 'POST' = 'GET', body?: object): Promise<T> {
    const init: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    }
    if (body) init.body = JSON.stringify(body)
    const fullUrl = VTAAS_API_SERVER_URL + url
    console.log(`Fetching ${fullUrl}`)
    return fetch(fullUrl, init)
        .then(async (response) => {
            if (response.ok) return response.json()
            throw new Error(await response.text())
        })
}

export async function waitForTestRunStatus(
    runId: string,
    checkFn: (status: RunStatus) => boolean,
    interval = 300
): Promise<TestRunFullStatus | null> {
    try {
        const status = await fetchApiJson<TestRunFullStatus>(`/api/testRuns/${runId}/fullStatus`)
        if (checkFn(status.status)) return status
        await new Promise((resolve) => setTimeout(resolve, interval))
        return waitForTestRunStatus(runId, checkFn, interval)
    } catch (e) {
        console.error(e)
        return null
    }
}
