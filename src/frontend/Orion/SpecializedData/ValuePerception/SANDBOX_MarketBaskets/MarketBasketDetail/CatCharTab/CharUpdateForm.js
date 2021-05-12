import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { useParams } from 'react-router-dom'
import _ from 'lodash'

import { UPDATE_MARKET_BASKET_CATEGORY_CHARACTERISTIC } from 'frontend/api/mutations'
import { GET_MARKET_BASKETS_CATEGORIES } from 'frontend/api/queries'

import Button from 'frontend/components/Button'

const FORM_STYLE = {
  padding: 12,
  margin: 12,
  border: '1px solid grey',
}

const formDataSchema = {
  id: undefined,
  name: undefined,
  description: undefined,
}

const CharUpdateForm = () => {
  const { marketBasketId } = useParams()
  const [
    formData,
    setFormData,
  ] = useState(formDataSchema)

  const { data: marketBasketCategoryData, loading } = useQuery(GET_MARKET_BASKETS_CATEGORIES, { variables: { marketBasketId } })

  useEffect(() => {
    if (!loading) {
      const exampleCategory = (
        marketBasketCategoryData.marketBasketsCategories
        && marketBasketCategoryData.marketBasketsCategories[0]
      )

      const {
        id,
        name,
        description,
      } = exampleCategory.characteristics_full[0] || {}

      setFormData({
        id,
        name,
        description,
      })
    }
  }, [loading])

  const [updateMarketBasketCategoryCharacteristic] = useMutation(UPDATE_MARKET_BASKET_CATEGORY_CHARACTERISTIC, {
    variables: {
      input: formData,
    },
  })

  const handleUpdate = (e) => {
    e.preventDefault()
    updateMarketBasketCategoryCharacteristic()
  }

  const handleNameOnChange = ({ target: { value } }) => {
    setFormData(prevState => ({ ...prevState, name: value }))
  }

  const handleDescriptionOnChange = ({ target: { value } }) => {
    setFormData(prevState => ({ ...prevState, description: value }))
  }

  return (
    <form style={FORM_STYLE} onSubmit={handleUpdate}>
      <h3>Characteristic Update Form</h3>
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
      <Button>Update Characteristic</Button>
    </form>
  )
}

export default CharUpdateForm
