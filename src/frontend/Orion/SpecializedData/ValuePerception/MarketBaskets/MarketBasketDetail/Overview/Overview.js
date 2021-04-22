import React from 'react'

import MarketBasketDetailCard from './MarketBasketDetailCard'
import LastSurveys from './LastSurveys'
import SurveyStakeholderDetails from './SurveyStakeholderDetails'

const Overview = ({ name, marketBasket }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        padding: 12,
        justifyContent: 'flex-end',
      }}
    >
      <MarketBasketDetailCard name={name} marketBasket={marketBasket} />
      <LastSurveys />
      <SurveyStakeholderDetails />
    </div>
  )
}

export default Overview
