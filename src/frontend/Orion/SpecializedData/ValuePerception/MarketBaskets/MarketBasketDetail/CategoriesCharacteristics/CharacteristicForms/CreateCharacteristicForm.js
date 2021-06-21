import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { useParams, useLocation } from 'react-router-dom'
import _ from 'lodash'
import queryString from 'query-string'

import { CREATE_MARKET_BASKET_CATEGORY_CHARACTERISTIC } from 'frontend/api/mutations'
import { GET_MARKET_BASKETS_CATEGORIES } from 'frontend/api/queries'

import { SingleActionDialog } from 'frontend/components/Dialog'
import Spinner from 'frontend/components/Spinner'
import Input from 'frontend/components/Input'

import Spacing from 'frontend/utils/spacing'

import { FormLabel } from '../CategoryForms/utils'

const MODAL_TITLE = `Create Characteristic`

const CreateCharacteristicForm = ({
  closeHandler,
  handleListItemSearchUpdate,
}) => {
  const location = useLocation()
  const { marketBasketId } = useParams()

  const [formData, setFormData] = useState({
    name: undefined,
    description: undefined,
  })

  const {
    data: marketBasketCategoryData,
  } = useQuery(GET_MARKET_BASKETS_CATEGORIES, { variables: { marketBasketId } })

  const categoryId =
    (location.search &&
      queryString.parse(location.search) &&
      queryString.parse(location.search).category) ||
    ''

  const handleListItemCreate = (createMarketBasketCategoryCharacteristic) => {
    if (!createMarketBasketCategoryCharacteristic.id) return null
    handleListItemSearchUpdate({
      characteristic: createMarketBasketCategoryCharacteristic.id,
    })
  }

  const [
    createMarketBasketCategoryCharacteristic,
    { loading: mutationLoading },
  ] = useMutation(CREATE_MARKET_BASKET_CATEGORY_CHARACTERISTIC, {
    update: (cache, { data: { createMarketBasketCategoryCharacteristic } }) => {
      const clonedMarketBasketCategories = _.cloneDeep(
        marketBasketCategoryData.marketBasketsCategories
      )
      const categoryIdx = _.findIndex(
        clonedMarketBasketCategories,
        ({ id }) => id === categoryId
      )

      const newCategoryCharacteristicsFull = _.orderBy(
        [
          ...clonedMarketBasketCategories[categoryIdx].characteristics_full,
          createMarketBasketCategoryCharacteristic,
        ],
        '_order'
      )

      clonedMarketBasketCategories[
        categoryIdx
      ].characteristics_full = newCategoryCharacteristicsFull

      cache.writeQuery({
        query: GET_MARKET_BASKETS_CATEGORIES,
        variables: { marketBasketId },
        data: { marketBasketsCategories: clonedMarketBasketCategories },
      })
    },
    variables: {
      input: { category: categoryId, ...formData },
    },
    onCompleted: ({ createMarketBasketCategoryCharacteristic }) => {
      closeHandler()
      handleListItemCreate(createMarketBasketCategoryCharacteristic)
    },
  })

  const handleChange = ({ name, value }) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    createMarketBasketCategoryCharacteristic()
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
            <FormLabel>Characteristic Name (required)</FormLabel>
            <Input
              name="name"
              type="text"
              onChange={handleChange}
              value={formData.name}
            />
          </section>
          <section>
            <FormLabel>Description</FormLabel>
            <Input
              name="description"
              type="text"
              onChange={handleChange}
              value={formData.description}
            />
          </section>
        </form>
      )}
    </SingleActionDialog>
  )
}

CreateCharacteristicForm.propTypes = {
  closeHandler: PropTypes.func.isRequired,
  handleListItemSearchUpdate: PropTypes.func.isRequired,
}

export default CreateCharacteristicForm
