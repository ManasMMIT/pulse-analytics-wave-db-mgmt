import React from 'react'

import { MODAL_TABLE_WIDTH } from 'frontend/components/Table/tableWidths'

import Spinner from 'frontend/components/Spinner'
import Table from 'frontend/components/Table'
import MultiSelectColumnFilter from 'frontend/components/Table/custom-filters/MultiSelect/MultiSelectColumnFilter'
import customMultiSelectFilterFn from 'frontend/components/Table/custom-filters/MultiSelect/customMultiSelectFilterFn'

import useMarketBasketListData from './useMarketBasketListData'
import _ from 'lodash'

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
  const [{
    marketBaskets: { data: { hydrated } },
    loading,
  }] = useMarketBasketListData()

  if (loading) return (
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

  return (
    <Table
      width={MODAL_TABLE_WIDTH}
      data={hydrated}
      columns={COLUMNS}
      exportStyle={{ margin: 24 }}
      exportProps={{ filename: 'market-basket-list' }}
    />
  )
}

export default MarketBasketList
