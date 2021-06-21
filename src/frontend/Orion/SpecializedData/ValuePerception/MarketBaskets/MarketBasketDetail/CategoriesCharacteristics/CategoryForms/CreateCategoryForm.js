import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useMutation } from '@apollo/react-hooks'
import { useParams } from 'react-router-dom'
import Select from 'react-select'
import _ from 'lodash'

import { CREATE_MARKET_BASKET_CATEGORY } from 'frontend/api/mutations'
import { GET_MARKET_BASKETS_CATEGORIES } from 'frontend/api/queries'

import { SingleActionDialog } from 'frontend/components/Dialog'
import Spinner from 'frontend/components/Spinner'
import Input from 'frontend/components/Input'

import Spacing from 'frontend/utils/spacing'

import { CATEGORY_TYPE_OPTIONS, FormLabel } from './utils'

const MODAL_TITLE = `Create Category`

const CreateCategoryForm = ({ closeHandler, handleListItemSearchUpdate }) => {
  const { marketBasketId } = useParams()
  const [formData, setFormData] = useState({
    name: null,
    category_type: null,
    prompt: null,
  })

  const handleListItemCreate = (createMarketBasketCategory) => {
    if (!createMarketBasketCategory.id) return null
    handleListItemSearchUpdate({ category: createMarketBasketCategory.id })
  }

  const [
    createMarketBasketCategory,
    { loading: mutationLoading },
  ] = useMutation(CREATE_MARKET_BASKET_CATEGORY, {
    update: (cache, { data: { createMarketBasketCategory } }) => {
      const { marketBasketsCategories } = cache.readQuery({
        query: GET_MARKET_BASKETS_CATEGORIES,
        variables: { marketBasketId },
      })
      const orderedFullSetOfCategries = _.orderBy(
        [...marketBasketsCategories, createMarketBasketCategory],
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
    onCompleted: ({ createMarketBasketCategory }) => {
      closeHandler()
      handleListItemCreate(createMarketBasketCategory)
    },
  })

  const handleChange = ({ name, value }, inputKey) => {
    const key = inputKey || name
    setFormData((prevData) => ({ ...prevData, [key]: value }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    createMarketBasketCategory()
  }

  console.log(formData)

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
            <Select
              options={CATEGORY_TYPE_OPTIONS}
              onChange={(props) => handleChange(props, 'category_type')}
            />
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

CreateCategoryForm.propTypes = {
  closeHandler: PropTypes.func.isRequired,
  handleListItemSearchUpdate: PropTypes.func.isRequired,
}

export default CreateCategoryForm
