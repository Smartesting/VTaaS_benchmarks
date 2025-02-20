import { BenchmarkTest } from '../benchmarkTest.model'

const test: BenchmarkTest = {
  name: 'TC-1-P :: Perform a keyword search and sort results',
  url: 'http://www.vtaas-benchmark.com:9980',
  expectedStatus: 'success',
  steps: [
    {
      action: 'Enter "motorcycles" in the Keyword search field',
      expectedResult: 'The keyword "motorcycles" is entered in the search field.'
    },
    {
      action: 'Click on the "Search" button.',
      expectedResult:
        'The search results page is displayed, showing listings containing the keyword "motorcycles" in the title or description.'
    },
    {
      action: 'Verify the total number of listings found is displayed.',
      expectedResult: 'The total number of listings found is 114 on the results page'
    },
    {
      action: 'Sort the search results by "Lower price first"',
      expectedResult: 'The listings are reordered, with the lowest-priced items appearing at the top.'
    },
    {
      action: 'Verify that each listing shows a title, thumbnail image, price, location, and date posted.',
      expectedResult: 'All listings contain these details in the grid view.'
    }
  ]
}

export default test
