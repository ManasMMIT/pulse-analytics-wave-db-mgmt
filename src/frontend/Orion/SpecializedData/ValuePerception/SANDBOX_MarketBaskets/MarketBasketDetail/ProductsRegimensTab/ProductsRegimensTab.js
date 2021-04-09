import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import _ from 'lodash'

import { GET_MARKET_BASKETS } from 'frontend/api/queries'

import Spinner from 'frontend/components/Spinner'
import Table from 'frontend/components/Table'
import MultiSelectColumnFilter from 'frontend/components/Table/custom-filters/MultiSelect/MultiSelectColumnFilter'
import customMultiSelectFilterFn from 'frontend/components/Table/custom-filters/MultiSelect/customMultiSelectFilterFn'
import { CONFIG_TABLE_WIDTH } from 'frontend/components/Table/tableWidths'

import CreateForm from './CreateForm'
import UpdateForm from './UpdateForm'

const PRODUCT_TABLE_COLUMNS = [
  {
    Header: 'Product',
    accessor: 'product',
    Filter: MultiSelectColumnFilter,
    filter: customMultiSelectFilterFn,
    sortType: 'text',
    sticky: 'left',
  },
  {
    Header: 'Manufacturers',
    accessor: 'manufacturers',
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
  },
]

const ProductsRegimensTab = () => {
  const { marketBasketId } = useParams()

  const { data, loading } = useQuery(GET_MARKET_BASKETS)

  if (loading) return <Spinner />

  const marketBasket = data.marketBaskets.find(
    ({ id }) => id === marketBasketId
  )
  const { products_regimens } = marketBasket || { products_regimens: [] }

  const tableData = getTableData(products_regimens)

  return (
    <div>
      <h2>Products & Regimens</h2>
      <CreateForm />
      <Table
        width={CONFIG_TABLE_WIDTH}
        data={tableData}
        columns={PRODUCT_TABLE_COLUMNS}
      />
      {products_regimens.length && (
        <UpdateForm product={products_regimens[0].product} />
      )}
    </div>
  )
}

export default ProductsRegimensTab

const getTableData = (products_regimens) => {
  const groupedProdRegCombos = _.groupBy(
    products_regimens,
    'product.generic_name'
  )
  const tableData = Object.entries(groupedProdRegCombos).reduce(
    (acc, [genericName, regimenCombos]) => {
      const regimens = regimenCombos
        .map(({ regimen: { name } }) => name)
        .join(', ')
      const manufacturers = _.uniq(regimenCombos
        .map(({ product: { manufacturers } }) => manufacturers.map(({ name }) => name).join(',')))
      const nestedComboObj = {
        product: genericName,
        regimens,
        manufacturers,
      }
      return [...acc, nestedComboObj]
    },
    []
  )
  return tableData
}
