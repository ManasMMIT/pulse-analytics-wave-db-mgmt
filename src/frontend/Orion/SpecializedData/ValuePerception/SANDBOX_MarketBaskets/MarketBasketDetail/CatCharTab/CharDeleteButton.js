import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/react-hooks'
import _ from 'lodash'

import {
  GET_MARKET_BASKETS_CATEGORIES
} from 'frontend/api/queries'

import {
  DELETE_MARKET_BASKET_CATEGORY_CHARACTERISTIC,
} from 'frontend/api/mutations'

const CharDeleteButton = ({ categoryId, id }) => {
  const { marketBasketId } = useParams()
  const { data: marketBasketCategoryData } = useQuery(GET_MARKET_BASKETS_CATEGORIES, { variables: { marketBasketId } })
  const [deleteMarketBasketCategoryCharacteristic] = useMutation(DELETE_MARKET_BASKET_CATEGORY_CHARACTERISTIC, {
    variables: { input: { id } },
    update: (cache, { data: { deleteMarketBasketCategoryCharacteristic } }) => {
      const clonedCategoryData = _.cloneDeep(marketBasketCategoryData.marketBasketsCategories)
      const categoryInQuestionIdx = clonedCategoryData.findIndex(({ id }) => id === categoryId)

      clonedCategoryData[categoryInQuestionIdx].characteristics_full = clonedCategoryData[categoryInQuestionIdx].characteristics_full
        .filter(({ id }) => id !== deleteMarketBasketCategoryCharacteristic.id)

      cache.writeQuery({
        query: GET_MARKET_BASKETS_CATEGORIES,
        variables: { marketBasketId },
        data: { marketBasketsCategories: clonedCategoryData }
      })
    },
    onError: alert,
  })

  const handleClick = e => {
    e.preventDefault()
    e.stopPropagation()
    deleteMarketBasketCategoryCharacteristic()
  }

  return (
    <button onClick={handleClick}>Delete Me</button>
  )
}

export default CharDeleteButton
