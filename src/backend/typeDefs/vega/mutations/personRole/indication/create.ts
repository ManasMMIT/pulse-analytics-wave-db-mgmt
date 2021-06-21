import { gql } from 'apollo-server-express'

const createVegaPersonRoleIndicationTypeDefs = gql`
  input CreateVegaPersonRoleIndicationInput {
    specialty_label: String!
    person_role_id: ID!
    indication_id: ID!
  }
`

export default createVegaPersonRoleIndicationTypeDefs
