import React from 'react'

import { MODAL_TABLE_WIDTH } from 'frontend/components/Table/tableWidths'

import Spinner from 'frontend/components/Spinner'
import Table from 'frontend/components/Table'
import MultiSelectColumnFilter from 'frontend/components/Table/custom-filters/MultiSelect/MultiSelectColumnFilter'
import customMultiSelectFilterFn from 'frontend/components/Table/custom-filters/MultiSelect/customMultiSelectFilterFn'

import useMarketBasketListData from './useMarketBasketListData'

const getColumns = (isHydrating) => [
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
    accessor: 'indication.name',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    Cell: ({ value }) => isHydrating ? <Spinner /> : value,
  },
  {
    Header: 'Products',
    accessor: 'products',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    Cell: ({ value }) => value[0] && typeof value[0] === 'string' ? <Spinner /> : value.map(({ name }) => name),
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
    marketBaskets: {
      data,
      loading,
      isHydrating,
    }
  }] = useMarketBasketListData()

  if (loading) return <Spinner />

  const columns = getColumns(isHydrating)

  return (
    <Table
      width={MODAL_TABLE_WIDTH}
      data={data}
      columns={columns}
      exportStyle={{ margin: 24 }}
      exportProps={{ filename: 'market-basket-list' }}
    />
  )
}

export default MarketBasketList
