import React, { useState } from 'react'
import { nest } from 'd3-collection'
import { Link, useParams } from 'react-router-dom'

import Spinner from 'frontend/components/Spinner'
import Modal from 'frontend/components/Modal'
import Button from 'frontend/components/Button'

import MarketBasketForm from '../MarketBasketForm'
import useMarketBasketData from './../data-hooks/useMarketBasketData'
import { useTeamsMap } from './../data-hooks/useEntityMap'
const TeamSection = ({ teamSubscriptions }) => {
  const { data, loading } = useTeamsMap()

  if (loading) return <Spinner />

  const teamSubsHydrated = teamSubscriptions.map(({ team, ...rest }) => ({
    team: data[team],
    client: data[team].client,
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

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [{
    marketBaskets: {
      data: {
        raw: [rawMarketBasket],
        hydrated: [hydratedMarketBasket]
      },
      loading,
    },
  }] = useMarketBasketData({ marketBasketId })
  if (loading || !hydratedMarketBasket) return <Spinner />

  const {
    name,
    indication,
    description,
    products,
    team_subscriptions: teamSubscriptions,
  } = hydratedMarketBasket

  const { id: rawId, name: rawName, indication: rawIndication } = rawMarketBasket

  return (
    <div>
      <Link to="/orion/configuration/market-baskets">Back</Link>
      <Button onClick={() => setIsModalOpen(true)}>Update Market Basket</Button>
      <Modal
        show={isModalOpen}
        modalStyle={{ height: 600, width: 800 }}
        handleClose={() => setIsModalOpen(false)}
      >
        <MarketBasketForm
          onCompleted={() => setIsModalOpen(false)}
          data={{ id: rawId, name: rawName, indication: rawIndication }}
        />
      </Modal>
      <h1>{name}</h1>
      <h2>Indication</h2>
      <div>{indication}</div>
      <h2>Description</h2>
      <div>{description}</div>
      <h2>Products</h2>
      <ul>
        {
          products.map(({ id, generic_name, brand_name }) => (
            <li key={id}>{brand_name ? `${generic_name} (${brand_name})` : generic_name}</li>
          ))
        }
      </ul>
      {/* <TeamSection teamSubscriptions={teamSubscriptions} /> */}
    </div>
  )
}

export default MarketBasketDetail
