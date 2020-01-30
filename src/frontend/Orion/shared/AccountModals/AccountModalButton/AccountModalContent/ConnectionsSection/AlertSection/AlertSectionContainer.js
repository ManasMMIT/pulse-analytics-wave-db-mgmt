import React from 'react'
import moment from 'moment'

import AlertSection from './AlertSection'
import FetchedAlertSection from './FetchedAlertSection'

const AlertSectionContainer = ({ alert, connection, hydrateConnectionAlert }) => {
  if (typeof alert === 'string') {
    return (
      <FetchedAlertSection
        alertId={alert}
        connection={connection}
        hydrateConnectionAlert={hydrateConnectionAlert}
      />
    )
  } else if (!alert || !alert.alertDate) { // ! guard against alertDate undefined when creating connection because moment will make that today's date
    return null
  }

  return (
    <AlertSection
      alertDate={moment(alert.alertDate).format('L')}
      alertDescription={alert.alertDescription}
      alertType={alert.alertType}  
    />
  )
}

export default AlertSectionContainer
