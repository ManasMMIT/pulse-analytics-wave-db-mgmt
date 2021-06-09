import { gql } from 'apollo-server-express'

const deleteVegaPersonRoleIndicationTypeDefs = gql`
  input DeleteVegaPersonRoleIndicationInput {
    id: ID!
  }
`

export default deleteVegaPersonRoleIndicationTypeDefs
