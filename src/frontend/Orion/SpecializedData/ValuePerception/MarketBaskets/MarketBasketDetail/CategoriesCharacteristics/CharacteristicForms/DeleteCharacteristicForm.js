import React from 'react'
import PropTypes from 'prop-types'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { useParams, useLocation } from 'react-router-dom'
import queryString from 'query-string'
import _ from 'lodash'

import { GET_MARKET_BASKETS_CATEGORIES } from 'frontend/api/queries'
import { DELETE_MARKET_BASKET_CATEGORY_CHARACTERISTIC } from 'frontend/api/mutations'

import Spinner from 'frontend/components/Spinner'
import { SingleActionDialog } from 'frontend/components/Dialog'

import Color from 'frontend/utils/color'
import FontSpace from 'frontend/utils/fontspace'

import { BoldText } from '../CategoryForms/utils'

const DeleteCharacteristicForm = ({
  closeHandler,
  characteristics,
  handleListItemSearchUpdate,
}) => {
  const location = useLocation()
  const { marketBasketId } = useParams()

  let categoryId = ''
  let characteristicId = ''
  if (location.search && queryString.parse(location.search)) {
    categoryId = queryString.parse(location.search).category
    characteristicId = queryString.parse(location.search).characteristic
  }

  const handleListItemDelete = () => {
    if (_.isEmpty(characteristics)) {
      handleListItemSearchUpdate({ characteristic: undefined })
    } else {
      handleListItemSearchUpdate({ characteristic: characteristics[0].id })
    }
  }

  const {
    data: marketBasketCategoryData,
    loading: dataLoading,
  } = useQuery(GET_MARKET_BASKETS_CATEGORIES, { variables: { marketBasketId } })

  const [
    deleteMarketBasketCategoryCharacteristic,
    { loading: mutationLoading },
  ] = useMutation(DELETE_MARKET_BASKET_CATEGORY_CHARACTERISTIC, {
    variables: { input: { id: characteristicId } },
    update: (cache, { data: { deleteMarketBasketCategoryCharacteristic } }) => {
      const clonedCategoryData = _.cloneDeep(
        marketBasketCategoryData.marketBasketsCategories
      )
      const categoryInQuestionIdx = clonedCategoryData.findIndex(
        ({ id }) => id === categoryId
      )

      clonedCategoryData[
        categoryInQuestionIdx
      ].characteristics_full = clonedCategoryData[
        categoryInQuestionIdx
      ].characteristics_full.filter(
        ({ id }) => id !== deleteMarketBasketCategoryCharacteristic.id
      )

      cache.writeQuery({
        query: GET_MARKET_BASKETS_CATEGORIES,
        variables: { marketBasketId },
        data: { marketBasketsCategories: clonedCategoryData },
      })
    },
    onError: alert,
    onCompleted: () => {
      closeHandler()
      handleListItemDelete()
    },
  })

  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    deleteMarketBasketCategoryCharacteristic()
  }

  const shouldShowSpinner = mutationLoading || dataLoading

  let categoryName
  let surveyDate = 'Survey Date' // ! TODO: claire fill in later
  let characteristicName
  if (!dataLoading) {
    const selectedCategoryData = marketBasketCategoryData.marketBasketsCategories.find(
      ({ id }) => id === categoryId
    )
    if (selectedCategoryData) {
      categoryName = selectedCategoryData.name
      if (!_.isEmpty(selectedCategoryData.characteristics_full)) {
        const selectedCharacteristicData = selectedCategoryData.characteristics_full.find(
          ({ id }) => id === characteristicId
        )
        if (selectedCharacteristicData) {
          characteristicName = selectedCharacteristicData.name
        }
      }
    }
  }

  return (
    <SingleActionDialog
      header="Delete Characteristic"
      submitText="Delete Forever"
      submitHandler={handleClick}
      cancelHandler={closeHandler}
      headerStyle={{ color: Color.RED }}
      submitColor={Color.RED}
      contentStyle={{ width: 450 }}
    >
      {shouldShowSpinner ? (
        <Spinner />
      ) : (
        <div style={{ padding: 36, textAlign: 'center', ...FontSpace.FS3 }}>
          <p>
            Are you sure you want to delete the
            <BoldText> {characteristicName}</BoldText> Characteristic from the
            <BoldText> {categoryName}</BoldText> Category from the
            <BoldText> {surveyDate}</BoldText> Survey? This will delete all
            stakeholder survey data, from the <BoldText>{surveyDate}</BoldText>
            Survey associated with this characteristic. Other surveys will
            remain unchanged. Reminder that in order to delete this
            characteristic from multiple or all surveys, you must go into each
            survey and delete the characteristic.
          </p>
          <p style={{ fontWeight: 700, marginTop: 12 }}>
            THIS CANNOT BE UNDONE
          </p>
        </div>
      )}
    </SingleActionDialog>
  )
}

DeleteCharacteristicForm.propTypes = {
  closeHandler: PropTypes.func.isRequired,
  characteristics: PropTypes.array.isRequired,
  handleListItemSearchUpdate: PropTypes.func.isRequired,
}

export default DeleteCharacteristicForm
