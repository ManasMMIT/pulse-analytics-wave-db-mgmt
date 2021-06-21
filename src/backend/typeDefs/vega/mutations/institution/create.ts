import { gql } from 'apollo-server-express'

const createVegaInstitutionTypeDefs = gql`
  input CreateVegaInstitutionInput {
    name: String!
  }
`

export default createVegaInstitutionTypeDefs
