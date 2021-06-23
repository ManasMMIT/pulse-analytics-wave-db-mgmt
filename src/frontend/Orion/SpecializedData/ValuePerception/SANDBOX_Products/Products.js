import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import _ from 'lodash'

import { GET_VEGA_PRODUCTS } from 'frontend/api/queries'

import UpdateProduct from './UpdateProduct'

const Products = () => {
  const { data: productsData, loading: productsLoading } = useQuery(
    GET_VEGA_PRODUCTS
  )

  if (productsLoading) return <div>Loading...</div>

  return (
    <div>
      <h1>Products</h1>
      {productsData.vegaProducts.map((product) => (
        <UpdateProduct key={product.id} {...product} />
      ))}
    </div>
  )
}

export default Products
