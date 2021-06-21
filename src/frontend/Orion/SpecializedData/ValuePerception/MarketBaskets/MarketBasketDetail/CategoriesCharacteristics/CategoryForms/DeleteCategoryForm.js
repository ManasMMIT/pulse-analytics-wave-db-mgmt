import React from 'react'
import PropTypes from 'prop-types'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { useParams, useLocation } from 'react-router-dom'
import queryString from 'query-string'
import _ from 'lodash'

import { GET_MARKET_BASKETS_CATEGORIES } from 'frontend/api/queries'
import { DELETE_MARKET_BASKET_CATEGORY } from 'frontend/api/mutations'

import Spinner from 'frontend/components/Spinner'
import { SingleActionDialog } from 'frontend/components/Dialog'

import Color from 'frontend/utils/color'
import FontSpace from 'frontend/utils/fontspace'

import { BoldText } from './utils'

const DeleteCategoryForm = ({
  closeHandler,
  categories,
  handleListItemSearchUpdate,
}) => {
  const location = useLocation()
  const { marketBasketId } = useParams()

  const categoryId =
    (location.search &&
      queryString.parse(location.search) &&
      queryString.parse(location.search).category) ||
    ''

  const handleListItemDelete = () => {
    if (_.isEmpty(categories)) {
      handleListItemSearchUpdate({ category: undefined })
    } else {
      handleListItemSearchUpdate({ category: categories[0].id })
    }
  }

  const {
    data: marketBasketCategoryData,
    loading: dataLoading,
  } = useQuery(GET_MARKET_BASKETS_CATEGORIES, { variables: { marketBasketId } })

  const [
    deleteMarketBasketCategory,
    { loading: mutationLoading },
  ] = useMutation(DELETE_MARKET_BASKET_CATEGORY, {
    variables: { input: { id: categoryId } },
    update: (cache, { data: { deleteMarketBasketCategory } }) => {
      const newCachedCategories = marketBasketCategoryData.marketBasketsCategories.filter(
        ({ id }) => id !== deleteMarketBasketCategory.id
      )

      cache.writeQuery({
        query: GET_MARKET_BASKETS_CATEGORIES,
        variables: { marketBasketId },
        data: { marketBasketsCategories: newCachedCategories },
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
    deleteMarketBasketCategory()
  }

  const shouldShowSpinner = mutationLoading || dataLoading

  let categoryName
  let surveyDate = 'Survey Date' // ! TODO: claire fill in later
  if (!dataLoading) {
    const selectedCategoryData = marketBasketCategoryData.marketBasketsCategories.find(
      ({ id }) => id === categoryId
    )
    if (selectedCategoryData) {
      categoryName = selectedCategoryData.name
    }
  }

  return (
    <SingleActionDialog
      header="Delete Category"
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
            <BoldText> {categoryName}</BoldText> Category from the
            <BoldText> {surveyDate}</BoldText> Survey? This will delete all
            stakeholder survey data, from the <BoldText>{surveyDate} </BoldText>
            Survey associated with this category. Other surveys will remain
            unchanged. Reminder that in order to delete this category from
            multiple or all surveys, you must go into each survey and delete the
            category.
          </p>
          <p style={{ fontWeight: 700, marginTop: 12 }}>
            THIS CANNOT BE UNDONE
          </p>
        </div>
      )}
    </SingleActionDialog>
  )
}

DeleteCategoryForm.propTypes = {
  closeHandler: PropTypes.func.isRequired,
  handleListItemSearchUpdate: PropTypes.func.isRequired,
  categories: PropTypes.array.isRequired,
}

export default DeleteCategoryForm
