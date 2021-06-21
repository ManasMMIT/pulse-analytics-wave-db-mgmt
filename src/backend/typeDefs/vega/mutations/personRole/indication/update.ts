import { gql } from 'apollo-server-express'

const updateVegaPersonRoleIndicationTypeDefs = gql`
  input UpdateVegaPersonRoleIndicationInput {
    id: ID!
    specialty_label: String
  }
`

export default updateVegaPersonRoleIndicationTypeDefs
