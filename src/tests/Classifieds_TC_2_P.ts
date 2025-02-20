import { BenchmarkTest } from '../benchmarkTest.model'

const test: BenchmarkTest = {
  name: 'TC-2-P :: Combine keyword and category filters, then filter by price',
  url: 'http://www.vtaas-benchmark.com:9980',
  expectedStatus: 'success',
  steps: [
    {
      action: 'Enter "speaker" in the Keyword search field.',
      expectedResult: 'The keyword "speaker" is entered in the search field.'
    },
    {
      action: 'Select "Musical instruments" from the Category dropdown.',
      expectedResult: 'The category "Musical instruments" is selected from the dropdown menu.'
    },
    {
      action: 'Click on the "Search" button.',
      expectedResult:
        'The search results page is displayed, showing listings that match both the keyword "speaker" and the "Musical instruments" category.'
    },
    {
      action: 'Enter $200 in the Minimum Price field and $500 in the Maximum Price field.',
      expectedResult: 'The price range $200-$500 is entered in the price filter fields.'
    },
    {
      action: 'Click on the "Apply" button to filter results by price.',
      expectedResult: 'The search results are filtered to show only listings with prices between $200 and $500.'
    },
    {
      action: 'Verify that the filtered listings match the selected keyword, category, and price range.',
      expectedResult:
        'Only listings with prices within the specified range and matching the keyword and category are displayed.'
    }
  ]
}

export default test
