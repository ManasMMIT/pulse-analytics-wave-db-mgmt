import React from 'react'
import { Mutation } from 'react-apollo'

import Spinner from '../Phoenix/shared/Spinner'

import { EMAIL_ALERTS } from '../api/mutations'

const Mercury = () => (
  <Mutation
    mutation={EMAIL_ALERTS}
  >
  {(emailAlerts, { loading, error }) => {
    if (loading) return <Spinner/>

    // add error alert

    const handleSubmit = () => {
      emailAlerts({
        variables: {
          input: {
            templateType: 'pathwaysAlerts',
            emailList: ['claire.kim@dedhamgroup.com'],
          }
        }
      })
    }

    return (
      <div style={{ padding: 24 }}>
        <h2>Follow instructions to send pathways email:</h2>
        <section>
          <ol>
            <li style={{ paddingBottom: 24 }}>Run <code>node ./prepEmailAlertsData</code> in wave-db-mgmt</li>
            <li><button onClick={handleSubmit}>Send Pathways Email</button></li>
          </ol>
        </section>
      </div>
    )
  }}
</Mutation>
)

export default Mercury