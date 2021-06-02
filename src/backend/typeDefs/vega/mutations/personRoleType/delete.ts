import { gql } from 'apollo-server-express'

const deleteVegaPersonRoleTypeTypeDefs = gql`
  input DeleteVegaPersonRoleTypeInput {
    id: ID!
  }
`

export default deleteVegaPersonRoleTypeTypeDefs
