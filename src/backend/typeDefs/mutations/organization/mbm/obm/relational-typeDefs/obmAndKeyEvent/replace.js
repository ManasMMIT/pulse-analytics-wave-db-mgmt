const { gql } = require('apollo-server-express')

const connectObmAndKeyEventTypeDefs = gql`
  input ConnectObmAndKeyEventInput {
    obmId: ID!
    keyEvents: [ObmKeyEventInput!]!
  }

  input ObmKeyEventInput {
    _id: ID!
    obmId: String!
    date: String
    title: String
    description: String
    link: String
    internalTdgNote: String
  }
`

module.exports = connectObmAndKeyEventTypeDefs
