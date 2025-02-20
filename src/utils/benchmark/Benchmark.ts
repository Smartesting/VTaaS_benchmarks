import { ArrayMultimap } from '@teppeis/multimaps'

export type BenchmarkRecordValue = string | number | boolean
export type BenchmarkRecord = { [key: string]: BenchmarkRecord | ReadonlyArray<BenchmarkRecordValue> }

export class Benchmark {
  private readonly data = new ArrayMultimap<string, BenchmarkRecordValue>()

  record(path: string, value: BenchmarkRecordValue) {
    this.data.put(path, value)
  }

  async track<T>(path: string, fn: () => Promise<T>): Promise<T> {
    const timestamp = performance.now()
    return fn().finally(() => {
      this.record(path, Math.round(performance.now() - timestamp))
    })
  }

  getData(): BenchmarkRecord {
    const benchmarkRecord: BenchmarkRecord = {}
    for (const [path, values] of Array.from(this.data.asMap().entries())) {
      ensurePath(benchmarkRecord, path).push(...values)
    }
    return benchmarkRecord
  }

  prettyPrint(): string {
    return JSON.stringify(this.getData(), null, 2)
  }
}

function ensurePath(record: BenchmarkRecord, path: string): Array<BenchmarkRecordValue> {
  const keys = path.split('.')
  let current: BenchmarkRecord = record

  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) current[keys[i]] = {}
    current = current[keys[i]] as BenchmarkRecord
  }

  const lastKey = keys[keys.length - 1]
  if (!Array.isArray(current[lastKey])) {
    current[lastKey] = []
  }
  return current[lastKey] as Array<BenchmarkRecordValue>
}
