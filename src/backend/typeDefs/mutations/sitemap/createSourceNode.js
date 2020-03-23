const { gql } = require('apollo-server-express')

const createSourceNodeInput = gql`
  input CreateSourceNodeInput {
    name: String!
    type: String!
    componentPath: String!
    text: JSON
    order: Int!
    parentId: String!
    # icon: String # TODO: deprecate and change to iconId
  }
`

module.exports = createSourceNodeInput
