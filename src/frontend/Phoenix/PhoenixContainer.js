import React from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo';

import Phoenix from './Phoenix'

const GET_INITIAL_STATE = gql`
  query initialState {
    clients @rest(type: "Client", path: "/clients") {
      id
      name
      description
    }
    selectedClient @client {
      id
      name
      description
    }
    # teams @client {
    #   id
    #   name
    #   description
    # }
  }
`

const PhoenixContainer = () => (
  <Query query={GET_INITIAL_STATE}>
    {({ data, loading, error }) => {
      if (loading) return null
      if (error) return <p>ERROR</p>

      return <Phoenix data={data} />
    }}
  </Query>
)

export default PhoenixContainer

// const queryConfig = {
//   options: props => {
//     debugger
//     return null
//   }
// }

// export default graphql(GET_INITIAL_STATE, queryConfig)(Phoenix)
