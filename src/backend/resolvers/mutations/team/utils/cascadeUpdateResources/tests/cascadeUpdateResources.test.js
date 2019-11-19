const cascadeUpdateResources = require('../index')
const nodes = require('./mocks/input/nodes-collection')
const nextResources = require('./mocks/input/next-resources')
const demoTeam = require('./mocks/input/demo-team')
const updatedResources = require('./mocks/output/updatedResources')

const result = cascadeUpdateResources({
  nodes,
  nextResources,
  resourcesAcrossNodes: demoTeam.resources,
})

test('correctly cascade updates child resources', () => {
  expect(result).toStrictEqual(updatedResources)
})
