import React from 'react'
import { useQuery } from '@apollo/client'

import {
  GET_ALERT,
} from './../../../../../../../api/queries'

import AlertSection from './AlertSection'

const FetchedAlertSection = ({ alertId, connection, hydrateConnectionAlert }) => {
  const { data, loading } = useQuery(
    GET_ALERT,
    {
      variables: { _id: alertId },
      // fetchPolicy: 'network-only',
    }
  )

  let alertData = {
    alertDate: 'Loading...',
    alertDescription: 'Loading...',
    alertType: 'Loading',
  }

  if (!loading) {
    const { date, description, type } = data.alert

    alertData = {
      alertDate: date,
      alertDescription: description,
      alertType: type,
    }

    hydrateConnectionAlert(connection, alertData)
  }

  return (
    <AlertSection {...alertData} />
  )
}

export default FetchedAlertSection
