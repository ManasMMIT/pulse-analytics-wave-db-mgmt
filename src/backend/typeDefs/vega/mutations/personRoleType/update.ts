import { gql } from 'apollo-server-express'

const updateVegaPersonRoleTypeTypeDefs = gql`
  input UpdateVegaPersonRoleTypeInput {
    id: ID!
    name: String
  }
`

export default updateVegaPersonRoleTypeTypeDefs
