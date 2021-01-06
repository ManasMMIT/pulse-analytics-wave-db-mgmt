import getChildNodes from '../getChildNodes'
const _ = require('lodash')

const nodes = require('./mocks/input/nodes-collection')
const nextResources = require('./mocks/input/next-resources')
const childNodes = require('./mocks/output/childNodes')

const nodesByParentId = _.groupBy(nodes, 'parentId')
const { nodeId } = nextResources

const result = getChildNodes(nodeId, nodesByParentId)

test('recursively generates all children successfully', () => {
  expect(result).toStrictEqual(childNodes)
})
