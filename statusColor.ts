import {RunStatus} from "@vtaas/models";

export function statusColor(status: RunStatus, dark=false) {
    const prefix = dark ? "dark" : "";
    switch (status) {
        case "waiting":
        case "running":
        case "stopped":
        case "not_run":
            return prefix+"gray";
        case "success":
            return prefix+"green"
        case "failed":
            return prefix+"red"
        case "error":
            return prefix+"orange"

    }
}