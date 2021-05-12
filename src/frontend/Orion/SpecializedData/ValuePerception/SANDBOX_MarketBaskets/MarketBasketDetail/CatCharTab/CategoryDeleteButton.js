import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/react-hooks'

import {
  GET_MARKET_BASKETS_CATEGORIES
} from 'frontend/api/queries'

import {
  DELETE_MARKET_BASKET_CATEGORY,
} from 'frontend/api/mutations'

const CategoryDeleteButton = ({ id }) => {
  const { marketBasketId } = useParams()
  const { data: marketBasketCategoryData } = useQuery(GET_MARKET_BASKETS_CATEGORIES, { variables: { marketBasketId } })
  const [deleteMarketBasketCategory] = useMutation(DELETE_MARKET_BASKET_CATEGORY, {
    variables: { input: { id } },
    update: (cache, { data: { deleteMarketBasketCategory } }) => {
      const newCachedCategories = marketBasketCategoryData.marketBasketsCategories
        .filter(({ id }) => id !== deleteMarketBasketCategory.id)

      cache.writeQuery({
        query: GET_MARKET_BASKETS_CATEGORIES,
        variables: { marketBasketId },
        data: { marketBasketsCategories: newCachedCategories }
      })
    },
    onError: alert,
  })

  const handleClick = e => {
    e.preventDefault()
    e.stopPropagation()
    deleteMarketBasketCategory()
  }

  return (
    <button onClick={handleClick}>Delete Me</button>
  )
}

export default CategoryDeleteButton
