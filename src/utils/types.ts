import {RunStatus, TestRunFullStatus} from "@vtaas/models";

export type TestRunReport = TestRunFullStatus & {name:string}

export type RunStatusCount = Record<RunStatus, number>