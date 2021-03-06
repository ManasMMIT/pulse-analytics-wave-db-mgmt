const { gql } = require('apollo-server-express')

const createPersonTypeDefs = gql`
  input CreatePersonInput {
    _id: ID # included but should always be null
    firstName: String!
    lastName: String!
    middleName: String
    affiliation: String
    affiliationPosition: String
    primaryState: String
    email: String
    linkedIn: String
    externalLink: String
    nationalProviderIdentifier: Float
    physicianProfileId: Float
    skipDupeCheck: Boolean
  }

  type CreatePersonPayload {
    _id: ID!
    createdOn: DateTime
    updatedOn: DateTime
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

module.exports = createPersonTypeDefs
