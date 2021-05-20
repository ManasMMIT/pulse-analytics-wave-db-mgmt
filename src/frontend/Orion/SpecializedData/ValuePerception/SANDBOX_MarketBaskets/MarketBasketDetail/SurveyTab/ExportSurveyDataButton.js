import React, { useState, useEffect } from 'react'
import { useLazyQuery } from '@apollo/react-hooks'
import { useParams } from 'react-router'
import socket from 'frontend/api/socket'

import { GET_MARKET_BASKET_SURVEY_EXPORT_DATA } from 'frontend/api/queries'
import Spinner from 'frontend/components/Spinner'
import ExportExcelButton from 'frontend/components/ExportExcelButton'
import Button from 'frontend/components/Button'
import Icon from 'frontend/components/Icon'
import Color from 'frontend/utils/color'

const DEFAULT_NOTIFICATION = '✅ Good to generate export'

const ExportSurveyDataButton = ({ surveyId }) => {
  const [notification, setNotification] = useState(DEFAULT_NOTIFICATION)
  const [generateExportStatus, setGenerateExportStatus] = useState(null)
  const { marketBasketId } = useParams()

  const [getExportData, { data, loading }] = useLazyQuery(
    GET_MARKET_BASKET_SURVEY_EXPORT_DATA,
    {
      variables: { marketBasketId, surveyId },
      fetchPolicy: 'network-only',
    }
  )

  useEffect(() => {
    socket.on('GENERATE_SURVEY_DATA_EXPORT', setNotification)
  }, [])

  useEffect(() => {
    setGenerateExportStatus(notification)
  }, [notification])

  if (loading) return <Spinner />

  // ! Likely want to hold data in state and disable the button after generating exprt data
  // * this will force users to export again, if they don't have the sheet handy or changed something.
  const exportData = data
    ? Object.values(data)[0].map(({ __typename, ...rest }) => rest)
    : []

  return (
    <>
      <Button onClick={getExportData}>Generate Export Data</Button>
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
        {generateExportStatus}
        {loading ? <Spinner /> : 'Export to Excel'}
      </ExportExcelButton>
    </>
  )
}

export default ExportSurveyDataButton
