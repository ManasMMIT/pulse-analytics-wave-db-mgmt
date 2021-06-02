import { gql } from 'apollo-server-express'

const deleteVegaPersonRoleTypeDefs = gql`
  input DeleteVegaPersonRoleInput {
    id: ID!
  }
`

export default deleteVegaPersonRoleTypeDefs
