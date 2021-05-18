import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { useParams } from 'react-router'

import { GET_MARKET_BASKET_SURVEY_EXPORT_DATA } from 'frontend/api/queries'
import Spinner from 'frontend/components/Spinner'
import ExportExcelButton from 'frontend/components/ExportExcelButton'
import Icon from 'frontend/components/Icon'
import Color from 'frontend/utils/color'

const ExportSurveyDataButton = ({ surveyId }) => {
  const { marketBasketId } = useParams()

  const { data, loading } = useQuery(
    GET_MARKET_BASKET_SURVEY_EXPORT_DATA,
    { variables: { marketBasketId, surveyId } }
  )

  if (loading) return <Spinner />

  const exportData = Object.values(data)[0].map(({ __typename, ...rest }) => rest)

  return (
    <ExportExcelButton
      filename="market-basket-survey-export" // TODO make more specific
      data={exportData}
      buttonStyle={{
        margin: '0 0 12px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Icon
        iconName="export"
        color1={Color.PRIMARY}
        width={16}
        height={16}
        style={{ marginRight: 8 }}
      />
        Export to Excel
    </ExportExcelButton>
  )
}

export default ExportSurveyDataButton
