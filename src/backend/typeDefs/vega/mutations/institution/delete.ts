import { gql } from 'apollo-server-express'

const deleteVegaInstitutionTypeDefs = gql`
  input DeleteVegaInstitutionInput {
    id: ID!
  }
`

export default deleteVegaInstitutionTypeDefs
