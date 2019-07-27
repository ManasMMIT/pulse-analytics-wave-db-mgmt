import React from 'react'
import { GET_CLIENTS } from '../api/queries'
import { SELECT_CLIENT } from '../api/mutations'
import { Query, Mutation } from 'react-apollo';

import Phoenix from './Phoenix'

// const PhoenixContainer = () => (
//   <Query query={GET_CLIENTS}>
//     {({ _, loading, error }) => {
//       if (loading) return null
//       if (error) return <p>ERROR</p>

//       return (
//         <Mutation mutation={SELECT_CLIENT}>
//           {(selectClient, { data }) => {
//             return <Phoenix selectClient={selectClient} data={data} />
//           }}
//         </Mutation>
//       )
//     }}
//   </Query>
// )

export default Phoenix
