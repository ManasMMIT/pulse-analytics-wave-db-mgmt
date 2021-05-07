// ! Hardcoded to first characteristic for example

import React, { useState } from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { useParams } from 'react-router-dom'
import _ from 'lodash'

import { CREATE_MARKET_BASKET_CATEGORY_CHARACTERISTIC } from 'frontend/api/mutations'

import Button from 'frontend/components/Button'
import { GET_MARKET_BASKETS_CATEGORIES } from 'frontend/api/queries'

const FORM_STYLE = {
  padding: 12,
  margin: 12,
  border: '1px solid grey',
}

const formDataSchema = {
  name: undefined,
  description: undefined,
}

const CharCreateForm = () => {
  const { marketBasketId } = useParams()
  const [
    formData,
    setFormData,
  ] = useState(formDataSchema)

  const { data: marketBasketCategoryData, loading } = useQuery(GET_MARKET_BASKETS_CATEGORIES, { variables: { marketBasketId } })

  let exampleCategory
  if (!loading) {
    exampleCategory = (
      marketBasketCategoryData.marketBasketsCategories
      && marketBasketCategoryData.marketBasketsCategories[0]
    )
  }

  const [createMarketBasketCategoryCharacteristic] = useMutation(CREATE_MARKET_BASKET_CATEGORY_CHARACTERISTIC, {
    update: (cache, { data: { createMarketBasketCategoryCharacteristic } }) => {
      const clonedMarketBasketCategories = _.cloneDeep(marketBasketCategoryData.marketBasketsCategories)
      const newCategoryCharacteristicsFull = _.orderBy([
        ...clonedMarketBasketCategories[0].characteristics_full,
        createMarketBasketCategoryCharacteristic,
      ], '_order')

      clonedMarketBasketCategories[0].characteristics_full = newCategoryCharacteristicsFull

      cache.writeQuery({
        query: GET_MARKET_BASKETS_CATEGORIES,
        variables: { marketBasketId },
        data: { marketBasketsCategories: clonedMarketBasketCategories }
      })
    },
    variables: {
      input: { category: exampleCategory.id, ...formData },
    },
  })

  const handleCreate = (e) => {
    e.preventDefault()
    createMarketBasketCategoryCharacteristic()
  }

  const handleNameOnChange = ({ target: { value } }) => {
    setFormData(prevState => ({ ...prevState, name: value }))
  }

  const handleDescriptionOnChange = ({ target: { value } }) => {
    setFormData(prevState => ({ ...prevState, description: value }))
  }

  return (
    <form style={FORM_STYLE} onSubmit={handleCreate}>
      <h3>{`${exampleCategory.name} / Characteristic Create Form`}</h3>
      <label>Name (required)</label>
      <input
        value={formData.name}
        onChange={handleNameOnChange}
      />
      <label>Description</label>
      <input
        value={formData.description}
        onChange={handleDescriptionOnChange}
      />
      <Button>Create Characteristic</Button>
    </form>
  )
}

export default CharCreateForm
