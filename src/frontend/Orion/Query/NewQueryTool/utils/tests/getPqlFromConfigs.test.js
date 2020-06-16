const getPqlFromConfigs = require('../getPqlFromConfigs')

const input = {
  businessObjectName: "Animal",
  configs: [{
    key: 'type',
    options: [
      { label: 'cat', value: 'cat' },
      { label: 'dog', value: 'dog' },
    ]
  }]
}

const output = 'Animal={type=("cat", "dog")}'


test('Takes a pql config and turns into valid pql', () => {
  const resultToTest = getPqlFromConfigs(input)

  expect(resultToTest).toBe(output)
})

const inputTwo = {
  businessObjectName: "Animal",
  configs: [
    {
      key: 'type',
      options: [
        { label: 'cat', value: 'cat' },
        { label: 'dog', value: 'dog' },
      ]
    },
    {
      key: 'color',
      options: [
        { label: 'purple', value: 'purple' },
        { label: 'red', value: 'red' },
      ],
    },
  ]
}

const outputTwo = 'Animal={type=("cat", "dog") AND color=("purple", "red")}'

test('Takes multiple pql configs and turns into valid pql', () => {
  const resultToTest = getPqlFromConfigs(inputTwo)

  expect(resultToTest).toBe(outputTwo)
})

const inputThree = {
  businessObjectName: "Animal",
  configs: [],
}

const outputThree = 'Animal={}'

test('Takes empty config array and returns just business object wrapper', () => {
  const resultToTest = getPqlFromConfigs(inputThree)

  expect(resultToTest).toBe(outputThree)
})

const inputFour = {
  businessObjectName: "Animal",
  configs: [{ key: 'age', options: [{ label: 1, value: 1 }, { label: 5, value: 5 }]}],
}

const outputFour = 'Animal={age=(1, 5)}'

test('Takes config object with int options and forms valid int pql', () => {
  const resultToTest = getPqlFromConfigs(inputFour)

  expect(resultToTest).toBe(outputFour)
})
