import { gql } from 'apollo-server-express'

const updateVegaInstitutionTypeDefs = gql`
  input UpdateVegaInstitutionInput {
    id: ID!
    name: String
  }
`

export default updateVegaInstitutionTypeDefs
