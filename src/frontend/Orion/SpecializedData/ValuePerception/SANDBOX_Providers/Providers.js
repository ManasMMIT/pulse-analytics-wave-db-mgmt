import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import _ from 'lodash'

import { GET_VEGA_PROVIDERS } from 'frontend/api/queries'

import UpdateProvider from './UpdateProvider'

const Providers = () => {
  const { data: providersData, loading: providersLoading } = useQuery(
    GET_VEGA_PROVIDERS
  )

  if (providersLoading) return <div>Loading...</div>

  const testProvider = _.sortBy(
    providersData.vegaProviders,
    ({ name }) => name
  )[0]

  return (
    <div>
      <h1>Providers</h1>
      <UpdateProvider key={testProvider.id} provider={testProvider} />
      {/* {providersData.vegaProviders.map(provider => (
        <UpdateProvider key={provider.id} provider={provider} />
      ))} */}
    </div>
  )
}

export default Providers
