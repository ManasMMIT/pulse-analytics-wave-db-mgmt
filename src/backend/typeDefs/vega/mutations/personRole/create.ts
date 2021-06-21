import { gql } from 'apollo-server-express'

const createVegaPersonRoleTypeDefs = gql`
  input CreateVegaPersonRoleInput {
    name: String!
    default_specialty_label: String
    type_id: ID
  }
`

export default createVegaPersonRoleTypeDefs
