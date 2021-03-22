import { nest } from 'd3-collection'
import { useQuery } from '@apollo/react-hooks'
import { GET_TEAMS } from 'frontend/api/queries'
import Spinner from 'frontend/components/Spinner'
import _ from 'lodash'
import React from 'react'
import { Link, useParams } from 'react-router-dom'

import useMarketBasketData from './../useMarketBasketData'

const TeamSection = ({ teamSubscriptions }) => {
  const { data, loading } = useQuery(GET_TEAMS)

  if (loading) return <Spinner />
  const { teams } = data
  const teamsByUuid = _.keyBy(teams, 'uuid')
  const teamSubsHydrated = teamSubscriptions.map(({ team, ...rest }) => ({
    team: teamsByUuid[team],
    client: teamsByUuid[team].client,
    ...rest,
  }))

  const subsByClientThenTeam = nest()
    .key(row => row.client.description)
    .key(row => row.team.description)
    .rollup(row => row[0])
    .object(teamSubsHydrated)

  const clientTeamNodes = Object.entries(subsByClientThenTeam).map(([client, teamsObj]) => {
    return (
      <div key={client}>
        <div>{client}</div>
        <ul>
          {
            Object.entries(teamsObj).map(([teamName, sub]) => {
              return <li key={teamName}>{teamName}</li>
            })
          }
        </ul>
      </div>
    )
  })

  return (
    <>
      <h3>Client-Team Subs</h3>
      { clientTeamNodes}
    </>
  )
}

const MarketBasketDetail = () => {
  const { marketBasketId } = useParams()
  const { marketBaskets, loading } = useMarketBasketData()
  if (loading) return <Spinner />
  const { name, products, team_subscriptions: teamSubscriptions } = marketBaskets.find(({ id }) => id === marketBasketId)
  const uniqRegs = _.uniqBy(products.reduce((acc, { regimens }) => [...acc, ...regimens], []), 'id')

  return (
    <div>
      <Link to="/orion/configuration/market-baskets/">Back</Link>
      <h1>{name}</h1>
      <h2>Products</h2>
      <ul>
        {
          products.map(({ id, generic_name, brand_name }) => (
            <li key={id}>{brand_name ? `${generic_name} (${brand_name})` : generic_name}</li>
          ))
        }
      </ul>
      <h2>Products' Unique Regimens</h2>
      <ul>
        {
          uniqRegs.map(({ id, name }) => (
            <li key={id}>{name}</li>
          ))
        }
      </ul>
      <TeamSection teamSubscriptions={teamSubscriptions} />
    </div>
  )
}

export default MarketBasketDetail
