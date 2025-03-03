import path from "path";
import fs from "node:fs";
import {TestRunFullStatus} from "@vtaas/models";

const OUTPUT_DIR = path.join(__dirname, '../../outputs')

export function serializeTestResults(testResults: ReadonlyArray<TestRunFullStatus>) {
    try {
        const build = process.env.GITHUB_RUN_NUMBER || new Date().toISOString()
        const json = {build, tests: testResults}
        writeJsonOutputFile(`tests_${build}.json`, json)
    } catch (e) {
        console.error(e)
    }
}

function writeJsonOutputFile(filename: string, json: object) {
    const filePath = path.join(OUTPUT_DIR, filename)
    if (!fs.existsSync(OUTPUT_DIR)) throw new Error("'outputs/' directory not found")
    console.log('Write file ', filePath)
    fs.writeFileSync(filePath, JSON.stringify(json) + '\n', 'utf8')
}
