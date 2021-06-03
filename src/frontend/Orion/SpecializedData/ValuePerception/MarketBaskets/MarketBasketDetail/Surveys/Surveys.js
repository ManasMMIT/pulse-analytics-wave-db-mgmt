import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/react-hooks'
import { useHistory } from 'react-router-dom'
import _ from 'lodash'
import queryString from 'query-string'

import { GET_MARKET_BASKETS_SURVEYS } from 'frontend/api/queries'

import Spinner from 'frontend/components/Spinner'

import Color from 'frontend/utils/color'

import SurveysPanel from './SurveysPanel'
import SurveyView from './SurveyView'
import MarketBasketContext from './MarketBasketContext'

const getSortedSurveys = (surveys) => _.orderBy(surveys, ['date'], ['desc'])

const getSelectedSurvey = ({ search }) => {
  const parsedSearch = queryString.parse(search)
  const selectedTab = parsedSearch && parsedSearch.tab ? parsedSearch.tab : null

  const selectedSurvey =
    parsedSearch && parsedSearch.tab ? parsedSearch.survey : null

  return { selectedSurvey, selectedTab }
}

const Surveys = ({ marketBasket }) => {
  const history = useHistory()

  const { selectedTab, selectedSurvey } = getSelectedSurvey(history.location)
  const { data, loading } = useQuery(GET_MARKET_BASKETS_SURVEYS, {
    variables: { marketBasketId: marketBasket.id },
  })

  const setSurvey = (survey) => {
    history.push({
      search: queryString.stringify({ tab: selectedTab, survey }),
    })
  }

  useEffect(() => {
    const { selectedSurvey } = getSelectedSurvey(history.location)

    if (!selectedSurvey && !loading) {
      const { marketBasketsSurveys } = data
      if (_.isEmpty(marketBasketsSurveys)) return
      const sortedSurveys = getSortedSurveys(marketBasketsSurveys)

      setSurvey(sortedSurveys[0].id)
    }
  }, [data]) //eslint-disable-line

  if (loading) return <Spinner />
  if (!data) return <div>no data!</div>

  const { marketBasketsSurveys } = data
  const selectedMarketBasketSurvey = marketBasketsSurveys.find(
    ({ id }) => id === selectedSurvey
  )
  const { id: marketBasketId, name: marketBasketName } = marketBasket
  const selectedSurveyId = selectedMarketBasketSurvey
    ? selectedMarketBasketSurvey.id
    : null

  return (
    <MarketBasketContext.Provider value={{ marketBasketId, marketBasketName }}>
      <div style={{ background: Color.WHITE, height: '100%', display: 'flex' }}>
        <SurveysPanel
          marketBasketsSurveys={marketBasketsSurveys}
          setSurvey={setSurvey}
          selectedSurveyId={selectedSurveyId}
        />
        {selectedMarketBasketSurvey && (
          <SurveyView
            selectedSurvey={selectedMarketBasketSurvey}
            setSurvey={setSurvey}
            marketBasketId={marketBasketId}
          />
        )}
      </div>
    </MarketBasketContext.Provider>
  )
}

Surveys.propTypes = {
  marketBasket: PropTypes.object.isRequired,
}

export default Surveys
