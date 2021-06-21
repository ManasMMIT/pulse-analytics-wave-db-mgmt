import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { useParams } from 'react-router-dom'
import Select from 'react-select'

import { UPDATE_MARKET_BASKET_CATEGORY } from 'frontend/api/mutations'

import Button from 'frontend/components/Button'
import { GET_MARKET_BASKETS } from 'frontend/api/queries'

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

const CategoryUpdateForm = () => {
  const { marketBasketId } = useParams()

  const [formData, setFormData] = useState(formDataSchema)

  const { data, loading } = useQuery(GET_MARKET_BASKETS, {
    variables: { marketBasketId },
  })

  useEffect(() => {
    if (!loading) {
      // ! HARDCODING FIRST MARKET BASKET CATEGORY FOR EXAMPLE
      const [{ id, name, category_type, prompt }] =
        data.marketBaskets &&
        data.marketBaskets[0] &&
        data.marketBaskets[0].categories

      const formData = {
        id,
        name,
        category_type,
        prompt,
      }
      setFormData(formData)
    }
  }, [loading])

  const [updateMarketBasketCategory] = useMutation(
    UPDATE_MARKET_BASKET_CATEGORY,
    {
      variables: { input: formData },
      onError: alert,
    }
  )

  const handleUpdate = (e) => {
    e.preventDefault()
    updateMarketBasketCategory()
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
    <form style={FORM_STYLE} onSubmit={handleUpdate}>
      <h3>Category Update Form</h3>
      <label>Name (required)</label>
      <input value={formData.name} onChange={handleNameOnChange} />
      <label>Category Type (required)</label>
      <Select
        value={{ label: formData.category_type, value: formData.category_type }}
        options={CATEGORY_TYPE_OPTIONS}
        onChange={handleCategoryTypeOnChange}
      />
      <label>Prompt</label>
      <input value={formData.prompt} onChange={handlePromptOnChange} />
      <Button>Update Category</Button>
    </form>
  )
}

export default CategoryUpdateForm
