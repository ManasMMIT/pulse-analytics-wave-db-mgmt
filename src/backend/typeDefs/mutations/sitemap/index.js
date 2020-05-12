const { gql } = require('apollo-server-express')

const updateSitemapTypeDefs = require('./update')
const createSourceNodeTypeDefs = require('./createSourceNode')
const updateTdgTimestampsTypeDefs = require('./updateTdgTimestamps')

// need to create NodeInput of type Input, otherwise server fails:
// https://stackoverflow.com/questions/52139654/how-to-deal-with-nested-input-in-graphql
const nodeInputTypedef = gql`
  input NodeInput {
    _id: ID
    name: String
    type: String
    componentPath: String
    text: JSON
    subtitle: String
    caption: String
    order: Int
    parentId: String
    schemaVersion: String
    resources: JSON
    icon: String # TODO: deprecate and change to iconId
  }
`

module.exports = [
  nodeInputTypedef,
  updateSitemapTypeDefs,
  createSourceNodeTypeDefs,
  updateTdgTimestampsTypeDefs,
]
