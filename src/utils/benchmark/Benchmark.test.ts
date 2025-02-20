import { Benchmark } from './Benchmark'
import assert from 'assert'
import {sleep} from "../sleep";

describe('Benchmark', () => {
  it('record data by path', () => {
    const benchmark = new Benchmark()
    benchmark.record('test.name', 'test1')
    benchmark.record('test.init', 11)
    benchmark.record('test.duration', 1001)
    benchmark.record('test.size', 1)
    benchmark.record('step.duration', 101)
    benchmark.record('step.duration', 102)
    benchmark.record('step.duration', 103)
    benchmark.record('step.duration', 104)

    benchmark.record('test.name', 'test2')
    benchmark.record('test.init', 12)
    benchmark.record('test.duration', 1002)
    benchmark.record('test.size', 2)
    benchmark.record('step.duration', 201)
    benchmark.record('step.duration', 202)
    benchmark.record('step.duration', 203)

    expect(benchmark.getData()).toStrictEqual({
      test: {
        name: ['test1', 'test2'],
        init: [11, 12],
        duration: [1001, 1002],
        size: [1, 2]
      },
      step: {
        duration: [101, 102, 103, 104, 201, 202, 203]
      }
    })
  })

  it('offers asynchronous function duration tracking', async () => {
    const benchmark = new Benchmark()
    const result = await benchmark.track('sleep', () => sleep(11).then(() => 'I slept well.'))
    expect(result).toEqual('I slept well.')
    const data = benchmark.getData().sleep
    assert(Array.isArray(data), 'sleep should be an array')
    expect(data[0]).toBeGreaterThanOrEqual(10)
  })
})
