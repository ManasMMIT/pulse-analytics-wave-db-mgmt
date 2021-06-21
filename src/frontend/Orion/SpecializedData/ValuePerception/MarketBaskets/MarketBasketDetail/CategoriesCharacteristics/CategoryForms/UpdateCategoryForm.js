import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { useParams, useLocation } from 'react-router-dom'
import queryString from 'query-string'
import _ from 'lodash'
import Select from 'react-select'

import { UPDATE_MARKET_BASKET_CATEGORY } from 'frontend/api/mutations'
import { GET_MARKET_BASKETS_CATEGORIES } from 'frontend/api/queries'

import { SingleActionDialog } from 'frontend/components/Dialog'
import Spinner from 'frontend/components/Spinner'
import Input from 'frontend/components/Input'

import Spacing from 'frontend/utils/spacing'

import { FormLabel } from './utils'

const MODAL_TITLE = 'Update Category'

const UpdateCategoryForm = ({ closeHandler }) => {
  const params = useParams()
  const location = useLocation()

  const { marketBasketId } = params

  const categoryId =
    (location.search &&
      queryString.parse(location.search) &&
      queryString.parse(location.search).category) ||
    ''

  const [formData, setFormData] = useState({
    id: categoryId,
    name: null,
    prompt: null,
  })
  const [categoryType, setCategoryType] = useState(null)

  const { data, loading } = useQuery(GET_MARKET_BASKETS_CATEGORIES, {
    variables: { marketBasketId },
  })

  useEffect(() => {
    if (!loading) {
      const { marketBasketsCategories } = data
      const selectedCatData = marketBasketsCategories.find(
        ({ id }) => id === categoryId
      )

      if (selectedCatData) {
        const { name, category_type, prompt } = selectedCatData
        setFormData({ id: categoryId, name, prompt })
        setCategoryType(category_type)
      }
    }
  }, [categoryId, data, data.marketBaskets, loading])

  const [
    updateMarketBasketCategory,
    { loading: mutationLoading },
  ] = useMutation(UPDATE_MARKET_BASKET_CATEGORY, {
    variables: { input: formData },
    onError: alert,
    onCompleted: () => closeHandler(),
  })

  const handleChange = ({ name, value }, inputKey) => {
    const key = inputKey || name
    setFormData((prevData) => ({ ...prevData, [key]: value }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    updateMarketBasketCategory()
  }

  const selectedCategoryValue = {
    label: categoryType ? _.capitalize(categoryType) : null,
    value: categoryType,
  }

  return (
    <SingleActionDialog
      header={MODAL_TITLE}
      submitText={MODAL_TITLE}
      cancelHandler={closeHandler}
      submitHandler={onSubmit}
    >
      {mutationLoading ? (
        <Spinner />
      ) : (
        <form style={{ padding: Spacing.S7 }}>
          <section>
            <FormLabel>Name (required)</FormLabel>
            <Input
              name="name"
              type="text"
              onChange={handleChange}
              value={formData.name}
            />
          </section>
          <section>
            <FormLabel>Category Type (required)</FormLabel>
            <Select value={selectedCategoryValue} isDisabled />
          </section>
          <section>
            <FormLabel>Prompt</FormLabel>
            <Input
              name="prompt"
              type="text"
              onChange={handleChange}
              value={formData.prompt}
            />
          </section>
        </form>
      )}
    </SingleActionDialog>
  )
}

UpdateCategoryForm.propTypes = {
  closeHandler: PropTypes.func.isRequired,
}

export default UpdateCategoryForm
