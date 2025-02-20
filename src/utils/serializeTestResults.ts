import path from "path";
import fs from "node:fs";
import {Benchmark} from "./benchmark/Benchmark";

const OUTPUT_DIR = path.join(__dirname, '../../outputs')

export function serializeTestResults(benchmark: Benchmark) {
    try {
        const build = process.env.GITHUB_RUN_NUMBER || new Date().toISOString()
        const benchmarkData: any = benchmark.getData()
        const tests = benchmarkData.test.name.map((name: string, index: number) => {
            const duration = benchmarkData.test.duration?.[index] ?? 0
            const result = benchmarkData.test.result?.[index] ? 'Pass' : 'Fail'
            return {name, duration, result}
        })
        const json = {build, tests}
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
