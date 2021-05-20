import React, { useState } from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { useParams } from 'react-router-dom'
import Select from 'react-select'
import _ from 'lodash'

import { CREATE_MARKET_BASKET_CATEGORY } from 'frontend/api/mutations'

import Button from 'frontend/components/Button'
import { GET_MARKET_BASKETS_CATEGORIES } from 'frontend/api/queries'

const FORM_STYLE = {
  padding: 12,
  margin: 12,
  border: '1px solid grey',
}

// This field is an enum in the database. Not sure how to expose the enum to Polaris, so hardcoded for now.
const CATEGORY_TYPE_OPTIONS = [
  { label: 'product', value: 'product' },
  { label: 'regimen', value: 'regimen' },
  { label: 'manufacturer', value: 'manufacturer' },
]

const formDataSchema = {
  name: undefined,
  category_type: undefined,
  prompt: undefined,
}

const CategoryCreateForm = () => {
  const { marketBasketId } = useParams()
  const [formData, setFormData] = useState(formDataSchema)

  const {
    data: marketBasketCategoryData,
  } = useQuery(GET_MARKET_BASKETS_CATEGORIES, { variables: { marketBasketId } })

  const [createMarketBasketCategory] = useMutation(
    CREATE_MARKET_BASKET_CATEGORY,
    {
      update: (cache, { data: { createMarketBasketCategory } }) => {
        const oldCachedCategories =
          marketBasketCategoryData.marketBasketsCategories
        const orderedFullSetOfCategries = _.orderBy(
          [...oldCachedCategories, createMarketBasketCategory],
          '_order'
        )

        cache.writeQuery({
          query: GET_MARKET_BASKETS_CATEGORIES,
          variables: { marketBasketId },
          data: { marketBasketsCategories: orderedFullSetOfCategries },
        })
      },
      variables: {
        input: { market_basket: marketBasketId, ...formData },
      },
    }
  )

  const handleCreate = (e) => {
    e.preventDefault()
    createMarketBasketCategory()
  }

  const handleNameOnChange = ({ target: { value } }) => {
    setFormData((prevState) => ({ ...prevState, name: value }))
  }

  const handlePromptOnChange = ({ target: { value } }) => {
    setFormData((prevState) => ({ ...prevState, prompt: value }))
  }

  const handleCategoryTypeOnChange = ({ value }) => {
    setFormData((prevState) => ({ ...prevState, category_type: value }))
  }

  return (
    <form style={FORM_STYLE} onSubmit={handleCreate}>
      <h3>Category Create Form</h3>
      <label>Name (required)</label>
      <input value={formData.name} onChange={handleNameOnChange} />
      <label>Category Type (required)</label>
      <Select
        options={CATEGORY_TYPE_OPTIONS}
        onChange={handleCategoryTypeOnChange}
      />
      <label>Prompt</label>
      <input value={formData.prompt} onChange={handlePromptOnChange} />
      <Button>Create Category</Button>
    </form>
  )
}

export default CategoryCreateForm
