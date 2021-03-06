const { gql } = require('apollo-server-express')

const deletePersonTypeDefs = gql`
  input DeletePersonInput {
    _id: ID!
  }

  type DeletePersonPayload {
    _id: ID
    firstName: String
    lastName: String
    middleName: String
    affiliation: String
    affiliationPosition: String
    primaryState: String
    email: String
    linkedIn: String
    externalLink: String
    nationalProviderIdentifier: Float
    physicianProfileId: Float
  }
`

module.exports = deletePersonTypeDefs
