import 'reflect-metadata'
import { Benchmark } from '@smartesting/vtaas-service'
import * as path from 'path'
import * as fs from 'node:fs'

global.benchmark = new Benchmark()

function serializeTestResults(benchmark: Benchmark, buildNumber: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const benchmarkData: any = benchmark.getData()
  const tests = benchmarkData.test.name.map((name: string, index: number) => {
    const duration = benchmarkData.test.duration?.[index] ?? 0
    const result = benchmarkData.test.result?.[index] ? 'Pass' : 'Fail'
    return { name, duration, result }
  })
  const json = {
    build: buildNumber,
    tests
  }
  writeJsonOutputFile(`tests_${buildNumber}.json`, json)
}

afterAll(() => {
  try {
    if (global.benchmark) {
      const buildNumber = process.env.GITHUB_RUN_NUMBER || new Date().toISOString()
      console.log(buildNumber)
      serializeTestResults(global.benchmark, buildNumber)
    } else {
      console.log('\nNo Benchmark results')
    }
  } catch (e) {
    console.error(e)
  }
})

function writeJsonOutputFile(filename: string, json: object) {
  const dirPath = path.join(__dirname, 'outputs')
  const filePath = path.join(dirPath, filename)
  console.log('Write file ', filePath)
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true })
  fs.writeFileSync(filePath, JSON.stringify(json) + '\n', 'utf8')
}
