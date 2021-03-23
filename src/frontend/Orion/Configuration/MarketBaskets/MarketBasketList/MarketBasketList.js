import React, { useState } from 'react'

import { MODAL_TABLE_WIDTH } from 'frontend/components/Table/tableWidths'

import Modal from 'frontend/components/Modal'
import Button from 'frontend/components/Button'
import Spinner from 'frontend/components/Spinner'
import Table from 'frontend/components/Table'
import MultiSelectColumnFilter from 'frontend/components/Table/custom-filters/MultiSelect/MultiSelectColumnFilter'
import customMultiSelectFilterFn from 'frontend/components/Table/custom-filters/MultiSelect/customMultiSelectFilterFn'

import useMarketBasketListData from '../data-hooks/useMarketBasketData'
import _ from 'lodash'
import MarketBasketForm from '../MarketBasketForm'

const COLUMNS = [
  {
    Header: 'Market Basket',
    accessor: 'name',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    sticky: 'left',
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
    Cell: ({ value }) => value || <Spinner />,
  },
  {
    Header: 'Products',
    accessor: 'products',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    Cell: ({ value }) => {
      if (Array.isArray(value) && _.isEmpty(value))
        return ''
      else if (typeof value === 'string') {
        return value
      }
      else if (Array.isArray(value))
        return <Spinner />
    },
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
    accessor: 'placeholderActiveClientSubscriptions',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
  },
]

const MarketBasketList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [{
    marketBaskets: { data: { hydrated } },
    loading,
  }] = useMarketBasketListData()

  const table = loading
    ? (
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
    )
    : (
      <Table
        width={MODAL_TABLE_WIDTH}
        data={hydrated}
        columns={COLUMNS}
        exportStyle={{ margin: 24 }}
        exportProps={{ filename: 'market-basket-list' }}
      />
    )

  return (
    <div>
      <Button onClick={() => setIsModalOpen(true)}>+ Create Market Basket</Button>
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
