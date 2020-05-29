const getConfigsFromPql = require('../getConfigsFromPql')

const input = 'Animal={type=("cat", "dog")}'

const output = [{
  businessObjectName: 'Animal',
  key: 'type',
  options: [
    { label: 'cat', value: 'cat' },
    { label: 'dog', value: 'dog' },
  ]
}]

test('Turns pql into a pql config', () => {
  const resultToTest = getConfigsFromPql(input)

  expect(resultToTest).toEqual(output)
})

const inputTwo = 'Animal={type=("cat", "dog") AND color=("purple", "red")}'

const outputTwo = [
  {
    businessObjectName: 'Animal',
    key: 'type',
    options: [
      { label: 'cat', value: 'cat' },
      { label: 'dog', value: 'dog' },
    ]
  },
  {
    businessObjectName: 'Animal',
    key: 'color',
    options: [
      { label: 'purple', value: 'purple' },
      { label: 'red', value: 'red' },
    ]
  },
]

test('Turns pql into multiple pql configs', () => {
  const resultToTest = getConfigsFromPql(inputTwo)

  expect(resultToTest).toEqual(outputTwo)
})
