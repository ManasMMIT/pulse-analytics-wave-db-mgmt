import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Button as PulseButton,
  UnderlinedTabs,
  Tag,
} from '@pulse-analytics/wave-design-system'

import Spinner from 'frontend/components/Spinner'
import Modal from 'frontend/components/Modal'
import Button from 'frontend/components/Button'

import MarketBasketForm from '../MarketBasketForm'
import { useQuery } from '@apollo/react-hooks'
import { GET_MARKET_BASKETS } from 'frontend/api/queries'
import Table from 'frontend/components/Table'
import MultiSelectColumnFilter from 'frontend/components/Table/custom-filters/MultiSelect/MultiSelectColumnFilter'
import customMultiSelectFilterFn from 'frontend/components/Table/custom-filters/MultiSelect/customMultiSelectFilterFn'
import { CONFIG_TABLE_WIDTH } from 'frontend/components/Table/tableWidths'

const PRODUCT_TABLE_COLUMNS = [
  {
    Header: 'Product',
    accessor: 'generic_name',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    sticky: 'left',
  },
  {
    Header: 'Manufacturers',
    accessor: 'manufacturersPlaceholder',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    sticky: 'left',
  },
  {
    Header: 'Regimens',
    accessor: 'regimens',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    Cell: ({ value }) => value.map(({ name }) => name).join(', '),
  },
]

const MarketBasketDetail = () => {
  const { marketBasketId } = useParams()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data, loading } = useQuery(GET_MARKET_BASKETS)
  if (loading) return <Spinner />
  const marketBasket = data.marketBaskets.find(
    ({ id }) => id === marketBasketId
  )

  // ! after deletion, market basket doesn't exist in cache before redirect
  if (!marketBasket) return <Spinner />
  const {
    id,
    name,
    indication,
    description,
    products,
    team_subscriptions: teamSubscriptions,
  } = marketBasket

  const formData = { id, name, indication: indication.id, description }

  return (
    <div>
      <Link to="/orion/configuration/market-baskets">Back</Link>
      <PulseButton text={'hello'} />
      <UnderlinedTabs
        tabsData={[
          {
            value: 'Label as React ele',
            label: <div>Label as React ele, div</div>,
          },
          {
            value: 'Just a String',
            label: 'Just a String',
          },
        ]}
      />
      <Tag>hello!</Tag>
      <h1>Market Basket Overview</h1>
      <h2>Market Basket Details</h2>
      <div>
        <Button onClick={() => setIsModalOpen(true)}>
          Edit Market Basket Details
        </Button>
        <Modal
          show={isModalOpen}
          modalStyle={{ height: 600, width: 800 }}
          handleClose={() => setIsModalOpen(false)}
        >
          <MarketBasketForm
            onCompleted={() => setIsModalOpen(false)}
            data={formData}
          />
        </Modal>
      </div>
      <div>{name}</div>
      <h2>Indication</h2>
      <div>{indication.name}</div>
      <h2>Description</h2>
      <div>{description}</div>
      <hr />
      <h2>Products & Regimens</h2>
      <Table
        width={CONFIG_TABLE_WIDTH}
        data={products}
        columns={PRODUCT_TABLE_COLUMNS}
      />
    </div>
  )
}

export default MarketBasketDetail
