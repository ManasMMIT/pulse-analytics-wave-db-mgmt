import { gql } from 'apollo-server-express'

const updateVegaPersonRoleTypeDefs = gql`
  input UpdateVegaPersonRoleInput {
    id: ID!
    name: String
    default_specialty_label: String
    type_id: ID
  }
`

export default updateVegaPersonRoleTypeDefs
