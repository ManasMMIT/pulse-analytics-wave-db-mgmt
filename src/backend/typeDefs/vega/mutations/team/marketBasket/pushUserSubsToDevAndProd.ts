import { gql } from 'apollo-server-express'

const pushUserSubsToDevAndProdTypeDefs = gql`
  input PushUserSubsToDevAndProdInput {
    clientTeamId: ID!
  }
`

export default pushUserSubsToDevAndProdTypeDefs
