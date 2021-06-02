import { gql } from 'apollo-server-express'

const updateVegaPersonTypeDefs = gql`
  input UpdateVegaPersonInput {
    id: ID!
    primary_state_id: ID
    role_id: ID
  }
`

export default updateVegaPersonTypeDefs
