import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import Select from 'react-select'
import _ from 'lodash'
import Spinner from 'frontend/components/Spinner'
import { customSelectStyles } from '../../../../components/customSelectStyles'

import { GET_SOURCE_PRODUCTS } from '../../../../api/queries'

const formatProductStrings = (products) =>
  products.map(({ _id, nameGeneric, nameBrand }) => {
    const str = `${nameBrand} (${nameGeneric})`
    return { value: _id, label: str }
  })

const ProductsSelect = ({ products, handleChange }) => {
  const { data, loading, error } = useQuery(GET_SOURCE_PRODUCTS)

  if (error) return <div style={{ color: 'red' }}>Error processing request</div>
  if (loading) return <Spinner />

  const { products: defaultProducts } = data
  const productsByKey = _.keyBy(defaultProducts, '_id')

  return (
    <Select
      defaultValue={formatProductStrings(products)}
      isMulti
      options={formatProductStrings(defaultProducts)}
      className="basic-multi-select"
      classNamePrefix="select"
      styles={customSelectStyles}
      onChange={(arrOfVals) => {
        let newProducts = arrOfVals || []

        newProducts = newProducts.map(({ value }) => {
          const { __typename, ...product } = productsByKey[value]
          return product
        })

        // ! HACK: Mock HTML event.target structure to get tags
        // ! able to written into Form's local state by handleChange
        handleChange({ target: { name: 'products', value: newProducts } })
      }}
    />
  )
}

export default ProductsSelect
