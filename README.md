# 📊 VTaaS Benchmarks

This repository contains performance and robustness tests executed automatically to evaluate a **System Under Test (SUT)**.

## 🚀 Running the Tests

Tests are located in the [`src/tests`](./src/tests) directory. To run all tests locally:

```sh
yarn test
```

## 🏗️ Adding a New Test

1. Create a `.ts` file in `src/tests` (e.g., `new-test.ts`).
2. Define a `BenchmarkTest` object following the format below.
3. The test will automatically be included in `yarn test`.

### Test Format
```ts
const test: BenchmarkTest = {
  name: string,          // Test name
  url: string,           // SUT URL
  expectedStatus: TestRunStatus, // Expected status after execution
  steps: TestStep[],     // Sequence of actions to perform
}

export default test;
```



## ⚙️ GitHub Actions Execution

A manual GitHub Actions workflow allows running all benchmark tests.  
Once completed, the results are published on a static webpage.

## 📊 Viewing the Results

Benchmark results are available here:  
➡️ **[Benchmark Results Page](https://smartesting.github.io/VTaaS_benchmarks/)**

Each GitHub run is tracked, and results are displayed to monitor performance over time.

