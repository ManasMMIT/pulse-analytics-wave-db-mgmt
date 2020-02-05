import React from 'react'

import AlertSection from './AlertSection'
import FetchedAlertSection from './FetchedAlertSection'

import { formatDayMonthYearShort } from '../../../../../../../utils/formatDate'

const AlertSectionContainer = ({ alert, connection, hydrateConnectionAlert }) => {
  if (typeof alert === 'string') {
    return (
      <FetchedAlertSection
        alertId={alert}
        connection={connection}
        hydrateConnectionAlert={hydrateConnectionAlert}
      />
    )
  } else if (!alert || !alert.alertDate) {
    return null
  }

  return (
    <AlertSection
      alertDate={formatDayMonthYearShort(alert.alertDate)} // alertDate should always stored be stored in React local state in ISO format but we want it displayed differently 
      alertDescription={alert.alertDescription}
      alertType={alert.alertType}  
    />
  )
}

export default AlertSectionContainer
