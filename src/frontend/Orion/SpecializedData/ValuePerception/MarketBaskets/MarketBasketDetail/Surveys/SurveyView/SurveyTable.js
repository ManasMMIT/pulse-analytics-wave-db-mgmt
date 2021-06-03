import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import _ from 'lodash'
import { nest } from 'd3-collection'

import { GET_MARKET_BASKET_SURVEY_EXPORT_DATA } from 'frontend/api/queries'

import Spinner from 'frontend/components/Spinner'
import Table from 'frontend/components/Table'
import { CONFIG_TABLE_WIDTH } from 'frontend/components/Table/tableWidths'

const SurveyTable = ({
  surveyId,
  selectedCategory,
  marketBasketsCategories,
}) => {
  const { data: marketBasketsSurveysQuestions, loading } = useQuery(
    GET_MARKET_BASKET_SURVEY_EXPORT_DATA,
    {
      variables: { surveyId },
    }
  )
  if (loading) return <Spinner />

  const dataByCategory = _.groupBy(
    Object.values(marketBasketsSurveysQuestions)[0],
    'category_id'
  )

  const { value: categoryId } = selectedCategory
  const selectedCategoryData = dataByCategory[categoryId] || []

  const characteristics = _.uniq(
    selectedCategoryData.map(({ characteristic_name }) => characteristic_name)
  )

  const tableDataObject = nest()
    .key(({ first_name, last_name, product_id, regimen_id, manufacturer_id }) => `${first_name} ${last_name} ${product_id} ${regimen_id} ${manufacturer_id}`)
    .rollup((arr) => {
      const [{ first_name, last_name, characteristic_name, rating, regimen_name, product_brand_name, product_generic_name, manufacturer_name }] = arr
      const datum = {
        stakeholder: `${first_name} ${last_name}`,
        [characteristic_name]: rating,
        regimen_name,
        product_brand_name,
        product_generic_name,
        manufacturer_name,
      }

      return datum
    })
    .object(selectedCategoryData)

  const tableData = Object.values(tableDataObject)

  let columns = [
    {
      Header: 'Stakeholder',
      accessor: 'stakeholder',
      sortType: 'text',
    },
  ]

  characteristics.forEach((name) => {
    columns.push({
      Header: name,
      accessor: name,
    })
  })

  columns = columns.concat([
    {
      Header: 'Regimen',
      accessor: 'regimen_name',
      sortType: 'text',
    },
    {
      Header: 'Product (brand)',
      accessor: 'product_brand_name',
      sortType: 'text',
    },
    {
      Header: 'Product (generic)',
      accessor: 'product_generic_name',
      sortType: 'text',
    },
    {
      Header: 'Manufacturer',
      accessor: 'manufacturer_name',
      sortType: 'text',
    },
  ])

  const data = Object.values(tableData)

  return (
    <div>
      <Table
        width={'auto'}
        data={data}
        columns={columns}
        exportStyle={{ margin: 24 }}
        showExportButton={false}
      />
    </div>
  )
}

export default SurveyTable
