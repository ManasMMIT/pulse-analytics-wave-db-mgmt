import { gql } from 'apollo-server-express'

const deleteLbmOrganizationTypeDefs = gql`
  input DeleteLbmOrganizationInput {
    _id: ID!
  }
`

export default deleteLbmOrganizationTypeDefs
