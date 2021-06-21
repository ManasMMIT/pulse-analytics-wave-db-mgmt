import { gql } from 'apollo-server-express'

const createVegaPersonRoleTypeTypeDefs = gql`
  input CreateVegaPersonRoleTypeInput {
    name: String!
  }
`

export default createVegaPersonRoleTypeTypeDefs
