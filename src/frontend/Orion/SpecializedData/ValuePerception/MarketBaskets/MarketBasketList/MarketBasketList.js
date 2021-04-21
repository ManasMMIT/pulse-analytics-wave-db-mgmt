import React, { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { Link } from 'react-router-dom'
import { MODAL_TABLE_WIDTH } from 'frontend/components/Table/tableWidths'

import Modal from 'frontend/components/Modal'
import Button from 'frontend/components/Button'
import Spinner from 'frontend/components/Spinner'
import Table from 'frontend/components/Table'
import MultiSelectColumnFilter from 'frontend/components/Table/custom-filters/MultiSelect/MultiSelectColumnFilter'
import customMultiSelectFilterFn from 'frontend/components/Table/custom-filters/MultiSelect/customMultiSelectFilterFn'
import {
  Button as PulseButton,
  UnderlinedTabs,
  Tag,
} from '@pulse-analytics/pulse-design-system'

import _ from 'lodash'
import MarketBasketForm from '../MarketBasketForm'
import { GET_MARKET_BASKETS } from 'frontend/api/queries'

const COLUMNS = [
  {
    Header: 'Market Basket',
    accessor: 'name',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    sticky: 'left',
    Cell: ({
      value,
      row: {
        original: { id },
      },
    }) => (
      <Link to={`/orion/specialized/value-perception/market-baskets/${id}`}>
        {value}
      </Link>
    ),
  },
  {
    Header: 'Last Survey Date',
    accessor: 'placeholderSurveyDate',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: '# Surveys',
    accessor: 'placeholderSurveyLen',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Indication',
    accessor: 'indication',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    Cell: ({ value }) => value && value.name,
  },
  {
    Header: 'Products',
    accessor: 'products_regimens',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    Cell: ({ value }) =>
      _.uniq(value.map(({ product: { generic_name } }) => generic_name)).join(
        ', '
      ),
  },
  {
    Header: '# Stakeholders (last survey)',
    accessor: 'placeholderLastSurveyStakeholder',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
  {
    Header: 'Active Client Subscriptions',
    accessor: 'team_subscriptions',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    Cell: ({ value }) => {
      const teamClientNames = value.map(
        ({
          team: {
            client: { name: clientName },
          },
        }) => clientName
      )

      return _.uniq(teamClientNames)
        .sort((a, b) => a.toLowerCase() - b.toLowerCase())
        .join(', ')
    },
  },
]

const MarketBasketList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { data, loading } = useQuery(GET_MARKET_BASKETS)

  const table = loading ? (
    <>
      <Spinner />
      <Table
        width={MODAL_TABLE_WIDTH}
        data={[]}
        columns={COLUMNS}
        exportStyle={{ margin: 24 }}
        exportProps={{ filename: 'market-basket-list' }}
      />
    </>
  ) : (
    <Table
      width={MODAL_TABLE_WIDTH}
      data={data.marketBaskets}
      columns={COLUMNS}
      exportStyle={{ margin: 24 }}
      exportProps={{ filename: 'market-basket-list' }}
    />
  )

  return (
    <div>
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
      <Button onClick={() => setIsModalOpen(true)}>
        + Create Market Basket
      </Button>
      <Modal
        show={isModalOpen}
        modalStyle={{ height: 600, width: 800 }}
        handleClose={() => setIsModalOpen(false)}
      >
        <MarketBasketForm onCompleted={() => setIsModalOpen(false)} />
      </Modal>
      {table}
    </div>
  )
}

export default MarketBasketList
