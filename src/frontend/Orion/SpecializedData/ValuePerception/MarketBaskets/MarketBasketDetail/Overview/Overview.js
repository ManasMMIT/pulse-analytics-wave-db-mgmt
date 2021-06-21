import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'

import Spacing from 'frontend/utils/spacing'

import MarketBasketDetailCard from './MarketBasketDetailCard'
import LastSurveys from './LastSurveys'
import SurveyStakeholderDetails from './SurveyStakeholderDetails'

const Container = styled.div({
  display: 'flex',
  flexWrap: 'wrap',
  padding: Spacing.S4,
  justifyContent: 'flex-end',
})

const Overview = ({ name, marketBasket }) => (
  <Container>
    <MarketBasketDetailCard name={name} marketBasket={marketBasket} />
    <LastSurveys />
    <SurveyStakeholderDetails />
  </Container>
)

Overview.propTypes = {
  name: PropTypes.string.isRequired,
  marketBasket: PropTypes.object.isRequired,
}

export default Overview
