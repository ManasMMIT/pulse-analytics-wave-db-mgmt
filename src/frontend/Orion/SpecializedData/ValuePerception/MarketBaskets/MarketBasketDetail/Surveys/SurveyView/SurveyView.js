import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { useQuery } from '@apollo/react-hooks'

import { GET_MARKET_BASKETS_CATEGORIES } from 'frontend/api/queries'

import Spinner from 'frontend/components/Spinner'

import SurveyHeader from './SurveyHeader'
import SurveyTable from './SurveyTable'
import _ from 'lodash'

const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
})

const SurveyView = ({ selectedSurvey, marketBasketId, setSurvey }) => {
  const [selectedCategory, setCategory] = useState()
  const { id, date } = selectedSurvey

  const { data, loading } = useQuery(GET_MARKET_BASKETS_CATEGORIES, {
    variables: { marketBasketId: marketBasketId },
  })

  useEffect(() => {
    if (
      !selectedCategory &&
      !loading &&
      !_.isEmpty(data.marketBasketsCategories)
    ) {
      const { id: value, name } = data.marketBasketsCategories[0]
      setCategory({ value, label: name })
    }
  }, [data]) //eslint-disable-line

  if (loading) return <Spinner />

  const { marketBasketsCategories } = data
  const categories = data.marketBasketsCategories.map(({ id, name }) => ({
    value: id,
    label: name,
  }))

  const setTabCategory = (selectedId) => {
    const category = categories.find(({ value }) => value === selectedId)
    setCategory(category)
  }

  return (
    <Container>
      <SurveyHeader
        date={date}
        setTabCategory={setTabCategory}
        categories={categories}
        selectedCategory={selectedCategory}
        surveyId={id}
        setSurvey={setSurvey}
      />
      {selectedCategory && (
        <SurveyTable
          surveyId={id}
          selectedCategory={selectedCategory}
          marketBasketsCategories={marketBasketsCategories}
        />
      )}
    </Container>
  )
}

SurveyView.propTypes = {
  marketBasketId: PropTypes.string.isRequired,
  selectedSurvey: PropTypes.object.isRequired,
  setSurvey: PropTypes.func.isRequired,
}

export default SurveyView
